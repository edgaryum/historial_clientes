import React, { useState, useEffect } from "react";
import EditarClienteForm from "./EditarCliente";
import './css/Clientes.css';
import Boton from "./Boton";

interface Cliente {
    id: number;
    nombre: string;
    telefono: string;
    correo: string;
    encargado: string;
}

const ListaClientes: React.FC = () => {
    const [clienteSeleccionado, setClienteSeleccionado] = useState<number | null>(null);
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [clienteEditar, setClienteEditar] = useState<number | null>(null);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchClientes = async () => {
            try {
                //const response = await fetch("http://localhost:5000/clientes");
                const response = await fetch("http://192.168.1.90:5000/clientes");
                if (!response.ok) {
                    throw new Error("Error al cargar los clientes");
                }
                const data = await response.json();
                setClientes(data);
            } catch (error) {
                setMensaje("Error al obtener la lista de clientes");
            } finally {
                setLoading(false);
            }
        };

        fetchClientes();
    }, []);


    return (
        <div>
            <h2>Lista de Clientes</h2>
            {loading ? (
                <p>Cargando clientes...</p>
            ) : mensaje ? (
                <p className="error">{mensaje}</p>
            ) : (
                <div>
                    {/* Lista desplegable */}
                    <select className="select"
                        value={clienteSeleccionado || ""}
                        onChange={(e) => setClienteSeleccionado(Number(e.target.value))}
                    >
                        <option value="">Seleccione un cliente</option>
                        {clientes.map((cliente) => (
                            <option key={cliente.id} value={cliente.id}>
                                {cliente.nombre}
                            </option>
                        ))}
                    </select>

                     {/* Botón para editar */}
                     <Boton
                        texto="Editar"
                        onClick={() => clienteSeleccionado && setClienteEditar(clienteSeleccionado)}
                        tipo="primary"
                        tipoBoton="button"
                    />
                </div>
            )}

            {/* Formulario de edición */}
            {clienteEditar && (
                <div>
                    <h3>Editar Cliente</h3>
                    <EditarClienteForm
                        clienteid={clienteEditar} // ID del cliente seleccionado
                        onClose={() => setClienteEditar(null)} // Cierra el formulario al terminar
                    />
                </div>
            )}
        </div>
    );
};

export default ListaClientes;