import FormularioCubierta from './Cubiertas/FormularioCubierta';
import FormularioMontaje from './Cubiertas/FormularioMontaje';
import ConfiguracionUsuarios from './Usuarios/ConfiguracionUsuarios';
import Sidebar from './Layout/Sidebar';
import Login from './Usuarios/Login';
import ListaStockCubiertas from './Cubiertas/ListaStockCubiertas';
import { useState, useEffect } from 'react';
import HistorialCubiertaTab from './Cubiertas/HistorialCubiertaTab';
import { getOpcionesPorRol } from './Usuarios/rolUtils';
import ListaColectivos from './Colectivo/ListaColectivos';


type TabKey = 'ingreso' | 'rotacion' | 'stock' | 'historial';

function App() {
  const [logueado, setLogueado] = useState<boolean>(false);
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);
  const [rol, setRol] = useState<import('./models/Usuario').RolUsuario | null>(null);
  const [tab, setTab] = useState<TabKey>('ingreso');
  const [showConfiguracion, setShowConfiguracion] = useState(false);
  const [mainSection, setMainSection] = useState<'gomeria' | 'aceite'>('gomeria');
  // Eliminar evento abrirColectivos, ahora se navega con Sidebar

  // Relación entre opción y tabKey
  const tabMap: Record<string, TabKey> = {
    'Ingreso': 'ingreso',
    'Rotación': 'rotacion',
    'Stock': 'stock',
    'Historial': 'historial',
  };

  useEffect(() => {
    // Al iniciar, recuperar sesión si existe
    const nombre = localStorage.getItem('nombreUsuario');
    const rolLocal = localStorage.getItem('rolUsuario') as import('./models/Usuario').RolUsuario | null;
    if (nombre && rolLocal) {
      setLogueado(true);
      setNombreUsuario(nombre);
      setRol(rolLocal);
      const opciones = rolLocal ? getOpcionesPorRol(rolLocal) : [];
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
    <div className="min-h-screen w-screen bg-white flex">
      <Sidebar
        selected={mainSection}
        onSelect={setMainSection}
        nombreUsuario={nombreUsuario}
        rolUsuario={rol}
        onLogout={handleLogout}
        onConfiguracion={() => {
          setMainSection('gomeria');
          setShowConfiguracion(true);
        }}
      />
      <main className="flex-1">
        {showConfiguracion ? (
          <ConfiguracionUsuarios onVolver={() => setShowConfiguracion(false)} />
        ) : mainSection === 'gomeria' ? (
          <div className="w-full bg-white rounded-none shadow-none p-0">
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
        ) : mainSection === 'aceite' ? (
          <div className="w-full bg-white rounded-none shadow-none p-0">
            <div className="py-8">
              <ListaColectivos />
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default App;
