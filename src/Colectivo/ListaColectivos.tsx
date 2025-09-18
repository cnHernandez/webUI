
import { useEffect, useState } from 'react';
import HistorialCambioAceiteTab from './HistorialCambioAceiteTab';
import { listarColectivos } from '../serviceCubierta/listarColectivos';
import { obtenerHistorialCambioAceite } from '../serviceCambioAceite/obtenerHistorialCambioAceite';
import { registrarCambioAceite } from '../serviceCambioAceite/registrarCambioAceite';
import type { Colectivo } from '../models/Colectivo';


const ListaColectivos: React.FC = () => {
  const [tab, setTab] = useState<'listado' | 'historial'>('listado');
  const [colectivos, setColectivos] = useState<Colectivo[]>([]);
  const [ultimoCambio, setUltimoCambio] = useState<{ [id: number]: number }>({});
  const [modal, setModal] = useState<null | { colectivoId: number; kilometros: number }>(null);
  const [form, setForm] = useState({
    cambioAceite: true,
    cambioFiltros: false,
    fecha: '',
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState(false);
  const [filtroNro, setFiltroNro] = useState('');
  const [filtroProximos, setFiltroProximos] = useState(false);

  // Manejo de formulario modal
  const abrirModal = (colectivoId: number, kilometros: number) => {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    const fechaActual = `${yyyy}-${mm}-${dd}`;
    setModal({ colectivoId, kilometros });
    setForm({ cambioAceite: true, cambioFiltros: false, fecha: fechaActual });
    setError(null);
    setExito(false);
  };
  const cerrarModal = () => setModal(null);
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal) return;
    setEnviando(true);
    setError(null);
    try {
      await registrarCambioAceite({
        ColectivoId: modal.colectivoId,
        Fecha: form.fecha,
        Kilometros: modal.kilometros,
        FiltrosCambiados: form.cambioFiltros,
      });
      setExito(true);
      setTimeout(() => {
        cerrarModal();
        window.location.reload(); // Refrescar lista
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Error al registrar el cambio');
    } finally {
      setEnviando(false);
    }
  };

  useEffect(() => {
    listarColectivos().then(async (data) => {
      setColectivos(data);
      // Para cada colectivo, obtener el último cambio de aceite
      const cambios: { [id: number]: number } = {};
      await Promise.all(
        data.map(async (c: Colectivo) => {
          try {
            const historial = await obtenerHistorialCambioAceite(c.IdColectivo);
            if (Array.isArray(historial) && historial.length > 0) {
              cambios[c.IdColectivo] = historial[0].Kilometros;
            }
          } catch {
            // Nada
          }
        })
      );
      setUltimoCambio(cambios);
    });
  }, []);

  // Filtro de colectivos
  const colectivosFiltrados = colectivos.filter((c) => {
    if (filtroNro && !String(c.NroColectivo).includes(filtroNro)) return false;
    if (filtroProximos) {
      const kmUltimo = ultimoCambio[c.IdColectivo] ?? 0;
      const kmActual = c.Kilometraje ?? 0;
      const kmDesdeCambio = kmActual - kmUltimo;
      if (kmDesdeCambio <= 14000) return false;
    }
    return true;
  });

  return (
  <div className="w-full bg-blue-100 py-4">
  <div className="max-w-4xl h-screen mx-auto p-8 bg-white rounded-xl shadow-lg overflow-visible">
        {/* Solapas */}
        <div className="flex gap-4 border-b border-gray-200 pt-2 pb-2 justify-center mb-4">
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold border-none ${tab === 'listado' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setTab('listado')}
          >Listado</button>
          <button
            className={`px-4 py-2 rounded-t-lg font-semibold border-none ${tab === 'historial' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}
            onClick={() => setTab('historial')}
          >Historial</button>
        </div>
        {tab === 'listado' && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-center">Listado de Colectivos</h2>
            {/* Filtros estilo stockCubierta */}
            <div className="flex flex-row justify-center gap-16 mb-6 items-center">
              {/* Filtro 1: Nro Colectivo */}
              <div className="bg-white rounded shadow p-3 flex flex-col items-center min-w-[180px]">
                <label className="font-medium mb-1">Nro Colectivo</label>
                <input
                  type="text"
                  value={filtroNro}
                  onChange={e => setFiltroNro(e.target.value)}
                  placeholder="Filtrar por colectivo..."
                  className="border rounded px-2 py-1 w-full"
                />
              </div>
              {/* Filtro 2: Próximos a cambio */}
              <div className="bg-white rounded shadow p-3 flex flex-col items-center min-w-[180px]">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filtroProximos}
                    onChange={e => setFiltroProximos(e.target.checked)}
                  />
                  <span className="font-medium">Próximos a cambio</span>
                </label>
                <span className="text-xs text-gray-500 mt-1">&gt; 14000 km</span>
              </div>
            </div>
            {/* Scroll solo a la tabla, altura menor para margen igual al sidebar */}
            <div className="overflow-x-auto max-h-[40vh] overflow-y-auto rounded border border-gray-200">
              <table className="w-full border-collapse text-black">
                <thead className="sticky top-0 bg-white z-10">
                  <tr>
                    <th className="border border-gray-300 p-2 text-center">Nro Colectivo</th>
                    <th className="border border-gray-300 p-2 text-center">Patente</th>
                    <th className="border border-gray-300 p-2 text-center">Modelo</th>
                    <th className="border border-gray-300 p-2 text-center">Kilometraje</th>
                    <th className="border border-gray-300 p-2 text-center">Km Último Cambio</th>
                    <th className="border border-gray-300 p-2 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {colectivosFiltrados.map((c) => {
                    const kmUltimo = ultimoCambio[c.IdColectivo] ?? 0;
                    const kmActual = c.Kilometraje ?? 0;
                    const kmDesdeCambio = kmActual - kmUltimo;
                    let rowClass = '';
                    if (kmDesdeCambio >= 15000) {
                      rowClass = 'bg-red-300';
                    } else if (kmDesdeCambio > 14000) {
                      rowClass = 'bg-yellow-100';
                    } else {
                      rowClass = 'bg-green-100';
                    }
                    return (
                      <tr key={c.IdColectivo} className={rowClass}>
                        <td className="border border-gray-300 p-2 text-center">{c.NroColectivo}</td>
                        <td className="border border-gray-300 p-2 text-center">{c.Patente}</td>
                        <td className="border border-gray-300 p-2 text-center">{c.Modelo || '-'}</td>
                        <td className="border border-gray-300 p-2 text-center">{c.Kilometraje ?? '-'}</td>
                        <td className="border border-gray-300 p-2 text-center">{kmUltimo}</td>
                        <td className="border border-gray-300 p-2 text-center">
                          <button
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                            onClick={() => abrirModal(c.IdColectivo, c.Kilometraje ?? 0)}
                          >
                            Realizar cambio
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {tab === 'historial' && <HistorialCambioAceiteTab />}
      </div>

      {/* Modal de cambio de aceite */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] max-w-[90vw] relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={cerrarModal}>&times;</button>
            <h3 className="text-lg font-bold mb-4">Registrar cambio de aceite</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="font-medium">Cambio de aceite</label>
                <input type="checkbox" name="cambioAceite" checked={form.cambioAceite} onChange={handleFormChange} className="ml-2" disabled />
                <span className="text-xs text-gray-500 ml-2">(Obligatorio)</span>
              </div>
              <div>
                <label className="font-medium">Cambio de filtros</label>
                <input type="checkbox" name="cambioFiltros" checked={form.cambioFiltros} onChange={handleFormChange} className="ml-2" />
              </div>
              <div>
                <label className="font-medium">Fecha de cambio</label>
                <input type="date" name="fecha" value={form.fecha} onChange={handleFormChange} className="ml-2 border rounded px-2 py-1" required />
              </div>
              <div>
                <label className="font-medium">Kilometraje actual</label>
                <input type="number" value={modal.kilometros} readOnly className="ml-2 border rounded px-2 py-1 bg-gray-100" />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              {exito && <div className="text-green-600 text-sm">¡Cambio registrado!</div>}
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={enviando}>
                {enviando ? 'Enviando...' : 'Registrar'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


export default ListaColectivos;
