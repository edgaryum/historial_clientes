const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const { error } = require('console');
const jwt = require('jsonwebtoken'); //requerido para proceso de autenticacion segura
const { constants } = require('buffer');
const bcrypt = require('bcryptjs');
const { url } = require('inspector');

const app = express();
const port = 5000;

// Configurar Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configurar multer para manejar archivos PDF e imagenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        // Validar que sea un archivo de imagen o PDF
        if (!file.mimetype.startsWith('image/') && file.mimetype !== 'application/pdf') {
            return cb(new Error('Solo se permiten archivos de imagen o PDF'));
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5 MB
});

// Crear o abrir la base de datos SQLite
const db = new sqlite3.Database('./actividad-clientes.db', (err) => {
    if (err) {
        console.error('Error al conectar la base de datos: ', err.message);
    } else {
        console.log('Conexión exitosa con SQLite');
    }
});

// Crear las tablas si no existen
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS actividades (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            cliente_id INTEGER,
            fecha TEXT NOT NULL, 
            descripcion TEXT NOT NULL, 
            pdf TEXT, 
            urlFoto TEXT,
            FOREIGN KEY(cliente_id) REFERENCES clientes(id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            telefono TEXT NOT NULL,
            correo TEXT NOT NULL,
            encargado TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY,
            nombre TEXT NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS vigilantes (
            id INTEGER PRIMARY KEY,
            nombre TEXT NOT NULL,
            fechaNacimiento TEXT NOT NULL,
            direccion TEXT NOT NULL,
            telefono TEXT NOT NULL,
            estado TEXT NOT NULL,
            foto TEXT
        )
    `);
});

// Ruta para agregar una nuevo vigilante
app.post('/vigilantes', upload.single('foto'), (req, res) => {
    const { id, nombre, fechaNacimiento, direccion, telefono, estado } = req.body;
    const foto = req.file ? req.file.path : null;

    const stmt = db.prepare('INSERT INTO vigilantes (id, nombre, fechaNacimiento, direccion, telefono, estado, foto) VALUES (?, ?, ?, ?, ?, ?, ?)');
    stmt.run(id, nombre, fechaNacimiento, direccion, telefono, estado, foto, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
    stmt.finalize();
});

// Ruta para obtener la lista de vigilantes
app.get('/vigilantes', (req, res) => {
    const stmt = db.prepare('SELECT * FROM vigilantes');

    stmt.all((err, rows) => {
        if (err) {
            console.error(err); // Log error for debugging
            return res.status(500).json({ error: 'Error al obtener los usuarios' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ error: 'No se encontraron usuarios' });
        }

        res.status(200).json(rows); // Devuelve la lista de usuarios
    });

    stmt.finalize();
});

//ruta para obtener un vigilante por cedula
app.get('/vigilantes/:id', (req, res) => {
    const {id} = req.params;

    const stmt = db.prepare('SELECT * FROM vigilantes WHERE id = ?');
    stmt.get(id, (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ eeror: 'error al otener el vigilante'});
        }

        if (!row) {
            return res.status(404).json({ error: 'vigilante no encontrado'});
        }

        res.status(200).json(row);
    });

    stmt.finalize();
});


//ruta para agregar un nuevo usuario
app.post('/usuarios', async (req, res) => {
    const { id, nombre, password, role } = req.body;

    try {
        //cifrar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const stmt = db.prepare(`INSERT INTO usuarios (id, nombre, password, role) VALUES (?, ?, ?, ?)`);
        stmt.run(id, nombre, hashedPassword, role, function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ id: this.lastID });
        });
        stmt.finalize();
    } catch (error) {
        res.status(500).json({ error: 'error añ crear el usuario' });
    }
});

// Ruta para obtener la lista de usuarios
app.get('/usuarios', (req, res) => {
    const stmt = db.prepare('SELECT * FROM usuarios');

    stmt.all((err, rows) => {
        if (err) {
            console.error(err); // Log error for debugging
            return res.status(500).json({ error: 'Error al obtener los usuarios' });
        }

        if (rows.length === 0) {
            return res.status(404).json({ error: 'No se encontraron usuarios' });
        }

        res.status(200).json(rows); // Devuelve la lista de usuarios
    });

    stmt.finalize();
});

// Ruta para obtener un usuario específico por su ID
app.get('/usuarios/:id', (req, res) => {
    const { id } = req.params;

    db.get('SELECT * FROM usuarios WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.json(row); // Devuelve el usuario específico
    });
});

// Ruta para editar usuarios
app.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, password, role } = req.body;

    if (!nombre || !password || !role) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    try {
        // Cifrar la nueva contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Preparamos la consulta para actualizar el usuario
        const stmt = db.prepare(`
            UPDATE usuarios
            SET nombre = ?, password = ?, role = ?
            WHERE id = ?
        `);

        stmt.run([nombre, hashedPassword, role, id], function (err) {
            if (err) {
                console.error(err); // Mostrar detalles del error en el servidor para depuración
                return res.status(500).json({ error: 'Error al actualizar el usuario: ' + err.message });
            }

            // Si no se encuentra el usuario
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            // Responder con el éxito
            res.status(200).json({ message: 'Usuario actualizado exitosamente' });
        });

        stmt.finalize();
    } catch (error) {
        console.error(error); // Mostrar detalles del error en el servidor para depuración
        res.status(500).json({ error: 'Error interno del servidor: ' + error.message });
    }
});

//clave secreta para JWT
const SECRET_KEY = "Secreto_Super_Seguro";

//ruta para inicio de sesion
app.post('/login', (req, res) => {
    const { id, password } = req.body;

    //buscar usuario en la base de datos
    const stmt = db.prepare('SELECT * FROM usuarios WHERE id = ?');
    stmt.get(id, async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'error en la base de datos' });
        }
        //verifica el usuario
        if (!user) {
            return res.status(401).json({ error: 'usuario no encontrado' });
        }

        //verificar la contraseña
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: 'contraseña incorrecta' });
        }

        //generar un token jwt
        const token = jwt.sign(
            { id: user.id, role: user.role, nombre: user.nombre },//datos incluidos en el token
            SECRET_KEY, //clave secreta
            { expiresIn: '5m' } //expiracion del token
        );
        //enviar el token y el rol al cliente
        res.json({ token, role: user.role, nombre: user.nombre });
    });
    stmt.finalize();
});

// Ruta para agregar una nueva actividad
app.post('/actividad', upload.single('pdf'), (req, res) => {
    const { cliente, fecha, descripcion, urlFoto } = req.body;

    const cliente_id = parseInt(cliente, 10); // Asegúrate de convertir el ID a número
    if (isNaN(cliente_id)) {
        return res.status(400).json({ error: 'ID de cliente inválido' });
    }

    const pdf = req.file ? req.file.path : null;

    const stmt = db.prepare('INSERT INTO actividades (cliente_id, fecha, descripcion, pdf, urlFoto) VALUES (?, ?, ?, ?, ?)');
    stmt.run(cliente_id, fecha, descripcion, pdf, urlFoto, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
    stmt.finalize();
});

//ruta para editar los datos por medio de su ID
app.put('/actividades/:id', (req, res) => {
    const { id } = req.params;
    const { cliente, fecha, descripcion, urlFoto } = req.body;

    const stmt = db.prepare(`
        UPDATE actividades
        SET cliente_id = ?, fecha = ?, descripcion = ?, urlFoto = ?
      WHERE id = ?
    `);

    stmt.run([cliente, fecha, descripcion, urlFoto, id], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar la actividad: ' + err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Actividad no encontrada' });
        }

        res.status(200).json({ message: 'Actividad actualizada exitosamente' });
    });
    stmt.finalize();
});

// Ruta para obtener actividades por cliente o fecha
app.get('/actividades', (req, res) => {
    const { cliente, fecha } = req.query;

    let query =
        `SELECT a.id, c.nombre AS cliente, a.fecha, a.descripcion, a.pdf, a.urlFoto
        FROM actividades a
        JOIN clientes c ON a.cliente_id = c.id
        WHERE 1=1`
        ;
    const params = [];

    if (cliente) {
        query += ' AND c.nombre LIKE ?';
        params.push(`%${cliente}%`);
    }
    if (fecha) {
        query += ' AND a.fecha LIKE ?';
        params.push(`%${fecha}%`);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Ruta para obtener un cliente específico por su ID
app.get('/clientes/:id', (req, res) => {
    const { id } = req.params;

    db.get('SELECT * FROM clientes WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.json(row); // Devuelve el cliente específico
    });
});

// Ruta para obtener el listado de clientes
app.get('/clientes', (req, res) => {
    db.all('SELECT id, nombre FROM clientes', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows); // Devuelve la lista de clientes como un array de objetos
    });
});

// Ruta para actualizar el cliente
app.put('/clientes/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, telefono, correo, encargado } = req.body;

    const stmt = db.prepare(`
        UPDATE clientes
        SET nombre = ?, telefono = ?, correo = ?, encargado = ?
        WHERE id = ?
    `);

    stmt.run([nombre, telefono, correo, encargado, id], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Error al actualizar el cliente: ' + err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        res.status(200).json({ message: 'Cliente actualizado exitosamente' });
    });

    stmt.finalize();
});

// Ruta para agregar un nuevo cliente
app.post('/clientes', (req, res) => {
    const { nombre, telefono, correo, encargado } = req.body;
    const stmt = db.prepare('INSERT INTO clientes (nombre, telefono, correo, encargado) VALUES (?, ?, ?, ?)');
    stmt.run(nombre, telefono, correo, encargado, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
    stmt.finalize();
});

// Ruta para descargar un PDF directamente
app.get('/descargar/:nombre', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.nombre);
    res.download(filePath, (err) => {
        if (err) {
            res.status(404).json({ error: 'Archivo no encontrado' });
        }
    });
});

// Iniciar el servidor
app.listen(port, 'localhost', () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
