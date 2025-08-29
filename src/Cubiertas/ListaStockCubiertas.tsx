import { useEffect, useState } from 'react';
import HistorialMontajeCubierta from './HistorialMontajeCubierta';
// import { listarCubiertas } from '../serviceCubierta/listarCubiertas';


const ListaStockCubiertas: React.FC = () => {
  const [cubiertas, setCubiertas] = useState<any[]>([]);
  const [cubiertaHistorialId, setCubiertaHistorialId] = useState<number | null>(null);
  const [colectivosCubierta, setColectivosCubierta] = useState<{ [idCubierta: number]: string }>({});
  // Filtros
  const [filtroLibres, setFiltroLibres] = useState(false);
  const [filtroColectivo, setFiltroColectivo] = useState('');
  // Estado para colectivos desde la base de datos
  const [colectivosBD, setColectivosBD] = useState<{ idColectivo: number; nroColectivo: string }[]>([]);

  // Obtener lista de colectivos desde la base de datos al montar
  useEffect(() => {
    fetch('http://localhost:5058/api/colectivos')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setColectivosBD(Array.isArray(data) ? data : []);
      })
      .catch(() => setColectivosBD([]));
  }, []);
  const [filtroEstado, setFiltroEstado] = useState('');

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

  // Filtrado de cubiertas
  const cubiertasFiltradas = cubiertas.filter((c) => {
    // Filtro 1: Libres (sin ubicación y sin colectivo)
    if (filtroLibres) {
      const sinUbicacion = !c.ubicacionDescripcion || c.ubicacionDescripcion.trim() === '';
      const sinColectivo = !colectivosCubierta[c.idCubierta] || colectivosCubierta[c.idCubierta] === '-';
      if (!(sinUbicacion && sinColectivo)) return false;
    }
    // Filtro 2: Por número de colectivo
    if (filtroColectivo.trim() !== '') {
      if (colectivosCubierta[c.idCubierta] !== filtroColectivo.trim()) return false;
    }
    // Filtro 3: Por estado
    if (filtroEstado !== '') {
      if (!c.estadoInfo || c.estadoInfo.estado !== filtroEstado) return false;
    }
    return true;
  });

  if (cubiertaHistorialId !== null) {
    const handleVolver = () => setCubiertaHistorialId(null);
    return <HistorialMontajeCubierta idCubierta={cubiertaHistorialId} onVolver={handleVolver} />;
  }

  return (
    <div className="w-full bg-blue-100 py-12">
      <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Stock de Cubiertas</h2>
        {/* Filtros */}
        <div className="flex flex-row justify-center gap-16 mb-6 items-center">
          {/* Filtro 1: Libres */}
          <div className="bg-white rounded shadow p-3 flex flex-col items-center min-w-[180px]">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filtroLibres}
                onChange={e => setFiltroLibres(e.target.checked)}
              />
              <span className="font-medium">Libres</span>
            </label>
            <span className="text-xs text-gray-500 mt-1">Sin ubicación y sin colectivo</span>
          </div>
          {/* Filtro 2: Nro Colectivo (select desde BD) */}
          <div className="bg-white rounded shadow p-3 flex flex-col items-center min-w-[180px]">
            <label className="font-medium mb-1">Colectivo</label>
            <select
              value={filtroColectivo}
              onChange={e => setFiltroColectivo(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            >
              <option value="">Todos</option>
              {colectivosBD.map((colectivo) => (
                <option key={String(colectivo.idColectivo)} value={colectivo.nroColectivo}>{colectivo.nroColectivo}</option>
              ))}
            </select>
          </div>
          {/* Filtro 3: Estado */}
          <div className="bg-white rounded shadow p-3 flex flex-col items-center min-w-[180px]">
            <label className="font-medium mb-1">Estado</label>
            <select
              value={filtroEstado}
              onChange={e => setFiltroEstado(e.target.value)}
              className="border rounded px-2 py-1 w-full"
            >
              <option value="">Todos</option>
              <option value="Nueva">Nueva</option>
              <option value="Recapada">Recapada</option>
              <option value="DobleRecapada">Doble Recapada</option>
            </select>
          </div>
        </div>
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
            {cubiertasFiltradas.map((c, i) => (
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
    </div>
  );
};

export default ListaStockCubiertas;
        
