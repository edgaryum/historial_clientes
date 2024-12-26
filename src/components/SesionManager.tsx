import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

interface SessionManagerProps {
  setRol: (role: string | null) => void;
}

const SessionManager: React.FC<SessionManagerProps> = ({ setRol }) => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storageRole = localStorage.getItem('role');

    if (token) {
      try {
        const decoded: { exp: number; role: string } = jwtDecode(token);

        // Validar si el token ha expirado
        if (decoded.exp * 1000 > Date.now()) {
          setRol(storageRole); // Si el token es válido, usamos el rol almacenado
        } else {
          handleLogout(); // Si el token expiró, cerrar sesión
        }
      } catch (error) {
        handleLogout(); // Si el token es inválido, cerrar sesión
      }
    } else {
      handleLogout(); // Si no hay token, cerrar sesión
    }
  }, [setRol]);

  const handleLogout = () => {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    setRol(null); // Resetear el rol
  };

  return null;
};

export default SessionManager;
