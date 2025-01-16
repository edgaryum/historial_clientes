import React, { useState } from "react";
import './css/Clientes.css';
import Boton from "./Boton";
import InputField from "./InputField";

interface Cliente {
    nombre: string;
    telefono: string;
    correo: string;
    encargado: string;
}

const NewCliente: React.FC = () => {
    const [cliente, setCliente] = useState<Cliente>({
        nombre: '',
        telefono: '',
        correo: '',
        encargado: ''
    });

    const [mensaje, setMensaje] = useState<string | null>(null);

    // Maneja los cambios en los campos del formulario
    const handleValueChange = (name: string, value: string) => {
        setCliente((prev) => prev && { ...prev, [name]: value });
    };

    // Enviar el formulario para agregar un nuevo cliente
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validar que todos los campos estén llenos
        if (!cliente.nombre || !cliente.telefono || !cliente.correo || !cliente.encargado) {
            setMensaje('Por favor, complete todos los campos.');
            return;
        }

        try {
            //const response = await fetch('http://localhost:5000/clientes', {
            const response = await fetch('http://192.168.1.90:5000/clientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cliente),
            });

            if (response.ok) {
                setMensaje('Cliente Registrado Exitosamente');
                // Restablecer el formulario después de enviar
                setCliente({ nombre: '', telefono: '', correo: '', encargado: '' });
            } else {
                const errorData = await response.json();
                setMensaje(`Error: ${errorData.error}`);
            }
        } catch (error) {
            setMensaje('Error al enviar los datos');
        }
    };

    return (
        <div>
            <h2>Agregar Cliente</h2>
            <form onSubmit={handleSubmit}>
                <InputField
                    label="Nombre"
                    name="nombre"
                    type="text"
                    value={cliente.nombre}
                    onValueChange={handleValueChange} // Conversión explícita
                    required
                />
                <InputField
                    label="Telefono"
                    name="telefono"
                    type="text"
                    value={cliente.telefono}
                    onValueChange={handleValueChange} // Conversión explícita
                    required
                />
                <InputField
                    label="Correo"
                    name="correo"
                    type="mail"
                    value={cliente.correo}
                    onValueChange={handleValueChange} // Conversión explícita
                    required
                />
                <InputField
                    label="Encargado"
                    name="encargado"
                    type="text"
                    value={cliente.encargado}
                    onValueChange={handleValueChange} // Conversión explícita
                    required
                />

                {/* Usamos el componente Boton para enviar el formulario */}
                <Boton texto="Agregar Cliente" onClick={handleSubmit} tipo="primary" />
            </form>
            {/* Mostrar el mensaje si está presente */}
            {mensaje && <p className="mensaje">{mensaje}</p>}
        </div>
    );
};

export default NewCliente;