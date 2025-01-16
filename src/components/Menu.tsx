import React from "react";
import { Link } from "react-router-dom";
import './css/Menu.css';

interface MenuProps {
    rol:string;
}

const Menu: React.FC<MenuProps> = ({rol}) => {
    return (
        <nav className="menu">
            <ul className="menu-list">
                {rol === 'lector' && (
                    <li>
                        <Link to="/busqueda">Buscar Actividad</Link>
                    </li>
                )}
                {rol === 'gestor' && (
                    <>
                    <li>
                        <Link to="/actividad-form">Registrar Actividad</Link>
                    </li>
                    <li>
                        <Link to="/busqueda">Buscar Actividades</Link>
                    </li>
                    </>
                )}
                {rol === 'admin' && (
                    <>
                    <li>
                        <Link to="/actividad-form">Registrar Actividad</Link>
                    </li>
                    <li>
                        <Link to="/busqueda">Buscar Actividades</Link>
                    </li>
                    <li>
                        <Link to="/clientes">Gestion de Clinetes</Link>
                    </li>
                    <li>
                        <Link to="/usuarios">Gestion de Usuarios</Link>
                    </li>
                    <li>
                        <Link to="/vigilante">Gestion de vigilante</Link>
                    </li>
                    <li>
                        <Link to="/listaVigilantes">Lista de vigilante</Link>
                    </li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Menu;