import React, { useState, useEffect } from "react";
import "./css/App.css";
import Boton from "./Boton";
import EditarEvento from "./EditarEvento";

interface Actividad {
  id: number;
  cliente: number;
  fecha: string;
  descripcion: string;
  pdf: string | null;
  urlFoto: string | null;
}

interface Cliente {
  id: number;
  nombre: string;
}

interface BusquedaProps {
  rol: string;
}

const Busqueda: React.FC<BusquedaProps> = ({ rol }) => {
  const [criterio, setCriterio] = useState({ cliente: "", fecha: "" });
  const [resultados, setResultados] = useState<Actividad[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [actividadParaEditar, setActividadParaEditar] = useState<Actividad | null>(null);

  // Cargar los clientes al montar el componente
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await fetch("http://localhost:5000/clientes");
        if (response.ok) {
          const data: Cliente[] = await response.json();
          setClientes(data);
        } else {
          setMensaje("Error al cargar los clientes.");
        }
      } catch (error) {
        setMensaje("Error al conectar con el servidor.");
      }
    };
    fetchClientes();
  }, []);

  // Manejar cambios en los inputs de los filtros
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCriterio((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar cambio de cliente seleccionado
  const handleValueChange = (name: string, value: string) => {
    setCriterio((prev) => ({ ...prev, [name]: value }));
  };

  // Buscar actividades basadas en los criterios
  const handleBuscar = async () => {
    if (!criterio.cliente && !criterio.fecha) {
      setMensaje("Por favor, ingrese al menos un criterio de búsqueda.");
      return;
    }

    try {
      const queryParams = new URLSearchParams(criterio as Record<string, string>).toString();
      const response = await fetch(`http://localhost:5000/actividades?${queryParams}`);

      if (response.ok) {
        const data: Actividad[] = await response.json();
        setResultados(data);
        setMensaje(data.length ? null : "No se encontraron actividades.");
      } else {
        setMensaje("Error al buscar actividades.");
      }
    } catch (error) {
      setMensaje("Error al conectar con el servidor.");
    }
  };

  // Manejar la edición de una actividad
  const handleEditar = (actividad: Actividad) => {
    setActividadParaEditar(actividad);
  };

  const handleGuardarEdicion = (actividadEditada: Actividad) => {
    setResultados((prev) =>
      prev.map((actividad) => (actividad.id === actividadEditada.id ? actividadEditada : actividad))
    );
    setActividadParaEditar(null);
  };

  return (
    <div className="busqueda-container">
      <h2>Buscar Actividades</h2>
      <div>
        <label>
          Cliente:
          <select
            className="select"
            name="cliente"
            value={criterio.cliente}
            onChange={(e) => handleValueChange("cliente", e.target.value)}
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente.id} value={cliente.nombre}>
                {cliente.nombre}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Fecha:
          <input
            type="date"
            name="fecha"
            value={criterio.fecha}
            onChange={handleChange}
          />
        </label>
      </div>
      <Boton texto="Buscar" onClick={handleBuscar} tipo="primary" />
      {mensaje && <p className="mensaje">{mensaje}</p>}
      {actividadParaEditar ? (
        <div>
          <h3>Editar Actividad</h3>
          <EditarEvento
            actividad={actividadParaEditar}
            onClose={() => setActividadParaEditar(null)}
            onGuardar={handleGuardarEdicion}
          />
        </div>
      ) : (
        resultados.length > 0 && (
          <div className="resultados">
            <h3>Resultados</h3>
            <ul>
              {resultados.map((actividad) => (
                <li key={actividad.id}>
                  <strong>
                    {actividad.cliente} - {actividad.fecha}:
                  </strong>
                  <p>{actividad.descripcion}</p>
                  <div>
                    {actividad.pdf && (
                      <a
                        href={`http://localhost:5000/${actividad.pdf}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Descargar PDF
                      </a>
                    )}
                  </div>
                  <div>
                    {actividad.urlFoto && (
                      <a
                        href={actividad.urlFoto}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ver Foto
                      </a>
                    )}
                  </div>
                  {(rol === "gestor" || rol === "admin") && (
                    <Boton
                      texto="Editar"
                      onClick={() => handleEditar(actividad)}
                      tipo="secondary"
                    />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )
      )}
    </div>
  );
};

export default Busqueda;
