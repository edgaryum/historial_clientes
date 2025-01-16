import React, { useState } from "react";
import Boton from "./Boton";
import './css/IniciarSesion.css';

interface IniciarSesionProps {
    onLogin: (role: string, username: string) => void; // Modificado para pasar nombre de usuario
}

const IniciarSesion: React.FC<IniciarSesionProps> = ({ onLogin }) => {
    const [criterio, setCriterio] = useState({ id: "", password: "" });
    const [mensaje, setMensaje] = useState<string | null>(null);
    const [nombreUsuario, setNombreUsuario] = useState<string | null>(null); 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCriterio((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!criterio.id || !criterio.password) {
            setMensaje("Por favor, ingrese ambos campos.");
            return;
        }

        try {
            //const response = await fetch("http://localhost:5000/login", {
                const response = await fetch("http://192.168.1.90:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(criterio),
            });

            if (!response.ok) {
                const error = await response.json();
                setMensaje(error.message || "Error al iniciar sesión.");
                return;
            }

            const data = await response.json();
            setMensaje(`Inicio de sesión exitoso. Rol: ${data.role}`);
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('nombre', data.nombre);

            setNombreUsuario(data.nombre); 
            onLogin(data.role, data.nombre); // Llamada a onLogin con rol y nombre
        } catch (error) {
            setMensaje("Error al conectar con el servidor.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('nombre');
        setNombreUsuario(null);
        onLogin("", ""); // Limpiar estado de sesión
    };

    return (
        <div>
            <h2>Iniciar Sesión</h2>
            <div>
                <label>Cédula: </label>
                <div>
                    <input
                        type="text"
                        name="id"
                        value={criterio.id}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        value={criterio.password}
                        onChange={handleChange}
                    />
                </div>
                <Boton texto="Iniciar sesión" onClick={handleSubmit} tipo="primary" />
                {mensaje && <p className="mensaje">{mensaje}</p>}
            </div>

            {nombreUsuario && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <p>{nombreUsuario}</p>
                    <button onClick={handleLogout} style={{ marginLeft: '10px' }}>
                        Cerrar sesión
                    </button>
                </div>
            )}
        </div>
    );
};

export default IniciarSesion;
