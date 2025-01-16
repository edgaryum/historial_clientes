import React, { useState, useEffect } from "react";
import "./css/Actividad.css";
import Boton from "./Boton"; // importamos el boton reutilizable
import InputField from "./InputField"; //importamos el componente input reutilizable

interface Actividad {
    cliente: string;
    fecha: string;
    descripcion: string;
    pdf?: File | null;
    urlFoto?: string;
}

interface Cliente {
    id: number;
    nombre: string;
}

const ActividadForm: React.FC = () => {
    const [actividad, setActividad] = useState<Actividad>({
        cliente: '',
        fecha: '',
        descripcion: '',
        pdf: null as File | null,
        urlFoto: '',
    });

    const [clientes, setClientes] = useState<Cliente[]>([]); // Lista de clientes
    const [mensaje, setMensaje] = useState<string | null>(null);

    // Cargar los clientes desde el servidor
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                //const response = await fetch('http://localhost:5000/clientes');
                const response = await fetch('http://192.168.1.90:5000/clientes');
                if (response.ok) {
                    const data: Cliente[] = await response.json();
                    setClientes(data);
                } else {
                    console.error("Error al cargar los clientes");
                }
            } catch (error) {
                console.error("Error al conectar con el servidor", error);
            }
        };
        fetchClientes();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setActividad((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleValueChange = (name: string, value: string) => {
        setActividad((prev) => prev && { ...prev, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.type !== 'application/pdf') {
                setMensaje('Por favor selecciona un archivo PDF válido.');
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB
                setMensaje('El archivo PDF no debe exceder los 5MB.');
                return;
            }
            setActividad((prev) => ({
                ...prev,
                pdf: file,
            }));
            setMensaje(null); // Restablecer mensaje de error
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validar que todos los campos estén completos
        if (!actividad.cliente || !actividad.fecha || !actividad.descripcion) {
            setMensaje("Por favor complete todos los campos.");
            return;
        }

        const formData = new FormData();
        formData.append('cliente', actividad.cliente); // Agregamos el nombre del cliente
        formData.append('fecha', actividad.fecha); // Agregamos la fecha del evento
        formData.append('descripcion', actividad.descripcion); // Agregamos la descripción del evento
        if (actividad.pdf) {
            formData.append('pdf', actividad.pdf); // Agregamos el archivo PDF
        }
        formData.append('urlFoto', actividad.urlFoto || ''); // Agregamos la URL de la foto (puede ser vacía)

        try {
            //const response = await fetch('http://localhost:5000/actividad', {
                const response = await fetch('http://192.168.1.90:5000/actividad', {
                method: 'POST',
                body: formData, // Enviamos el FormData con el archivo PDF y la URL
            });

            if (response.ok) {
                setMensaje('Actividad registrada exitosamente');
                setActividad({ cliente: '', fecha: '', descripcion: '', pdf: null, urlFoto: '' }); // Limpiamos el formulario
            } else {
                const errorData = await response.json();
                setMensaje(`Error: ${errorData.error}`);
            }
        } catch (error) {
            setMensaje('Error al enviar los datos');
        }
    };

    return (
        <div className="actividad-form-container">
        <form onSubmit={handleSubmit}>
            <h2>Registrar Actividad</h2>
            <label>
                Cliente:
                <select className="select"
                    name="cliente"
                    value={actividad.cliente}
                    onChange={(e) => handleValueChange("cliente", e.target.value)}
                    required
                >
                    <option value="">Seleccione un cliente</option>
                    {clientes.map((cliente) => (
                        <option key={cliente.id} value={cliente.id}>
                            {cliente.nombre}
                        </option>
                    ))}
                </select>
            </label>

            <InputField
                label="Fecha"
                name="fecha"
                type="date"
                value={actividad.fecha}
                onValueChange={handleValueChange}
                required
            />

            <InputField
                label="Descripcion"
                name="descripcion"
                value={actividad.descripcion}
                onValueChange={handleValueChange}
                placeholder="ingrese la descripcion"
                isTextArea
                required
            />

            <InputField
                label="URL de Foto"
                name="urlFoto"
                value={actividad.urlFoto ?? ""}
                onValueChange={handleValueChange}
                placeholder="Ingrese la URl de la Foto"
                required
            />

            <div>
                <label>
                    Archivo PDF:
                    <input
                        type="file"
                        name="pdf"
                        accept="application/pdf"
                        onChange={handleFileChange}
                    />
                </label>
            </div>

            {/* Usamos el componente Boton */}
            <Boton texto="Agregar" onClick={handleSubmit} tipo="primary" />
            {mensaje && <p className="mensaje">{mensaje}</p>}
        </form>
        </div>
    );
};

export default ActividadForm;
