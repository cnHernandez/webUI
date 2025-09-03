import { useState, useRef, useEffect } from 'react';
import logo from '../assets/logo.png';

interface MenuProps {
  nombreUsuario?: string | null;
  onLogout?: () => void;
  rolUsuario?: import('../models/Usuario').RolUsuario | null;
  onConfiguracion?: () => void;
}

export default function Menu({ nombreUsuario, onLogout, rolUsuario, onConfiguracion }: MenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const handleLogout = () => {
    setShowMenu(false);
    if (onLogout) onLogout();
    window.location.href = '/login';
  };

  return (
    <div className="w-full bg-white flex items-center h-20 shadow-md">
      <img src={logo} alt="Logo Gomería" className="h-20 w-20 object-contain ml-5" />
      <div className="flex-1 flex justify-center items-center">
        <span className="font-bold text-3xl text-gray-900 tracking-widest -ml-2">GOMERIA</span>
      </div>
      <div className="flex items-center mr-6 relative" ref={menuRef}>
        <button type="button" onClick={() => setShowMenu((v) => !v)} className="flex items-center focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-blue-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
          </svg>
          {(nombreUsuario || rolUsuario) && (
            <span className="ml-2 text-gray-800 font-medium">
              {nombreUsuario}
              {rolUsuario ? ` (${rolUsuario})` : ''}
            </span>
          )}
        </button>
        {showMenu && (
          <div className="absolute right-0 top-10 bg-white border rounded shadow-lg py-1 w-32 z-50">
            <button
              className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-blue-100"
              onClick={() => { setShowMenu(false); if (onConfiguracion) onConfiguracion(); }}
            >
              Configuración
            </button>
            <button
              className="w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-blue-100"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
