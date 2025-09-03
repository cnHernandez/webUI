import FormularioCubierta from './Cubiertas/FormularioCubierta';
import FormularioMontaje from './Cubiertas/FormularioMontaje';
import ConfiguracionUsuarios from './Usuarios/ConfiguracionUsuarios';
import Menu from './Layout/Menu';
import Login from './Usuarios/Login';
import ListaStockCubiertas from './Cubiertas/ListaStockCubiertas';
import { useState, useEffect } from 'react';
import HistorialCubiertaTab from './Cubiertas/HistorialCubiertaTab';
import { getOpcionesPorRol } from './Usuarios/rolUtils';


type TabKey = 'ingreso' | 'rotacion' | 'stock' | 'historial';

function App() {
  const [logueado, setLogueado] = useState<boolean>(false);
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);
  const [rol, setRol] = useState<import('./models/Usuario').RolUsuario | null>(null);
  const [tab, setTab] = useState<TabKey>('ingreso');
  const [showConfiguracion, setShowConfiguracion] = useState(false);

  // Relación entre opción y tabKey
  const tabMap: Record<string, TabKey> = {
    'Ingreso': 'ingreso',
    'Rotación': 'rotacion',
    'Stock': 'stock',
    'Historial': 'historial',
  };

  useEffect(() => {
    const nombre = localStorage.getItem('nombreUsuario');
    const rolLocal = localStorage.getItem('rolUsuario') as import('./models/Usuario').RolUsuario | null;
    if (nombre && rolLocal) {
      setLogueado(true);
      setNombreUsuario(nombre);
      setRol(rolLocal);
      const opciones = getOpcionesPorRol(rolLocal);
      setTab(opciones.length ? tabMap[opciones[0]] : 'ingreso');
    } else {
      setLogueado(false);
      setNombreUsuario(null);
      setRol(null);
      setTab('ingreso');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('rolUsuario');
    localStorage.removeItem('nombreUsuario');
    setLogueado(false);
    setNombreUsuario(null);
    setRol(null);
    setTab('ingreso');
  };

  if (!logueado) {
    return <Login onLoginSuccess={() => {
      setLogueado(true);
      const nombre = localStorage.getItem('nombreUsuario');
      const rolLocal = localStorage.getItem('rolUsuario') as import('./models/Usuario').RolUsuario | null;
      setNombreUsuario(nombre);
      setRol(rolLocal);
      const opciones = rolLocal ? getOpcionesPorRol(rolLocal) : [];
      setTab(opciones.length ? tabMap[opciones[0]] : 'ingreso');
    }} />;
  }

  // Solo las solapas originales
  const opciones = rol ? getOpcionesPorRol(rol).filter(o => ['Ingreso','Rotación','Stock','Historial'].includes(o)) : [];

  return (
    <div className="min-h-screen w-screen bg-white flex flex-col">
      <Menu nombreUsuario={nombreUsuario} rolUsuario={rol} onLogout={handleLogout} onConfiguracion={() => setShowConfiguracion(true)} />
      {showConfiguracion ? (
  <ConfiguracionUsuarios onVolver={() => setShowConfiguracion(false)} />
      ) : (
        <div className="w-screen bg-white rounded-none shadow-none p-0">
          <div className="flex gap-4 border-b border-gray-200 pt-4 pb-2 justify-center">
            {opciones.map(opcion => (
              <button
                key={opcion}
                className={`px-4 py-2 rounded-t-lg font-semibold border-none ${tab === tabMap[opcion] ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
                onClick={() => setTab(tabMap[opcion])}
              >{opcion}</button>
            ))}
          </div>
          {tab === 'ingreso' && <FormularioCubierta />}
          {tab === 'rotacion' && <FormularioMontaje />}
          {tab === 'stock' && (
            <div className="py-8">
              <ListaStockCubiertas />
            </div>
          )}
          {tab === 'historial' && (
            <div className="py-8">
              <HistorialCubiertaTab />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
