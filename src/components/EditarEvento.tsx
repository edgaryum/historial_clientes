import React, { useEffect, useState } from "react";
import Boton from "./Boton";
import "./css/Actividad.css";
import InputField from "./InputField"; // Importa InputField

interface Cliente {
    id: number;
    nombre: string;
}

interface Actividad {
    id: number;
    cliente: number;
    fecha: string;
    descripcion: string;
    pdf: string | null; // Permitimos que sea undefined
    urlFoto: string | null; // Alineamos este campo también
  }
  

const EditarEvento: React.FC<{
    actividad: Actividad;
    onClose: () => void;
    onGuardar: (actividad: Actividad) => void;
}> = ({ actividad, onClose, onGuardar }) => {
    const [form, setForm] = useState<Actividad>(actividad);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [mensaje, setMensaje] = useState<string | null>(null);

    // Cargar clientes desde la API
    useEffect(() => {
        const fetchClientes = async () => {
            try {
                //const response = await fetch("http://localhost:5000/clientes");
                const response = await fetch("http://192.168.1.90:5000/clientes");
                if (!response.ok) throw new Error("Error al cargar los clientes.");
                const data: Cliente[] = await response.json();
                setClientes(data);
            } catch (error) {
                setMensaje("Error al cargar los clientes. Intenta de nuevo más tarde.");
            }
        };
        fetchClientes();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "cliente" ? (value ? Number(value) : null) : value,
        }));
    };

    const handleValueChange = (name: string, value: string | number) => {
        setForm((prev) => ({
            ...prev,
            [name]: name === "cliente" ? (value ? Number(value) : null) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación básica
        if (!form.cliente || !form.fecha || !form.descripcion) {
            setMensaje("Por favor complete todos los campos.");
            return;
        }

        try {
            //const response = await fetch(`http://localhost:5000/actividades/${form.id}`, {
                const response = await fetch(`http://192.168.1.90:5000/actividades/${form.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                setMensaje("Actividad actualizada exitosamente.");
                setTimeout(() => {
                    setMensaje(null);
                    onGuardar(form);
                    onClose();
                }, 2000);
            } else {
                const errorData = await response.json();
                setMensaje(`Error: ${errorData.error}`);
            }
        } catch {
            setMensaje("Error al actualizar la actividad.");
        }
    };

    return (
        <div className="actividad-form-container">
            <h3>Editar Actividad</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    Cliente:
                    <select
                        name="cliente"
                        value={form.cliente}
                        onChange={handleChange}
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
                    label="Descripción"
                    name="descripcion"
                    type="textarea"
                    value={form.descripcion}
                    onValueChange={handleValueChange}
                />
                <InputField
                    label="Fecha"
                    name="fecha"
                    type="date"
                    value={form.fecha}
                    onValueChange={handleValueChange}
                />
                <InputField
                    label="URL Foto"
                    name="urlFoto"
                    type="text"
                    value={form.urlFoto || ""}
                    onValueChange={handleValueChange}
                />
                <div style={{ marginTop: "1rem" }}>
                    <Boton texto="Guardar" tipoBoton="submit" tipo="primary" />
                    <Boton texto="Cancelar" tipo="secondary" onClick={onClose} />
                </div>
            </form>
            {mensaje && <p className="mensaje">{mensaje}</p>}
        </div>
    );
};

export default EditarEvento;
