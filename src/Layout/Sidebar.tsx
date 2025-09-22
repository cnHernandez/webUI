import React from 'react';
import logo from '../assets/logo.png';
// import eliminado, ya no se usa

interface SidebarProps {
  selected: 'gomeria' | 'aceite' | 'colectivos VTV';
  onSelect: (key: 'gomeria' | 'aceite' | 'colectivos VTV') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selected, onSelect }) => {
  return (
  <aside className="h-screen w-56 bg-white flex flex-col shadow-md">
      <div className="flex items-center justify-center h-36 px-4">
        <img src={logo} alt="Logo Gomería" className="h-28 w-28 object-contain" />
      </div>
      <nav className="flex-1 flex flex-col gap-2 mt-16 px-2">
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
        <button
          className={`text-left px-4 py-2 rounded-lg font-semibold transition-colors ${selected === 'colectivos VTV' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
          onClick={() => onSelect('colectivos VTV')}
        >
          Colectivos VTV
        </button>
      </nav>
      {/* El usuario y menú ahora se muestran en el header superior derecho */}
    </aside>
  );
};

export default Sidebar;
