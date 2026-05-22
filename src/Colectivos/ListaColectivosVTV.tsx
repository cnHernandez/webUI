import { useEffect, useState, useMemo } from 'react';
import { listarColectivos } from '../serviceCubierta/listarColectivos';
import { registrarVtv } from '../serviceColectivo/registrarVtv';
import InfoUltimoProcesamiento from '../components/InfoUltimoProcesamiento';
import type { Colectivo } from '../models/Colectivo';
import FormularioColectivo from './FormularioColectivo';
import { ubicacionesCubierta } from '../serviceCubierta/listarUbicaciones';

function describirNumero(colectivo: Colectivo) {
  if (colectivo.NroColectivo) {
    return colectivo.NroColectivo;
  }

  if (colectivo.NumeroLiberado) {
    return `Sin asignar (antes n°${colectivo.NumeroLiberado})`;
  }

  return 'Sin asignar';
}

function traducirEstadoCubierta(estado?: string) {
  if (!estado) {
    return '-';
  }

  switch (estado) {
    case 'DobleRecapada':
      return 'Doble recapada';
    case 'TripleRecapada':
      return 'Triple recapada';
    case 'EnReparacion':
      return 'En reparación';
    default:
      return estado;
  }
}

function obtenerCubiertasPorUbicacion(colectivo: Colectivo) {
  const montajesPorUbicacion = new Map((colectivo.CubiertasMontadas ?? []).map(montaje => [montaje.IdUbicacion, montaje]));

  return ubicacionesCubierta.map(ubicacion => {
    const montaje = montajesPorUbicacion.get(ubicacion.IdUbicacion);

    return {
      IdUbicacion: ubicacion.IdUbicacion,
      DescripcionUbicacion: ubicacion.Descripcion,
      NroSerie: montaje?.NroSerie ?? '-',
      EstadoCubierta: traducirEstadoCubierta(montaje?.EstadoCubierta),
    };
  });
}

