// Archivo: crearUsuario.js

const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// Configurar la base de datos
const db = new sqlite3.Database('./actividad-clientes.db');

// Datos del nuevo usuario
const nuevoUsuario = {
  id: 1035865319,
  nombre: 'JOSE EDUARDO VELEZ LOPEZ',
  password: 'Edward2582405.',
  role: 'admin'
};

// Función para crear el usuario
async function crearUsuario() {
  try {
    // Cifrar la contraseña
    const hash = await bcrypt.hash(nuevoUsuario.password, 10);

    // Insertar el usuario en la tabla
    db.run(
      `INSERT INTO usuarios (id, nombre, password, role) VALUES (?, ?, ?, ?)`,
      [nuevoUsuario.id, nuevoUsuario.nombre, hash, nuevoUsuario.role],
      function (err) {
        if (err) {
          console.error('Error al insertar el usuario:', err.message);
        } else {
          console.log('Usuario creado exitosamente.');
        }
      }
    );
  } catch (error) {
    console.error('Error al crear el usuario:', error);
  } finally {
    db.close();
  }
}

crearUsuario();
