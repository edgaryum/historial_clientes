import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./css/Busqueda.css";
import { head } from "axios";

interface Vigilante {
  id: string;
  nombre: string;
  fechaNacimiento: string;
  direccion: string;
  telefono: string;
  estado: string;
  foto?: string;
}

const BuscarVigilante: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obtenemos el ID desde los parámetros de la URL
  const [vigilante, setVigilante] = useState<Vigilante | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);

  // Buscar vigilante cuando el id cambia
  useEffect(() => {
    if (id) {
      const fetchVigilante = async () => {
        try {
          const response = await fetch(`http://localhost:5000/vigilantes/${id}`);
          //const response = await fetch(`http://192.168.1.90:5000/vigilantes/${id}`);
          if (response.ok) {
            const data: Vigilante = await response.json();
            setVigilante(data);
            setMensaje(null); // Limpiar cualquier mensaje previo
          } else {
            setMensaje("Vigilante no encontrado.");
            setVigilante(null);
          }
        } catch (error) {
          setMensaje("Error al buscar el vigilante.");
        }
      };

      fetchVigilante();
    }
  }, [id]); // Esto se ejecutará cada vez que el 'id' cambie en la URL

  //generar PDF con la informacion del vigilante
  const generarPDF = () => {
    if (vigilante) {
      const doc = new jsPDF();
  
      // Título del PDF
      doc.text(`Hoja de vida: ${vigilante.nombre}`, 20, 20);
  
      const renderTable = () => {
        // Configurar la tabla debajo del título o la imagen
        const startY = vigilante.foto ? 70 : 40; // Ajustar inicio según si hay imagen
        doc.autoTable({
          head: [["Campo", "Detalle"]],
          body: [
            ["Nombre", vigilante.nombre],
            ["Cédula", vigilante.id],
            ["Fecha de Nacimiento", vigilante.fechaNacimiento],
            ["Dirección", vigilante.direccion],
            ["Teléfono", vigilante.telefono],
            ["Estado", vigilante.estado],
          ],
          startY,
        });
      };
  
      // Agregar imagen si existe
      if (vigilante.foto) {
        const img = new Image();
        img.src = `http://localhost:5000/${vigilante.foto}`;
        // img.src = `http://192.168.1.90:5000/${vigilante.foto}`;
  
        img.onload = () => {
          const imgWidth = 40; // Ancho de la imagen (3 cm aprox.)
          const imgHeight = 53.33; // Alto de la imagen (4 cm aprox.)
          doc.addImage(img, "JPEG", 150, 10, imgWidth, imgHeight); // Posición y tamaño
          renderTable(); // Llamamos a la función que genera la tabla
          doc.save(`Hoja_de_vida_${vigilante.id}.pdf`);
        };
      } else {
        renderTable(); // Si no hay imagen, generar solo la tabla
        doc.save(`Hoja_de_vida_${vigilante.id}.pdf`);
      }
    }
  };

  return (
    <div className="buscar-vigilante-container">
      <h2>Buscar Vigilante</h2>

      {mensaje && <p className="mensaje">{mensaje}</p>}

      {vigilante && (
        <div className="hoja-de-vida">
          <table className="tabla-hoja-de-vida">
          <tbody>
            <tr>
              <th>Nombre</th>
              <td>{vigilante.nombre}</td>
              </tr>
              <tr>
                <th>Cédula</th>
                <td>{vigilante.id}</td>
              </tr>
              <tr>
                <th>Fecha de Nacimiento</th>
                <td>{vigilante.fechaNacimiento}</td>
              </tr>
              <tr>
                <th>Direccion</th>
                <td>{vigilante.direccion}</td>
              </tr>
              <tr>
                <th>Telefono</th>
                <td>{vigilante.telefono}</td>
              </tr>
              <tr>
                <th>Estado</th>
                <td>{vigilante.estado}</td>
              </tr>
              </tbody>
              </table>

            <div className="foto-container">
              <img
                src={
                  vigilante.foto
                  ? `http://localhost:5000/${vigilante.foto}`
                  //? `http://localhost:5000/${vigilante.foto}`
                  : "/placeholder.png"
                }
                alt="Foto del vigilante"
              />
            </div>

          <button onClick={generarPDF}>Generar hoja de Vida en PDF</button>
        </div>
      )}
    </div>
  );
};

export default BuscarVigilante;
