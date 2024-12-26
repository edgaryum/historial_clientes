import React from "react";
import './css/App.css';

interface InputFieldProps {
    label: string //etiqueta para el input
    name: string //nombre del campo
    type?: string //tipo de input (por defecto: "text")
    value: string //valor actual del input
    onValueChange: (name: string, value: string) => void; // Acepta ambos tipos
    placeholder?: string //texto de marcador
    required?: boolean //incia si el campo es requerido
    isTextArea?: boolean //indica si es un textarea
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    name,
    type = "text",
    value,
    onValueChange,
    placeholder = "",
    required = false,
    isTextArea = false,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { value } = e.target;
        onValueChange(name, value); // Llama a la función pasada por el padre
    };

    return (
        <div className="input-field-container">
            <label htmlFor={name}>{label}</label>
            {
                isTextArea ? (
                    <textarea
                        id={name}
                        name={name}
                        value={value ?? ""}
                        onChange={handleChange}
                        placeholder={placeholder}
                        required={required}
                    />
                ) : (
                    <input
                        id={name}
                        type={type}
                        name={name}
                        value={value ?? ""}
                        onChange={handleChange}
                        placeholder={placeholder}
                        required={required}
                    />
                )}
        </div >
    );
};

export default InputField;