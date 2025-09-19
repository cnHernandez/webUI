import { useState } from 'react';
import { eliminarColectivo } from '../serviceColectivo/eliminarColectivo';
import type { Colectivo } from '../models/Colectivo';

interface Props {
  colectivo: Colectivo;
  onClose: () => void;
  onSave: (fechaVto: string) => Promise<void>;
}

export default function FormularioEditarVtv({ colectivo, onClose, onSave }: Props) {
  const [fechaVto, setFechaVto] = useState(colectivo.VtoVTV ? colectivo.VtoVTV.slice(0, 10) : '');
  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [bajaLoading, setBajaLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setMensaje('');
    try {
      await onSave(fechaVto);
      setMensaje('✅ Fecha de VTV actualizada');
      setTimeout(() => {
        setMensaje('');
        onClose();
      }, 1200);
    } catch (err: any) {
      setMensaje(err.message || 'Error al actualizar');
    } finally {
      setEnviando(false);
    }
  };

  return (
  <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
  <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md relative" style={{ border: '0.5px solid black' }}>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">✕</button>
        <h2 className="text-xl font-bold mb-4 text-center">
          Editar vencimiento VTV del coche: <span className="text-blue-700">{colectivo.NroColectivo}</span>
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <label className="font-medium text-black block">Fecha de Vto VTV
            <input
              type="date"
              value={fechaVto}
              onChange={e => setFechaVto(e.target.value)}
              required
              className="border border-gray-300 rounded-md p-2 w-full mt-1 text-black"
            />
          </label>
          <div className="flex gap-4 justify-center">
            <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-md font-medium text-base cursor-pointer border-none" disabled={enviando}>
              Guardar
            </button>
            <button
              type="button"
              className="bg-red-600 text-white py-2 px-6 rounded-md font-medium text-base cursor-pointer border-none"
              onClick={() => setShowConfirm(true)}
              disabled={enviando || bajaLoading}
            >
              Dar de baja
            </button>
          </div>
        </form>
        {/* Modal de confirmación para dar de baja */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
              <h3 className="text-lg font-bold mb-2 text-red-700">Confirmar baja de colectivo</h3>
              <p className="mb-4 text-gray-700">¿Está seguro que desea dar de baja el colectivo <span className="font-semibold">{colectivo.NroColectivo}</span>?</p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  onClick={async () => {
                    setBajaLoading(true);
                    const ok = await eliminarColectivo(colectivo.IdColectivo);
                    setBajaLoading(false);
                    setShowConfirm(false);
                    if (ok) onClose();
                  }}
                  disabled={bajaLoading}
                >
                  Confirmar Baja
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                  onClick={() => setShowConfirm(false)}
                  disabled={bajaLoading}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
        {mensaje && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded-lg text-green-800 text-center font-semibold shadow">
            <span>{mensaje}</span>
          </div>
        )}
      </div>
    </div>
  );
}
