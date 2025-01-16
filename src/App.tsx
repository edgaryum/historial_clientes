import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './components/css/App.css';
import Menu from './components/Menu';
import Busqueda from './components/Busqueda';
import ActividadForm from './components/ActividadForm';
import ClientesFront from './ClientesFront';
import UsuariosFront from './UsuariosFront';
import IniciarSesion from './components/IniciarSesion';
import SessionManager from './components/SesionManager';
import RegistroVigilante from './components/Vigilante';
import BuscarVigilante from './components/BuscarVigilante';
import ListaVigilantes from './components/ListaVigilantes';



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
        <h1 className="app-title">Seguimiento de Actividades</h1>
        <IniciarSesion onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        <div className="header-container">
          <img src="/logo-somos.png" alt="Logo" className="logo" />
          <h1 className="app-title">Registro de Actividades</h1>

          <SessionManager setRol={setRol} />

          <div className='user-container'>
            <span className="username">Usuario: {usuario}</span>
            <button onClick={() => setRol(null)} className="logout-button">
              Cerrar Sesión
            </button>
          </div>
        </div>

        <Menu rol={rol} />

        <div className='content-container'>
          <Routes>
            {rol === 'lector' && (
              <Route path='/busqueda' element={<Busqueda rol={rol} />} />
            )}
            {rol === 'gestor' && (
              <>
                <Route path='/actividad-form' element={<ActividadForm />} />
                <Route path='/busqueda' element={<Busqueda rol={rol} />} />
              </>
            )}
            {rol === 'admin' && (
              <>
                <Route path='/actividad-form' element={<ActividadForm />} />
                <Route path='/busqueda' element={<Busqueda rol={rol} />} />
                <Route path='/clientes' element={<ClientesFront />} />
                <Route path='/usuarios' element={<UsuariosFront />} />
                <Route path='/vigilante' element={<RegistroVigilante />} />
                <Route path='/listaVigilantes' element={<ListaVigilantes />} />
                <Route path='/vigilantes/:id' element={<BuscarVigilante />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
