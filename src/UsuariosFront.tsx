import React, { useEffect, useState } from 'react';
import './components/css/Usuarios.css';
import AgregarUsuarioForm from './components/AgregarUsuarioForm';
import ListaUsuarios from './components/ListaUsuarios';

const UsuariosFront: React.FC = () => {
  return (
    <div>
      <h1 className='usuario-title'>Registro de Usuarios</h1>
      <div className='usuario-container'>
      <div className='usuario-section'>
        {/* Componente para agregar un nuevo cliente */}
        <AgregarUsuarioForm />
        {/* Componente para listar los clientes */}
        <ListaUsuarios />
      </div>
      </div>
    </div>
  );
};

export default UsuariosFront;
