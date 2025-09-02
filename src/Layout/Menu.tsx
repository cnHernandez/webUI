

import logo from '../assets/logo.png';

interface MenuProps {
  nombreUsuario?: string | null;
  onLogout?: () => void;
}

export default function Menu({ nombreUsuario, onLogout }: MenuProps) {
  return (
    <div className="w-full bg-white flex items-center h-20 shadow-md">
      <img src={logo} alt="Logo Gomería" className="h-20 w-20 object-contain ml-5" />
      <div className="flex-1 flex justify-center items-center">
        <span className="font-bold text-3xl text-gray-900 tracking-widest -ml-24">GOMERIA</span>
      </div>
      <div className="flex items-center mr-6">
        <button type="button" onClick={onLogout} className="flex items-center focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
          </svg>
          {nombreUsuario && (
            <span className="ml-2 text-gray-800 font-medium">{nombreUsuario}</span>
          )}
        </button>
      </div>
    </div>
  );
}
