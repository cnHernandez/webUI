import React, { useEffect, useState } from 'react';
import { obtenerHistorialMontajeCubierta } from '../serviceCubierta/obtenerHistorialMontajeCubierta';
import type { HistorialMontaje } from '../models/HistorialMontaje';

interface Props {
  idCubierta: number;
  onVolver?: () => void;
}

const HistorialMontajeCubierta: React.FC<Props> = ({ idCubierta, onVolver }) => {
  const [historial, setHistorial] = useState<HistorialMontaje[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  console.log('idCubierta recibido:', idCubierta);

  useEffect(() => {
    setLoading(true);
    obtenerHistorialMontajeCubierta(idCubierta)
      .then(data => {
        console.log('Historial recibido:', data);
        setHistorial(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [idCubierta]);

  if (loading) return <div className="p-4">Cargando historial...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="w-full bg-blue-100 py-12">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-black">Historial de Montajes de Cubierta</h2>
        {onVolver && <button onClick={onVolver} className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md">Volver</button>}
        <table className="w-full border-collapse text-black">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Fecha Montaje</th>
              <th className="border border-gray-300 p-2">Nro Serie</th>
              <th className="border border-gray-300 p-2">Colectivo</th>
              <th className="border border-gray-300 p-2">Ubicación</th>
              <th className="border border-gray-300 p-2">Fecha Desinstalación</th>
              <th className="border border-gray-300 p-2">Motivo Cambio</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((h, i) => (
              <tr key={i}>
                <td className="border border-gray-300 p-2 text-center">{h.fechaMontaje ? new Date(h.fechaMontaje).toLocaleString() : '-'}</td>
                <td className="border border-gray-300 p-2 text-center">{h.nroSerieCubierta || '-'}</td>
                <td className="border border-gray-300 p-2 text-center">{h.nroColectivo || '-'}</td>
                <td className="border border-gray-300 p-2 text-center">{h.descripcionUbicacion || '-'}</td>
                <td className="border border-gray-300 p-2 text-center">{h.fechaDesinstalacion ? new Date(h.fechaDesinstalacion).toLocaleString() : '-'}</td>
                <td className="border border-gray-300 p-2 text-center">{h.motivoCambio || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistorialMontajeCubierta;
