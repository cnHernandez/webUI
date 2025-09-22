import UserMenu from './Layout/UserMenu';
import GomeriaTabs from './Cubiertas/GomeriaTabs';
import ConfiguracionUsuarios from './Usuarios/ConfiguracionUsuarios';
import Sidebar from './Layout/Sidebar';
import Login from './Usuarios/Login';
import { useState, useEffect } from 'react';
import AceiteTabs from './Aceite/AceiteTabs';
import ColectivosTabs from './Colectivos/ColectivosTabs';
// type TabKey = 'ingreso' | 'rotacion' | 'stock' | 'historial';


function App() {
  const [logueado, setLogueado] = useState<boolean>(false);
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);
  const [rol, setRol] = useState<import('./models/Usuario').RolUsuario | null>(null);
  // const [tab, setTab] = useState<TabKey>('ingreso');
  // const [aceiteTab, setAceiteTab] = useState<AceiteTabKey>('listado');
  const [showConfiguracion, setShowConfiguracion] = useState(false);
  const [mainSection, setMainSection] = useState<'gomeria' | 'aceite' | 'colectivos VTV'>('gomeria');

  // Relación entre opción y tabKey
  // const tabMap: Record<string, TabKey> = {
  //   'Ingreso': 'ingreso',
  //   'Rotación': 'rotacion',
  //   'Stock': 'stock',
  //   'Historial': 'historial',
  // };

  // Opciones para Aceite
  // const aceiteTabMap: Record<string, AceiteTabKey> = {
  //   'Listado': 'listado',
  //   'Historial': 'historial',
  // };

  useEffect(() => {
    // Al iniciar, recuperar sesión si existe
    const nombre = localStorage.getItem('nombreUsuario');
    const rolLocal = localStorage.getItem('rolUsuario') as import('./models/Usuario').RolUsuario | null;
    if (nombre && rolLocal) {
      setLogueado(true);
      setNombreUsuario(nombre);
      setRol(rolLocal);
  // const opciones = rolLocal ? getOpcionesPorRol(rolLocal) : [];
  // setTab(opciones.length ? tabMap[opciones[0]] : 'ingreso');
    } else {
      setLogueado(false);
      setNombreUsuario(null);
      setRol(null);
  // setTab('ingreso');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('rolUsuario');
    localStorage.removeItem('nombreUsuario');
    setLogueado(false);
    setNombreUsuario(null);
    setRol(null);
  // setTab('ingreso');
  // setAceiteTab('listado');
  };

  if (!logueado) {
    return <Login onLoginSuccess={() => {
      setLogueado(true);
      const nombre = localStorage.getItem('nombreUsuario');
      const rolLocal = localStorage.getItem('rolUsuario') as import('./models/Usuario').RolUsuario | null;
      setNombreUsuario(nombre);
      setRol(rolLocal);
  // const opciones = rolLocal ? getOpcionesPorRol(rolLocal) : [];
          <AceiteTabs />
    }} />;
  }

  // Solo las solapas originales
  // const opciones = rol ? getOpcionesPorRol(rol).filter(o => ['Ingreso','Rotación','Stock','Historial'].includes(o)) : [];
  // Opciones para Aceite (puedes personalizar según el rol si lo necesitas)
  // const aceiteOpciones = ['Listado', 'Historial'];

  return (
    <div className="min-h-screen w-screen bg-white flex">
      <Sidebar
        selected={mainSection}
        onSelect={setMainSection}
      />
      <main className="flex-1">
        <div className="w-full flex justify-between items-center pt-6 pb-2 px-8">
          <h1 className="text-3xl font-bold text-blue-700 text-center flex-1">MOGPSA</h1>
          <div className="relative flex items-center justify-end" style={{ minWidth: 180 }}>
            <UserMenu
              nombreUsuario={nombreUsuario}
              rolUsuario={rol}
              onLogout={handleLogout}
              onConfiguracion={() => {
                setMainSection('gomeria');
                setShowConfiguracion(true);
              }}
            />
          </div>
        </div>
        {showConfiguracion ? (
          <ConfiguracionUsuarios onVolver={() => setShowConfiguracion(false)} />
        ) : mainSection === 'gomeria' ? (
          <GomeriaTabs />
        ) : mainSection === 'aceite' ? (
          <AceiteTabs />
        ) : mainSection === 'colectivos VTV' ? (
          <ColectivosTabs />
        ) : null}
      </main>
    </div>
  );
}

export default App;
