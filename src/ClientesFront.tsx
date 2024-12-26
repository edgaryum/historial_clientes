import React, { useEffect, useState } from 'react';
import './components/css/App.css';
import NewCliente from './components/Cliente';
import ListaClientes from './components/ListaClientes';

const ClientesFront: React.FC = () => {
  return (
    <div className='clientes-container'>
      <h1 className='clientes-title'>Registro de Clientes</h1>
      <div className='clientes-section'>
        {/* Componente para agregar un nuevo cliente */}
        <NewCliente />
        {/* Componente para listar los clientes */}
        <ListaClientes />
      </div>
    </div>
  );
};

export default ClientesFront;
