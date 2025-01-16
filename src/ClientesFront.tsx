import React, { useEffect, useState } from 'react';
import './components/css/Clientes.css';
import NewCliente from './components/Cliente';
import ListaClientes from './components/ListaClientes';

const ClientesFront: React.FC = () => {
  return (
    <div>
      <h1 className='clientes-title'>Registro de Clientes</h1>
      <div className='clientes-container'>
        <div className='clientes-section'>
          {/* Componente para agregar un nuevo cliente */}
          <NewCliente />
          {/* Componente para listar los clientes */}
          <ListaClientes />
        </div>
      </div>
    </div>
  );
};

export default ClientesFront;
