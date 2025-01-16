import React, { useState, useEffect } from "react";
import EditarUsuario from "./EditarUsuario"; // Asegúrate de tener este componente para la edición
import './css/App.css';
import Boton from "./Boton"; // Botón personalizado

interface Usuario {
    id: number;
    nombre: string;
    role: string;
}

const ListaUsuarios: React.FC = () => {
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<number | null>(null);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [usuarioEditar, setUsuarioEditar] = useState<number | null>(null);
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                //const response = await fetch("http://localhost:5000/usuarios");
                const response = await fetch("http://192.168.1.90:5000/usuarios");
                if (!response.ok) {
                    throw new Error("Error al cargar los usuarios");
                }
                const data = await response.json();
                setUsuarios(data);
            } catch (error) {
                setMensaje("Error al obtener la lista de usuarios");
            } finally {
                setLoading(false); // Esto garantiza que el estado de loading se actualice
            }
        };

        fetchUsuarios();
    }, []);

    return (
        <div>
            <h2>Lista de Usuarios</h2>
            {loading ? (
                <p>Cargando usuarios...</p>
            ) : mensaje ? (
                <p className="error">{mensaje}</p>
            ) : (
                <div>
                    {/* Lista desplegable */}
                    <select
                        className="select"
                        value={usuarioSeleccionado || ""}
                        onChange={(e) => setUsuarioSeleccionado(Number(e.target.value))}
                    >
                        <option value="">Seleccione un usuario</option>
                        {usuarios.map((usuario) => (
                            <option key={usuario.id} value={usuario.id}>
                                {usuario.nombre} ({usuario.role})
                            </option>
                        ))}
                    </select>

                    {/* Botón para editar */}
                    <Boton
                        texto="Editar"
                        onClick={() => usuarioSeleccionado && setUsuarioEditar(usuarioSeleccionado)}
                        tipo="primary"
                        tipoBoton="button"
                    />
                </div>
            )}

            {/* Formulario de edición */}
            {usuarioEditar && (
                <div>
                    <EditarUsuario
                        usuarioId={usuarioEditar} // ID del usuario seleccionado
                        onClose={() => setUsuarioEditar(null)} // Cierra el formulario al terminar
                    />
                </div>
            )}
        </div>
    );
};

export default ListaUsuarios;
