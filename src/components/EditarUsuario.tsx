import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/Usuarios.css';
import Boton from './Boton';
import InputField from './InputField';

interface Usuario {
    id: number;
    nombre: string;
    password: string;
    role: string;
}

interface EditarUsuarioProps {
    usuarioId: number;
    onClose: () => void;
}

const EditarUsuario: React.FC<EditarUsuarioProps> = ({ usuarioId, onClose }) => {
    const [usuario, setUsuario] = useState<Usuario | null>(null);

    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                //const response = await axios.get<Usuario>(`http://localhost:5000/usuarios/${usuarioId}`);
                const response = await axios.get<Usuario>(`http://192.168.1.90:5000/usuarios/${usuarioId}`);
                setUsuario(response.data);
            } catch (error) {
                console.error("Error al cargar datos del usuario:", error);
            }
        };
        fetchUsuario();
    }, [usuarioId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUsuario((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    const handleValueChange = (name: string, value: string) => {
        setUsuario((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (usuario) {
            try {
                //await axios.put(`http://localhost:5000/usuarios/${usuario.id}`, usuario);
                await axios.put(`http://192.168.1.90:5000/usuarios/${usuario.id}`, usuario);
                alert('Usuario actualizado exitosamente');
                onClose();
            } catch (error) {
                console.error("Error al actualizar usuario:", error);
            }
        }
    };

    if (!usuario) return <p>Cargando...</p>;

    return (
        <form onSubmit={handleSubmit}>
            <h2>Editar Usuario</h2>
            <InputField
                label="Nombre"
                name="nombre"
                type="text"
                value={usuario.nombre}
                onValueChange={handleValueChange}
                required
            />
            <InputField
                label="Contraseña"
                name="password"
                type="password"
                value={usuario.password} // No se llena con el valor actual por razones de seguridad
                onValueChange={handleValueChange}
                required
            />
            <label>
                Rol:
                <select name="role" value={usuario.role} onChange={handleInputChange}>
                    <option value="admin">Admin</option>
                    <option value="gestor">Gestor</option>
                    <option value="lector">Lector</option>
                </select>
            </label>
            <div style={{ marginTop: "1rem" }}>
                    <Boton texto="Actualizar" tipoBoton="submit" tipo="primary" />
                    <Boton texto="Cancelar" tipo="secondary" onClick={onClose} />
                </div>
        </form>
    );
};

export default EditarUsuario;
