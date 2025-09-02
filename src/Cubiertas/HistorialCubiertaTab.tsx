import { useEffect, useState } from 'react';
import { listarCubiertas } from '../serviceCubierta/listarCubiertas';
import { obtenerHistorialMontajeCubierta } from '../serviceCubierta/obtenerHistorialMontajeCubierta';
import type { HistorialMontaje } from '../models/HistorialMontaje';


export default function HistorialCubiertaTab() {
  const [cubiertas, setCubiertas] = useState<{ idCubierta: number; nroSerie: string }[]>([]);
  const [selectedSerie, setSelectedSerie] = useState('');
  const [historial, setHistorial] = useState<HistorialMontaje[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [buscado, setBuscado] = useState(false);

  useEffect(() => {
    listarCubiertas().then(data => {
      setCubiertas(data.map((c: any) => ({ idCubierta: c.idCubierta, nroSerie: c.nroSerie })));
    });
  }, []);

  const handleBuscar = async () => {
    setLoading(true);
    setError('');
    setHistorial([]);
    setBuscado(true);
    const cubierta = cubiertas.find(c => c.nroSerie === selectedSerie);
    if (!cubierta) {
      setError('Seleccione un número de serie válido.');
      setLoading(false);
      return;
    }
    try {
      const data = await obtenerHistorialMontajeCubierta(cubierta.idCubierta);
      setHistorial(data);
    } catch (err: any) {
      setError('Error al obtener historial.');
    }
    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen bg-blue-100 flex flex-col items-center justify-center">
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg mb-30">
        <h2 className="text-xl font-bold mb-4 text-black text-center">Historial de Montajes por Cubierta</h2>
        <div className="flex flex-col gap-4 mb-6 items-center">
          <label className="font-medium text-black block">Nro. Serie: 
            <input
              type="text"
              value={selectedSerie}
              onChange={e => setSelectedSerie(e.target.value)}
              list="cubierta-series-list"
              className="border border-gray-300 rounded-md p-2 w-20 mt-1 ml-2 text-black"
            />
            <datalist id="cubierta-series-list">
              {cubiertas.map(c => (
                <option key={c.idCubierta} value={c.nroSerie} />
              ))}
            </datalist>
          </label>
          <button
            onClick={handleBuscar}
            className="bg-blue-600 text-white py-2 px-6 rounded-md mt-2 font-medium text-base cursor-pointer border-none mx-auto"
            style={{ display: 'block' }}
          >Buscar historial</button>
        </div>
        {loading && <div className="p-4">Cargando historial...</div>}
        {error && <div className="p-4 text-red-600">{error}</div>}
        {historial.length > 0 && (
          <table className="w-full border-collapse text-black mt-6">
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
        )}
        {buscado && !loading && !error && historial.length === 0 && selectedSerie && (
          <div className="p-4 text-gray-500 text-center">No hay historial para esta cubierta.</div>
        )}
      </div>
    </div>
  );
}