export default function ListaColectivosVTV() {
  const [cargando, setCargando] = useState(true);
  const [colectivos, setColectivos] = useState<Colectivo[]>([]);
  const [filtroNro, setFiltroNro] = useState('');
  const [filtroProximos, setFiltroProximos] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<'activos' | 'fueraDeServicio' | 'darDeBaja' | 'numerosDisponibles' | 'todos'>('activos');
  const [modal, setModal] = useState<{ id: number; nro: string } | null>(null);
  const [modalEditar, setModalEditar] = useState<Colectivo | null>(null);
  const [modalCubiertas, setModalCubiertas] = useState<Colectivo | null>(null);
  const [fecha, setFecha] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recargar = async () => {
    setCargando(true);
    const data = await listarColectivos({ incluirSinAsignacion: true, incluirDadasDeBaja: true });
    setColectivos(data);
    setCargando(false);
  };

  useEffect(() => {
    recargar();
  }, []);

  const hoy = new Date();

  const colectivosFiltrados = useMemo(() => {
    let filtrados = colectivos.filter(c => {
      const estaFueraDeServicio = c.Estado === 'FueraDeServicio';
      const estaDadoDeBaja = c.Estado === 'DarDeBaja';

      if (filtroEstado === 'activos' && (estaFueraDeServicio || estaDadoDeBaja)) return false;
      if (filtroEstado === 'fueraDeServicio' && !estaFueraDeServicio) return false;
      if (filtroEstado === 'darDeBaja' && !estaDadoDeBaja) return false;
      if (filtroEstado === 'numerosDisponibles') return false;
      if (filtroNro && !describirNumero(c).includes(filtroNro)) return false;
      if (filtroProximos) {
        if (!c.VtoVTV) return false;
        const vto = new Date(c.VtoVTV);
        const dosMesesAntes = new Date(vto);
        dosMesesAntes.setMonth(vto.getMonth() - 2);
        return hoy >= dosMesesAntes;
      }
      return true;
    });
    filtrados = filtrados.slice().sort((a, b) => {
      if (!a.VtoVTV && !b.VtoVTV) return 0;
      if (!a.VtoVTV) return 1;
      if (!b.VtoVTV) return -1;
      return new Date(a.VtoVTV).getTime() - new Date(b.VtoVTV).getTime();
    });
    return filtrados;
  }, [colectivos, filtroEstado, filtroNro, filtroProximos]);

  const numerosDisponibles = useMemo(() => {
    if (filtroEstado !== 'numerosDisponibles') {
      return [] as string[];
    }

    const unicos = new Set(
      colectivos
        .map(colectivo => colectivo.NumeroDisponibleActual?.trim())
        .filter((numero): numero is string => Boolean(numero))
    );

    return Array.from(unicos)
      .filter(numero => !filtroNro || numero.includes(filtroNro))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  }, [colectivos, filtroEstado, filtroNro]);

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
      await registrarVtv(modal.nro, fecha);
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
      <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg">
        {cargando ? (
          <div className="flex flex-col items-center justify-center h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mb-4"></div>
            <span className="text-blue-700 font-semibold text-lg">Cargando datos...</span>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-4 text-center">Listado de Colectivos</h2>
            <InfoUltimoProcesamiento />
            <div className="flex flex-row justify-center gap-6 mb-6 items-center flex-wrap">
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
              <div className="bg-white rounded shadow p-3 flex flex-col items-center min-w-[180px]">
                <label className="font-medium mb-1">Estado</label>
                <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value as 'activos' | 'fueraDeServicio' | 'darDeBaja' | 'numerosDisponibles' | 'todos')} className="border rounded px-2 py-1 w-full">
                  <option value="activos">Activos</option>
                  <option value="fueraDeServicio">Fuera de servicio</option>
                  <option value="darDeBaja">Dar de baja</option>
                  <option value="numerosDisponibles">Números disponibles</option>
                  <option value="todos">Todos</option>
                </select>
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
                    <th className="border border-gray-300 p-2 text-center">Estado</th>
                    <th className="border border-gray-300 p-2 text-center">Kilometraje</th>
                    <th className="border border-gray-300 p-2 text-center">Vto VTV</th>
                    <th className="border border-gray-300 p-2 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtroEstado === 'numerosDisponibles' && numerosDisponibles.map(numero => (
                    <tr key={numero} className="bg-white">
                      <td className="border border-gray-300 p-2 text-center">Disponible n°{numero}</td>
                      <td className="border border-gray-300 p-2 text-center">-</td>
                      <td className="border border-gray-300 p-2 text-center">-</td>
                      <td className="border border-gray-300 p-2 text-center">Sin asignar</td>
                      <td className="border border-gray-300 p-2 text-center">-</td>
                      <td className="border border-gray-300 p-2 text-center">-</td>
                      <td className="border border-gray-300 p-2 text-center">Sin acciones</td>
                    </tr>
                  ))}
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
                        <td className="border border-gray-300 p-2 text-center">{describirNumero(c)}</td>
                        <td className="border border-gray-300 p-2 text-center">{c.Patente || '-'}</td>
                        <td className="border border-gray-300 p-2 text-center">{c.Modelo || '-'}</td>
                        <td className="border border-gray-300 p-2 text-center">{c.Estado === 'DarDeBaja' ? 'Dado de baja' : c.Estado === 'FueraDeServicio' ? 'Fuera de Servicio' : 'Activo'}</td>
                        <td className="border border-gray-300 p-2 text-center">{c.Kilometraje ?? '-'}</td>
                        <td className="border border-gray-300 p-2 text-center">{c.VtoVTV ? String(c.VtoVTV).slice(0,10) : '-'}</td>
                        <td className="border border-gray-300 p-2 text-center flex gap-2 justify-center">
                          <button
                            className="bg-slate-700 text-white px-3 py-1 rounded hover:bg-slate-800 text-sm"
                            onClick={() => setModalCubiertas(c)}
                          >
                            Ver cubiertas
                          </button>
                          <button
                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                            onClick={() => setModalEditar(c)}
                          >
                            Editar
                          </button>
                          {!c.SinAsignacion && c.Estado !== 'DarDeBaja' && c.NroColectivo && (
                            <button
                              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                              onClick={() => abrirModal(c.IdColectivo, c.NroColectivo)}
                            >
                              Registrar VTV
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
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
            {/* Modal para editar la unidad completa */}
            {modalEditar && (
              <FormularioColectivo
                colectivoInicial={modalEditar}
                onSuccess={recargar}
                onCancel={() => setModalEditar(null)}
              />
            )}
            {modalCubiertas && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl border border-gray-200 relative">
                  <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                    onClick={() => setModalCubiertas(null)}
                    type="button"
                  >
                    ×
                  </button>
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-center">Cubiertas del colectivo {describirNumero(modalCubiertas)}</h3>
                  </div>
                  <div className="p-6 overflow-x-auto">
                    <table className="w-full border-collapse text-black">
                      <thead>
                        <tr>
                          <th className="border border-gray-300 p-2 text-center">Ubicación</th>
                          <th className="border border-gray-300 p-2 text-center">Nro. cubierta</th>
                          <th className="border border-gray-300 p-2 text-center">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {obtenerCubiertasPorUbicacion(modalCubiertas).map(cubierta => (
                          <tr key={cubierta.IdUbicacion}>
                            <td className="border border-gray-300 p-2">{cubierta.DescripcionUbicacion}</td>
                            <td className="border border-gray-300 p-2 text-center">{cubierta.NroSerie}</td>
                            <td className="border border-gray-300 p-2 text-center">{cubierta.EstadoCubierta}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
