import React, { useState } from 'react';
import './css/App.css';
import Boton from './Boton';

const AgregarUsuarioForm: React.FC = () => {
  const [id, setId] = useState('');
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // Nuevo estado para el rol
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !nombre || !password || !role) {
      setError('Por favor complete todos los campos');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, nombre, password, role }), // Agregar el rol aquí
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Error al agregar usuario');
      } else {
        const data = await response.json();
        setSuccess('Usuario creado con éxito');
        setId('');
        setNombre('');
        setPassword('');
        setRole('');
      }
    } catch (err) {
      setError('Error de red');
    }
  };

  return (
    <div className='usuario-container'>
      <h2>Agregar Usuario</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Cedula:
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Nombre:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Contraseña:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Rol:
          <select
          className='select'
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Seleccione un rol</option>
            <option value="admin">Admin</option>
            <option value="gestor">Gestor</option>
            <option value="lector">Lector</option>
          </select>
        </label>
        <br />
        <Boton texto="Agregar usuario" onClick={handleSubmit} tipo="primary" />
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default AgregarUsuarioForm;
