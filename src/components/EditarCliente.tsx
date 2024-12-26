import React, { useState, useEffect } from "react";
import Boton from "./Boton";
import InputField from "./InputField";
import './css/App.css';

interface Cliente {
    id: number;
    nombre: string;
    telefono: string;
    correo: string;
    encargado: string;
}

const EditarClienteForm: React.FC<{ clienteid: number; onClose: () => void }> = ({ clienteid, onClose }) => {
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [cargando, setCargando] = useState<boolean>(true);

    // Cargar datos del cliente
    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const response = await fetch(`http://localhost:5000/clientes/${clienteid}`);
                if (!response.ok) {
                    throw new Error("Error al obtener el cliente");
                }
                const data: Cliente = await response.json();
                setCliente(data);
            } catch (error) {
                setMensaje("Error al cargar los datos del cliente");
            } finally {
                setCargando(false);
            }
        };

        fetchCliente();
    }, [clienteid]);

    // Maneja los cambios en los campos del formulario
    const handleValueChange = (name: string, value: string) => {
        setCliente((prev) => prev && { ...prev, [name]: value });
    };

    // Enviar datos actualizados al backend
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!cliente) return;

        // Validación básica
        if (!cliente.nombre || !cliente.telefono || !cliente.correo || !cliente.encargado) {
            setMensaje("Por favor complete todos los campos.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/clientes/${cliente.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cliente),
            });

            if (response.ok) {
                setMensaje("Cliente actualizado exitosamente");
                setTimeout(onClose, 2000); // Cierra el formulario después de 2 segundos
            } else {
                const errorData = await response.json();
                setMensaje(`Error: ${errorData.error}`);
            }
        } catch (error) {
            setMensaje("Error al actualizar el cliente");
        }
    };

    if (cargando) return <p>Cargando datos del cliente...</p>;
    if (!cliente) return <p>Error al cargar los datos del cliente</p>;

    return (
        <div className="clientes-container">
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

                <div style={{ marginTop: "1rem" }}>
                    <Boton texto="Actualizar" tipoBoton="submit" tipo="primary" />
                    <Boton texto="Cancelar" tipo="secondary" onClick={onClose} />
                </div>
            </form>
            {mensaje && <p className="mensaje">{mensaje}</p>}
        </div>
    );
};

export default EditarClienteForm;
