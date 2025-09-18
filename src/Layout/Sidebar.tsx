import React from 'react';
import logo from '../assets/logo.png';
import { RolUsuario } from '../models/Usuario';

interface SidebarProps {
  selected: 'gomeria' | 'aceite';
  onSelect: (key: 'gomeria' | 'aceite') => void;
  nombreUsuario?: string | null;
  rolUsuario?: string | null;
  onLogout?: () => void;
  onConfiguracion?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selected, onSelect, nombreUsuario, rolUsuario, onLogout, onConfiguracion }) => {
  return (
  <aside className="h-screen w-56 bg-white flex flex-col shadow-md">
      <div className="flex items-center justify-center h-24 px-4">
        <img src={logo} alt="Logo Gomería" className="h-20 w-20 object-contain" />
      </div>
      <nav className="flex-1 flex flex-col gap-2 mt-6 px-2">
        <button
          className={`text-left px-4 py-2 rounded-lg font-semibold transition-colors ${selected === 'gomeria' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => onSelect('gomeria')}
        >
          Gomería
        </button>
        <button
          className={`text-left px-4 py-2 rounded-lg font-semibold transition-colors ${selected === 'aceite' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => onSelect('aceite')}
        >
          Aceite
        </button>
      </nav>
      <div className="mt-auto px-4 py-4 flex flex-col gap-1">
        <span className="text-sm text-gray-600">{nombreUsuario} {rolUsuario && `(${rolUsuario})`}</span>
        {rolUsuario === RolUsuario.Administrador && (
          <button
            className="text-sm text-blue-700 hover:underline text-left"
            onClick={onConfiguracion}
          >Configuración</button>
        )}
        <button
          className="text-sm text-red-600 hover:underline text-left"
          onClick={onLogout}
        >Cerrar sesión</button>
      </div>
    </aside>
  );
};

export default Sidebar;
