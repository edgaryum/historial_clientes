import React, { useState } from 'react';
import './components/css/App.css';
import Busqueda from './components/Busqueda';
import ActividadForm from './components/ActividadForm';
import ClientesFront from './ClientesFront';
import AgregarUsuarioForm from './components/AgregarUsuarioForm';
import IniciarSesion from './components/IniciarSesion';
import SessionManager from './components/SesionManager';

const App: React.FC = () => {
  const [rol, setRol] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<string>('');

  const handleLogin = (newRole: string, username: string) => {
    setRol(newRole);
    setUsuario(username);
  };

  if (!rol) {
    return (
      <div className="sesion-container">
        <h1 className="app-title">Registro de Actividades</h1>
        <IniciarSesion onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <SessionManager setRol={setRol} />
      <h1 className="app-title">Registro de Actividades</h1>

      <div className='user-container'>
        <span className="username">Usuario: {usuario}</span>
        <div>
        <button onClick={() => setRol(null)} className="logout-button">
          Cerrar Sesión
        </button>
        </div>
      </div>

      {rol === 'lector' && <Busqueda rol={rol} />}
      {rol === 'gestor' && (
        <>
          <Busqueda rol={rol} />
          <ActividadForm />
        </>
      )}
      {rol === 'admin' && (
        <>
          <Busqueda rol={rol} />
          <ActividadForm />
          <ClientesFront />
          <AgregarUsuarioForm />
        </>
      )}
    </div>
  );
};

export default App;
