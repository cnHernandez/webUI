import { useState } from 'react';
import { obtenerColectivoPorNro } from '../serviceColectivo/obtenerColectivoPorNro';
import { crearEditarColectivo } from '../serviceColectivo/crearEditarColectivo';

interface Props {
  onSuccess?: () => void;
}

export default function FormularioColectivo({ onSuccess }: Props) {
  const [nroColectivo, setNroColectivo] = useState('');
  const [patente, setPatente] = useState('');
  const [modelo, setModelo] = useState('');
  const [estado, setEstado] = useState<'Activo' | 'FueraDeServicio'>('Activo');
  // Mapeo de string a número para el backend
  const estadoMap: Record<string, number> = { 'Activo': 0, 'FueraDeServicio': 1 };
  const [kilometraje, setKilometraje] = useState('');
  const [vtoVTV, setVtoVTV] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [idColectivoEditando, setIdColectivoEditando] = useState<number|null>(null);

  const handleNroBlur = async () => {
    if (!nroColectivo) return;
    const colectivo = await obtenerColectivoPorNro(nroColectivo);
    if (colectivo) {
      setPatente(colectivo.Patente || '');
      setModelo(colectivo.Modelo || '');
      setEstado(colectivo.Estado || 'Activo');
      setKilometraje(colectivo.Kilometraje?.toString() || '');
      setVtoVTV(colectivo.VtoVTV?.slice(0, 10) || '');
      setEditando(true);
      setIdColectivoEditando(colectivo.IdColectivo);
      setMensaje('ℹ️ Colectivo existente, solo puede modificar el kilometraje.');
    } else {
      setEditando(false);
      setIdColectivoEditando(null);
      setPatente('');
      setModelo('');
      setEstado('Activo');
      setKilometraje('');
      setVtoVTV('');
      setMensaje('');
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
      if (!response.ok) throw new Error(editando ? 'Error al modificar colectivo' : 'Error al crear colectivo');
      if (editando) {
        setMensaje('✅ Kilometraje modificado con éxito');
      } else {
        setMensaje('✅ Colectivo ingresado correctamente');
      }
      setEditando(false);
      setIdColectivoEditando(null);
      setNroColectivo('');
      setPatente('');
      setModelo('');
      setEstado('Activo');
      setKilometraje('');
      setVtoVTV('');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setMensaje(err.message || (editando ? 'Error al modificar colectivo' : 'Error al crear colectivo'));
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-blue-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl border border-black">
        <h2 className="text-xl font-bold mb-4 text-center">Ingreso de Colectivo</h2>
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
                  disabled={editando}
                />
              </label>
              <label className="font-medium text-black block">Patente
                <input type="text" value={patente} onChange={e => setPatente(e.target.value)} required className="border border-gray-300 rounded-md p-2 w-full mt-1 text-black" disabled={editando} />
              </label>
              <label className="font-medium text-black block">Modelo
                <input type="text" value={modelo} onChange={e => setModelo(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full mt-1 text-black" disabled={editando} />
              </label>
            </div>
            <div className="flex flex-col gap-4 min-w-[220px]">
              <label className="font-medium text-black block">Estado
                <select value={estado} onChange={e => setEstado(e.target.value as any)} className="border border-gray-300 rounded-md p-2 w-full mt-1" disabled={editando}>
                  <option value="Activo">Activo</option>
                  <option value="FueraDeServicio">Fuera de Servicio</option>
                </select>
              </label>
              <label className="font-medium text-black block">Kilometraje
                <input type="number" value={kilometraje} onChange={e => setKilometraje(e.target.value)} min="0" className="border border-gray-300 rounded-md p-2 w-full mt-1 text-black" />
              </label>
              <label className="font-medium text-black block">Vto VTV
                <input type="date" value={vtoVTV} onChange={e => setVtoVTV(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full mt-1 text-black" disabled={editando} />
              </label>
            </div>
          </div>
          <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-md mt-6 self-center w-40 font-medium text-base cursor-pointer border-none" disabled={enviando}>
            Guardar Colectivo
          </button>
        </form>
        {mensaje && (
          <div className={`mt-6 p-4 ${editando ? 'bg-yellow-100 border-yellow-400 text-yellow-800' : 'bg-green-100 border-green-400 text-green-800'} border rounded-lg text-center font-semibold shadow`}>
            <span>{mensaje}</span>
          </div>
        )}
      </div>
    </div>
  );
}
