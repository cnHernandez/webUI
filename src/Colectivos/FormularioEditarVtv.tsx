import { useState } from 'react';
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
          <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-md font-medium text-base cursor-pointer border-none" disabled={enviando}>
            Guardar
          </button>
        </form>
        {mensaje && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 rounded-lg text-green-800 text-center font-semibold shadow">
            <span>{mensaje}</span>
          </div>
        )}
      </div>
    </div>
  );
}
