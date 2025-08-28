import { useEffect, useState } from 'react';
import HistorialMontajeCubierta from './HistorialMontajeCubierta';
// import { listarCubiertas } from '../serviceCubierta/listarCubiertas';


const ListaStockCubiertas: React.FC = () => {
  const [cubiertas, setCubiertas] = useState<any[]>([]);
  const [cubiertaHistorialId, setCubiertaHistorialId] = useState<number | null>(null);
  const [colectivosCubierta, setColectivosCubierta] = useState<{ [idCubierta: number]: string }>({});

  useEffect(() => {
    fetch('http://localhost:5058/api/cubiertas')
      .then(res => res.ok ? res.json() : [])
      .then(async (data) => {
        setCubiertas(data);
        // Consultar colectivo actual para cada cubierta usando historial
        const colectivos: { [idCubierta: number]: string } = {};
        await Promise.all(
          data.map(async (cubierta: any) => {
            try {
              const res = await fetch(`http://localhost:5058/api/montajes/historialcubierta/${cubierta.idCubierta}`);
              if (res.ok) {
                const historial = await res.json();
                // El primer elemento es el más reciente
                if (Array.isArray(historial) && historial.length > 0) {
                  const actual = historial[0];
                  // Si no tiene fecha de desinstalación, está montada
                  colectivos[cubierta.idCubierta] = actual.fechaDesinstalacion == null ? (actual.nroColectivo || '-') : '-';
                } else {
                  colectivos[cubierta.idCubierta] = '-';
                }
              } else if (res.status === 404) {
                // No hay historial, no mostrar error
                colectivos[cubierta.idCubierta] = '-';
              } else {
                colectivos[cubierta.idCubierta] = '-';
              }
            } catch (err) {
              colectivos[cubierta.idCubierta] = '-';
            }
          })
        );
        setColectivosCubierta(colectivos);
      })
      .catch((err) => {
        console.error('Error al obtener cubiertas:', err);
        setCubiertas([]);
      });
  }, []);

  if (cubiertaHistorialId !== null) {
    const handleVolver = () => setCubiertaHistorialId(null);
    return <HistorialMontajeCubierta idCubierta={cubiertaHistorialId} onVolver={handleVolver} />;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Stock de Cubiertas</h2>
      <table className="w-full border-collapse text-black">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2 text-center">Nro Serie</th>
            <th className="border border-gray-300 p-2 text-center">Marca</th>
            <th className="border border-gray-300 p-2 text-center">Medida</th>
            <th className="border border-gray-300 p-2 text-center">Estado</th>
            <th className="border border-gray-300 p-2 text-center">Colectivo</th>
            <th className="border border-gray-300 p-2 text-center">Ubicación</th>
          </tr>
        </thead>
        <tbody>
          {cubiertas.map((c, i) => (
            <tr key={c.idCubierta ?? i} className="cursor-pointer hover:bg-blue-50" onClick={() => setCubiertaHistorialId(c.idCubierta)}>
              <td className="border border-gray-300 p-2 text-center">{c.nroSerie || '-'}</td>
              <td className="border border-gray-300 p-2 text-center">{c.marca || '-'}</td>
              <td className="border border-gray-300 p-2 text-center">{c.medida || '-'}</td>
              <td className="border border-gray-300 p-2 text-center">{c.estadoInfo?.estado || '-'}</td>
              <td className="border border-gray-300 p-2 text-center">{colectivosCubierta[c.idCubierta] || '-'}</td>
              <td className="border border-gray-300 p-2 text-center">{c.ubicacionDescripcion && c.ubicacionDescripcion.trim() !== '' ? c.ubicacionDescripcion : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaStockCubiertas;
        
