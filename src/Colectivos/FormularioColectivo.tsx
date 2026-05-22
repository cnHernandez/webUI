import { useEffect, useState } from 'react';
import { obtenerColectivoPorNro } from '../serviceColectivo/obtenerColectivoPorNro';
import { crearEditarColectivo } from '../serviceColectivo/crearEditarColectivo';
import { eliminarColectivo } from '../serviceColectivo/eliminarColectivo';
import type { Colectivo } from '../models/Colectivo';

interface Props {
  colectivoInicial?: Colectivo | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

type EstadoFormulario = 'Activo' | 'FueraDeServicio' | 'DarDeBaja';

const estadoMap: Record<EstadoFormulario, number> = { Activo: 0, FueraDeServicio: 1, DarDeBaja: 2 };

function cargarEstado(valor?: Colectivo['Estado'] | number | string | null): EstadoFormulario {
  if (valor === 'DarDeBaja' || valor === 2 || valor === '2') {
    return 'DarDeBaja';
  }

  if (valor === 'FueraDeServicio' || valor === 1 || valor === '1') {
    return 'FueraDeServicio';
  }

  return 'Activo';
}

export default function FormularioColectivo({ colectivoInicial, onSuccess, onCancel }: Props) {
  const [nroColectivo, setNroColectivo] = useState('');
  const [patente, setPatente] = useState('');
  const [modelo, setModelo] = useState('');
  const [estado, setEstado] = useState<EstadoFormulario>('Activo');
  const [kilometraje, setKilometraje] = useState('');
  const [vtoVTV, setVtoVTV] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [idColectivoEditando, setIdColectivoEditando] = useState<number | null>(null);

  const esModal = typeof onCancel === 'function';
  const editando = idColectivoEditando !== null;

  const resetFormulario = (nro = '') => {
    setNroColectivo(nro);
    setPatente('');
    setModelo('');
    setEstado('Activo');
    setKilometraje('');
    setVtoVTV('');
    setIdColectivoEditando(null);
  };

  const cargarFormulario = (colectivo: Colectivo) => {
    setIdColectivoEditando(colectivo.IdColectivo);
    setNroColectivo(colectivo.SinAsignacion ? '' : (colectivo.NroColectivo || ''));
    setPatente(colectivo.Patente || '');
    setModelo(colectivo.Modelo || '');
    setEstado(cargarEstado(colectivo.Estado));
    setKilometraje(colectivo.Kilometraje?.toString() || '');
    setVtoVTV(colectivo.VtoVTV?.slice(0, 10) || '');
  };

  useEffect(() => {
    if (colectivoInicial) {
      cargarFormulario(colectivoInicial);
      setMensaje('');
      return;
    }

    resetFormulario();
  }, [colectivoInicial]);

  const handleNroBlur = async () => {
    if (!nroColectivo) return;

    if (colectivoInicial && !colectivoInicial.SinAsignacion) return;

    const colectivo = await obtenerColectivoPorNro(nroColectivo.trim());
    if (colectivo) {
      cargarFormulario(colectivo);
      setMensaje(
        colectivo.SinAsignacion
          ? `Número disponible sin asignación${colectivo.NumeroLiberado ? ` (antes n°${colectivo.NumeroLiberado})` : ''}. Puede completar los datos y volver a activarlo.`
          : 'Unidad existente cargada. Puede editar los datos del colectivo y la fecha de VTV.'
      );
    } else {
      if (!colectivoInicial) {
        resetFormulario(nroColectivo.trim());
      }
      setMensaje('');
    }
  };

  const obtenerMensajeError = async (response: Response, mensajeDefault: string) => {
    try {
      const texto = await response.text();
      return texto || mensajeDefault;
    } catch {
      return mensajeDefault;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setMensaje('');
    try {
      const response = await crearEditarColectivo({
        editando,
        idColectivoEditando,
        nroColectivo,
        patente,
        modelo,
        estado: estadoMap[estado],
        kilometraje: kilometraje ? Number(kilometraje) : undefined,
        vtoVTV: vtoVTV || undefined,
      });

      if (!response.ok) {
        throw new Error(await obtenerMensajeError(response, editando ? 'Error al modificar colectivo' : 'Error al crear colectivo'));
      }

      if (editando) {
        setMensaje('Unidad actualizada correctamente');
        onSuccess?.();
        onCancel?.();
      } else {
        setMensaje('Colectivo ingresado correctamente');
        onSuccess?.();
        resetFormulario();
      }
    } catch (err: any) {
      setMensaje(err?.message || (editando ? 'Error al modificar colectivo' : 'Error al crear colectivo'));
    } finally {
      setEnviando(false);
    }
  };

  const handleDarDeBaja = async () => {
    if (!idColectivoEditando) return;

    setEnviando(true);
    setMensaje('');
    const ok = await eliminarColectivo(idColectivoEditando);
    setEnviando(false);

    if (!ok) {
      setMensaje('No se pudo dar de baja la unidad.');
      return;
    }

    setMensaje('Unidad dada de baja correctamente');
    onSuccess?.();

    if (onCancel) {
      onCancel();
      return;
    }

    resetFormulario();
  };

  return (
    <div className={esModal ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4' : 'w-full min-h-screen bg-blue-100 flex flex-col items-center justify-center'}>
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl border border-black relative">
        {esModal && (
          <button onClick={onCancel} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800" type="button">
            ×
          </button>
        )}
        <h2 className="text-xl font-bold mb-4 text-center">{editando ? 'Gestión de Colectivo' : 'Alta de Colectivo'}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex gap-8">
            <div className="flex flex-col gap-4 min-w-[220px]">
              <label className="font-medium text-black block">Nro. Colectivo
                <input
                  type="text"
                  value={nroColectivo}
                  onChange={e => setNroColectivo(e.target.value)}
                  onBlur={handleNroBlur}
                  required
                  className="border border-gray-300 rounded-md p-2 w-full mt-1 text-black"
                />
              </label>
              <label className="font-medium text-black block">Patente
                <input type="text" value={patente} onChange={e => setPatente(e.target.value)} required className="border border-gray-300 rounded-md p-2 w-full mt-1 text-black" />
              </label>
              <label className="font-medium text-black block">Modelo
                <input type="text" value={modelo} onChange={e => setModelo(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full mt-1 text-black" />
              </label>
            </div>
            <div className="flex flex-col gap-4 min-w-[220px]">
              <label className="font-medium text-black block">Estado
                <select value={estado} onChange={e => setEstado(e.target.value as EstadoFormulario)} className="border border-gray-300 rounded-md p-2 w-full mt-1">
                  <option value="Activo">Activo</option>
                  <option value="FueraDeServicio">Fuera de Servicio</option>
                  <option value="DarDeBaja">Dar de Baja</option>
                </select>
              </label>
              <label className="font-medium text-black block">Kilometraje
                <input type="number" value={kilometraje} onChange={e => setKilometraje(e.target.value)} min="0" className="border border-gray-300 rounded-md p-2 w-full mt-1 text-black" />
              </label>
              <label className="font-medium text-black block">Vto VTV
                <input type="date" value={vtoVTV} onChange={e => setVtoVTV(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full mt-1 text-black" />
              </label>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-md w-44 font-medium text-base cursor-pointer border-none" disabled={enviando}>
              {editando ? 'Guardar cambios' : 'Guardar Colectivo'}
            </button>
            {editando && (
              <button type="button" className="bg-red-600 text-white py-2 px-6 rounded-md w-44 font-medium text-base cursor-pointer border-none" disabled={enviando} onClick={handleDarDeBaja}>
                Dar de baja
              </button>
            )}
            {esModal && (
              <button type="button" className="bg-gray-200 text-gray-800 py-2 px-6 rounded-md w-44 font-medium text-base cursor-pointer border-none" onClick={onCancel}>
                Cancelar
              </button>
            )}
          </div>
        </form>
        {mensaje && (
          <div className={`mt-6 p-4 ${mensaje.toLowerCase().includes('error') || mensaje.toLowerCase().includes('no se pudo') ? 'bg-red-100 border-red-400 text-red-800' : 'bg-green-100 border-green-400 text-green-800'} border rounded-lg text-center font-semibold shadow`}>
            <span>{mensaje}</span>
          </div>
        )}
      </div>
    </div>
  );
}
