import { useEffect, useState, useMemo } from 'react';
import { listarColectivos } from '../serviceCubierta/listarColectivos';
import { registrarVtv } from '../serviceColectivo/registrarVtv';
import type { Colectivo } from '../models/Colectivo';
import FormularioEditarVtv from './FormularioEditarVtv';
import { actualizarVtoVtvColectivo } from '../serviceColectivo/actualizarVtoVtvColectivo';

export default function ListaColectivosVTV() {
  const [colectivos, setColectivos] = useState<Colectivo[]>([]);
  const [filtroNro, setFiltroNro] = useState('');
  const [filtroProximos, setFiltroProximos] = useState(false);
  const [modal, setModal] = useState<{ id: number; nro: string } | null>(null);
  const [modalEditar, setModalEditar] = useState<Colectivo | null>(null);
  const [fecha, setFecha] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const recargar = () => listarColectivos().then(setColectivos);

  useEffect(() => {
    recargar();
  }, []);

  const hoy = new Date();

  // Memoizar filtrado y ordenamiento para mejorar performance
  const colectivosFiltrados = useMemo(() => {
    let filtrados = colectivos.filter(c => {
      const estadoStr = String(c.Estado);
      if (estadoStr === 'FueraDeServicio' || estadoStr === '1') return false;
      if (filtroNro && !String(c.NroColectivo).includes(filtroNro)) return false;
      if (filtroProximos) {
        if (!c.VtoVTV) return false;
        const vto = new Date(c.VtoVTV);
        const dosMesesAntes = new Date(vto);
        dosMesesAntes.setMonth(vto.getMonth() - 2);
        // Incluir próximos a vencer y vencidos
        return hoy >= dosMesesAntes;
      }
      return true;
    });
    // Si filtroProximos, ordenar por VtoVTV ascendente
    if (filtroProximos) {
      filtrados = filtrados.slice().sort((a, b) => {
        if (!a.VtoVTV) return 1;
        if (!b.VtoVTV) return -1;
        return new Date(a.VtoVTV).getTime() - new Date(b.VtoVTV).getTime();
      });
    }
    return filtrados;
  }, [colectivos, filtroNro, filtroProximos]);

  const abrirModal = (id: number, nro: string) => {
    setModal({ id, nro });
    setFecha(new Date().toISOString().slice(0, 10));
    setError(null);
    setExito(false);
  };

  const cerrarModal = () => setModal(null);

  const handleRegistrar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modal) return;
    setEnviando(true);
    setError(null);
    try {
      await registrarVtv(modal.nro, modal.id, fecha);
      setExito(true);
      setTimeout(() => {
        cerrarModal();
        recargar();
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Error al registrar VTV');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="w-full bg-blue-100 py-4">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Listado de Colectivos</h2>
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
          {/* Filtro 2: Próximos a vencer */}
          <div className="bg-white rounded shadow p-3 flex flex-col items-center min-w-[180px]">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filtroProximos}
                onChange={e => setFiltroProximos(e.target.checked)}
              />
              <span className="font-medium">Próximos a vencer</span>
            </label>
            <span className="text-xs text-gray-500 mt-1">2 meses antes del vto</span>
          </div>
        </div>
        <div className="overflow-x-auto max-h-[450px] overflow-y-auto rounded border border-gray-200">
          <table className="w-full border-collapse text-black">
            <thead className="sticky top-0 bg-white z-10">
              <tr>
                <th className="border border-gray-300 p-2 text-center">Nro Colectivo</th>
                <th className="border border-gray-300 p-2 text-center">Patente</th>
                <th className="border border-gray-300 p-2 text-center">Modelo</th>
                <th className="border border-gray-300 p-2 text-center">Kilometraje</th>
                <th className="border border-gray-300 p-2 text-center">Vto VTV</th>
                <th className="border border-gray-300 p-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {colectivosFiltrados.map((c: Colectivo) => {
                let rowClass = '';
                let vtoDate: Date | null = null;
                if (c.VtoVTV) {
                  vtoDate = new Date(c.VtoVTV);
                  // Si la fecha de vencimiento es menor o igual a hoy, está vencido (rojo)
                  if (vtoDate.getTime() <= hoy.getTime()) {
                    rowClass = 'bg-red-500';
                  } else {
                    const unMesAntes = new Date(vtoDate);
                    unMesAntes.setMonth(vtoDate.getMonth() - 1);
                    if (hoy >= unMesAntes && hoy < vtoDate) {
                      rowClass = 'bg-yellow-500';
                    } else {
                      rowClass = 'bg-green-500';
                    }
                  }
                } else {
                  rowClass = 'bg-green-500';
                }
                return (
                  <tr key={c.IdColectivo} className={rowClass}>
                    <td className="border border-gray-300 p-2 text-center">{c.NroColectivo}</td>
                    <td className="border border-gray-300 p-2 text-center">{c.Patente}</td>
                    <td className="border border-gray-300 p-2 text-center">{c.Modelo || '-'}</td>
                    <td className="border border-gray-300 p-2 text-center">{c.Kilometraje ?? '-'}</td>
                    <td className="border border-gray-300 p-2 text-center">{c.VtoVTV ? String(c.VtoVTV).slice(0,10) : '-'}</td>
                    <td className="border border-gray-300 p-2 text-center flex gap-2 justify-center">
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                        onClick={() => setModalEditar(c)}
                      >
                        Editar
                      </button>
                      <button
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                        onClick={() => abrirModal(c.IdColectivo, c.NroColectivo)}
                      >
                        Registrar VTV
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal para registrar VTV */}
      {modal && (
        <div className="fixed inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50 transition-all">
          <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] max-w-[90vw] relative border">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={cerrarModal}>&times;</button>
            <h3 className="text-lg font-bold mb-4">Registrar VTV</h3>
            <form onSubmit={handleRegistrar} className="flex flex-col gap-4">
              <div>
                <label className="font-medium">Fecha de realización</label>
                <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="ml-2 border rounded px-2 py-1" required />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              {exito && (
                <div className="mt-2 p-3 bg-green-100 border border-green-400 rounded-lg text-green-800 text-center font-semibold shadow transition-all">
                  ¡VTV registrada!
                </div>
              )}
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={enviando}>
                {enviando ? 'Enviando...' : 'Registrar'}
              </button>
            </form>
          </div>
        </div>
      )}
      {/* Modal para editar Vto VTV */}
      {modalEditar && (
        <FormularioEditarVtv
          colectivo={modalEditar}
          onClose={() => {
            setModalEditar(null);
            recargar();
          }}
          onSave={async (fechaVto: string) => {
            await actualizarVtoVtvColectivo({ ...modalEditar, VtoVTV: fechaVto });
            setModalEditar(null);
            recargar();
          }}
        />
      )}
    </div>
  );
}
