import React, { useState } from "react";
import "./css/vigilante.css";
import Boton from "./Boton";
import InputField from "./InputField";

interface Vigilante {
    cedula: string;
    nombre: string;
    fechaNacimiento: string;
    direccion: string;
    telefono: string;
    estado: string;
    foto?: File | null;
}

const RegistroVigilante: React.FC = () => {
    const [vigilante, setVigilante] = useState<Vigilante>({
        cedula: "",
        nombre: "",
        fechaNacimiento: "",
        direccion: "",
        telefono: "",
        estado: "",
        foto: null,
    });

    const [mensaje, setMensaje] = useState<string | null>(null);
    const [fotoPreview, setFotoPreview] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setVigilante((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (!file.type.startsWith("image/")) {
                setMensaje("Por favor seleccione un archivo de imagen válido.");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setMensaje("La imagen no debe exceder los 5MB.");
                return;
            }
            setVigilante((prev) => ({
                ...prev,
                foto: file,
            }));
            setFotoPreview(URL.createObjectURL(file)); // Mostrar vista previa
            setMensaje(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !vigilante.cedula ||
            !vigilante.nombre ||
            !vigilante.fechaNacimiento ||
            !vigilante.direccion ||
            !vigilante.telefono ||
            !vigilante.estado
        ) {
            setMensaje("Por favor complete todos los campos.");
            return;
        }

        const formData = new FormData();
        formData.append("id", vigilante.cedula);
        formData.append("nombre", vigilante.nombre);
        formData.append("fechaNacimiento", vigilante.fechaNacimiento);
        formData.append("direccion", vigilante.direccion);
        formData.append("telefono", vigilante.telefono);
        formData.append("estado", vigilante.estado);

        if (vigilante.foto) {
            formData.append("foto", vigilante.foto as Blob); // Forzar compatibilidad
        }

        try {
            const response = await fetch("http://localhost:5000/vigilantes", {
                //const response = await fetch("http://192.168.1.90:5000/vigilantes", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setMensaje("Vigilante registrado correctamente.");
                setVigilante({
                    cedula: "",
                    nombre: "",
                    fechaNacimiento: "",
                    direccion: "",
                    telefono: "",
                    estado: "",
                    foto: null,
                });
                setFotoPreview(null);
            } else {
                const errorData = await response.json();
                setMensaje(`Error al enviar los datos: ${errorData.error}`);
            }
        } catch (error) {
            setMensaje("Error al enviar los datos.");
        }
    };

    return (
        <div className="vigilante-form-container">
            <form onSubmit={handleSubmit}>
                <h2>Registrar Vigilante</h2>

                <InputField
                    label="Cédula"
                    name="cedula"
                    type="text"
                    value={vigilante.cedula}
                    onValueChange={(name, value) => setVigilante({ ...vigilante, [name]: value })}
                    placeholder="Ingrese la cédula"
                    required
                />

                <InputField
                    label="Nombre"
                    name="nombre"
                    type="text"
                    value={vigilante.nombre}
                    onValueChange={(name, value) => setVigilante({ ...vigilante, [name]: value })}
                    placeholder="Ingrese el nombre"
                    required
                />

                <InputField
                    label="Fecha de Nacimiento"
                    name="fechaNacimiento"
                    type="date"
                    value={vigilante.fechaNacimiento}
                    onValueChange={(name, value) => setVigilante({ ...vigilante, [name]: value })}
                    required
                />

                <InputField
                    label="Dirección"
                    name="direccion"
                    type="text"
                    value={vigilante.direccion}
                    onValueChange={(name, value) => setVigilante({ ...vigilante, [name]: value })}
                    placeholder="Ingrese la dirección"
                    required
                />

                <InputField
                    label="Teléfono"
                    name="telefono"
                    type="text"
                    value={vigilante.telefono}
                    onValueChange={(name, value) => setVigilante({ ...vigilante, [name]: value })}
                    placeholder="Ingrese el teléfono"
                    required
                />

                <InputField
                    label="estado"
                    name="estado"
                    type="text"
                    value={vigilante.estado}
                    onValueChange={(name, value) => setVigilante({ ...vigilante, [name]: value })}
                    placeholder="Ingrese el estado del vigilante"
                    required
                />

                <div>
                    <label>
                        Foto:
                        <input type="file" name="foto" accept="image/*" onChange={handleFileChange} />
                    </label>
                </div>

                {fotoPreview && <img src={fotoPreview} alt="Vista Previa" className="foto-preview" />}

                <Boton texto="Registrar" onClick={handleSubmit} tipo="primary" />
                {mensaje && <p className="mensaje">{mensaje}</p>}
            </form>
        </div>
    );
};

export default RegistroVigilante;
