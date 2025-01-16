import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Para navegación a detalle del vigilante
import jsPDF from "jspdf"; // Biblioteca para generar PDFs
import "jspdf-autotable"; // Plugin para tablas
import "./css/ListaVigilantes.css";

interface Vigilante {
  id: string;
  nombre: string;
  estado: string;
}

const ListaVigilantes: React.FC = () => {
  const [vigilantes, setVigilantes] = useState<Vigilante[]>([]);
  const [filtros, setFiltros] = useState({ id: "", nombre: "", estado: "" });
  const [filtroVigilantes, setFiltroVigilantes] = useState<Vigilante[]>([]);
  const navigate = useNavigate();

  // Cargar los vigilantes al montar el componente
  useEffect(() => {
    const fetchVigilantes = async () => {
      try {
        const response = await fetch("http://localhost:5000/vigilantes");
        //const response = await fetch("http://192.168.1.90:5000/vigilantes");
        if (response.ok) {
          const data: Vigilante[] = await response.json();
          setVigilantes(data);
          setFiltroVigilantes(data);
        } else {
          console.error("Error al obtener la lista de vigilantes.");
        }
      } catch (error) {
        console.error("Error en la conexión:", error);
      }
    };

    fetchVigilantes();
  }, []);

  // Filtrar los vigilantes al cambiar los filtros
  useEffect(() => {
    const filtrar = () => {
      const filtrados = vigilantes.filter((vigilante) => {
        return (
          (filtros.id === "" || vigilante.id.includes(filtros.id)) &&
          (filtros.nombre === "" ||
            vigilante.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())) &&
          (filtros.estado === "" ||
            vigilante.estado.toLowerCase().includes(filtros.estado.toLowerCase()))
        );
      });
      setFiltroVigilantes(filtrados);
    };

    filtrar();
  }, [filtros, vigilantes]);

  // Navegar a detalles de un vigilante
  const handleClickVigilante = (id: string) => {
    navigate(`/vigilantes/${id}`); // Ajusta la ruta según la configuración de React Router
  };

  // Generar PDF con lista de filtrados
  const generarPDF = () => {
    const doc = new jsPDF();
    doc.text("Lista de Vigilantes", 20, 10);
    doc.autoTable({
      head: [["Cédula", "Nombre", "Estado"]],
      body: filtroVigilantes.map((v) => [v.id, v.nombre, v.estado]),
    });
    doc.save("lista_vigilantes.pdf");
  };

  return (
    <div className="lista-vigilantes-container">
      <h2>Lista de Vigilantes</h2>

      {/* Filtros */}
      <div className="filtros">
        <input
          type="text"
          placeholder="Filtrar por Cédula"
          value={filtros.id}
          onChange={(e) => setFiltros({ ...filtros, id: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filtrar por Nombre"
          value={filtros.nombre}
          onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filtrar por Estado"
          value={filtros.estado}
          onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
        />
        <button onClick={generarPDF}>Generar PDF</button>
      </div>

      {/* Tabla de vigilantes */}
      {filtroVigilantes.length > 0 ? (
        <table className="tabla-vigilantes">
          <thead>
            <tr>
              <th>Cédula</th>
              <th>Nombre</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtroVigilantes.map((vigilante) => (
              <tr
                key={vigilante.id}
                onClick={() => handleClickVigilante(vigilante.id)}
                style={{ cursor: "pointer" }}
              >
                <td>{vigilante.id}</td>
                <td>{vigilante.nombre}</td>
                <td>{vigilante.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay datos disponibles para mostrar.</p>
      )}
    </div>
  );
};

export default ListaVigilantes;
