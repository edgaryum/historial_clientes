interface BotonProps {
    texto: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // Ahora es opcional
    tipo?: "primary" | "secondary";
    tipoBoton?: "button" | "submit" | "reset"; // Para especificar el tipo de botón
}

const Boton: React.FC<BotonProps> = ({ texto, onClick, tipo = "primary", tipoBoton = "button" }) => {
    return (
        <button 
            onClick={onClick} 
            className={`boton ${tipo}`} 
            type={tipoBoton} // Se asegura de que el tipo sea configurable
        >
            {texto}
        </button>
    );
};

export default Boton;
