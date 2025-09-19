import React, { useState, useRef, useEffect } from 'react';
import { RolUsuario } from '../models/Usuario';

interface UserMenuProps {
  nombreUsuario?: string | null;
  rolUsuario?: string | null;
  onLogout?: () => void;
  onConfiguracion?: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ nombreUsuario, rolUsuario, onLogout, onConfiguracion }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-300 focus:outline-none"
        onClick={() => setOpen(o => !o)}
      >
        <span className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 text-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
          </svg>
        </span>
        <span className="font-semibold text-gray-700 text-sm">{nombreUsuario}</span>
        <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="px-3 py-2 text-gray-700 text-xs border-b">{nombreUsuario} {rolUsuario && `(${rolUsuario})`}</div>
          {rolUsuario === RolUsuario.Administrador && (
            <button
              className="w-full text-left px-3 py-2 text-blue-700 hover:bg-blue-50 text-xs"
              onClick={() => { setOpen(false); onConfiguracion && onConfiguracion(); }}
            >Configuración</button>
          )}
          <button
            className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 text-xs"
            onClick={() => { setOpen(false); onLogout && onLogout(); }}
          >Cerrar sesión</button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;