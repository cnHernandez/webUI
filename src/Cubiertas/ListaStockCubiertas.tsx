import { useEffect, useState } from 'react';
import HistorialMontajeCubierta from './HistorialMontajeCubiertas';
import PerfilCubierta from './PerfilCubierta';
import { traducirEstadoCubierta } from '../models/Cubierta';
import { listarCubiertas } from '../serviceCubierta/listarCubiertas';
import { obtenerHistorialMontajeCubierta } from '../serviceCubierta/obtenerHistorialMontajeCubierta';
import { listarColectivos } from '../serviceCubierta/listarColectivos';


const ListaStockCubiertas: React.FC = () => {
  const [filtroEstado, setFiltroEstado] = useState('');
  const [cubiertas, setCubiertas] = useState<any[]>([]);
  const [cubiertaHistorialId, setCubiertaHistorialId] = useState<number | null>(null);
  const [cubiertaPerfilSerie, setCubiertaPerfilSerie] = useState<string | null>(null);
  const [colectivosCubierta, setColectivosCubierta] = useState<{ [idCubierta: number]: string }>({});
  // Filtros
  const [filtroLibres, setFiltroLibres] = useState(false);
  const [inputColectivo, setInputColectivo] = useState('');
  const [inputNroCubierta, setInputNroCubierta] = useState('');
  // Estado para colectivos desde la base de datos
  const [colectivosBD, setColectivosBD] = useState<{ idColectivo: number; nroColectivo: string }[]>([]);

  // Obtener lista de colectivos desde la base de datos al montar
  useEffect(() => {
    listarColectivos()
      .then(data => {
        // Adaptar para el filtro: idColectivo y nroColectivo
        setColectivosBD(data.map(c => ({
          idColectivo: c.IdColectivo,
          nroColectivo: c.NroColectivo
        })));
      })
      .catch(() => setColectivosBD([]));
  }, []);

  useEffect(() => {
    // Usar el service listarCubiertas
    listarCubiertas()
      .then(async (data) => {
        setCubiertas(data);
        // Consultar colectivo actual para cada cubierta usando el service
        const colectivos: { [idCubierta: number]: string } = {};
        await Promise.all(
          data.map(async (cubierta: any) => {
            try {
              const historial = await obtenerHistorialMontajeCubierta(cubierta.idCubierta);
              // El primer elemento es el más reciente
              if (Array.isArray(historial) && historial.length > 0) {
                const actual = historial[0];
                // Si no tiene fecha de desinstalación, está montada
                colectivos[cubierta.idCubierta] = actual.fechaDesinstalacion == null ? (actual.nroColectivo || '-') : '-';
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
    // Filtro 2: Por número de colectivo (solo input)
    if (inputColectivo.trim() !== '') {
      if (!colectivosCubierta[c.idCubierta] || !colectivosCubierta[c.idCubierta].toLowerCase().includes(inputColectivo.trim().toLowerCase())) return false;
    }
    // Filtro 3: Por número de cubierta (solo input)
    if (inputNroCubierta.trim() !== '') {
      if (!c.nroSerie || !c.nroSerie.toLowerCase().includes(inputNroCubierta.trim().toLowerCase())) return false;
    }
    // Filtro 4: Por estado (solo select)
    if (filtroEstado !== '') {
      if (!c.estadoInfo || c.estadoInfo.estado !== filtroEstado) return false;
    }
    return true;
  });


  if (cubiertaPerfilSerie !== null) {
    const handleVolver = () => {
      setCubiertaPerfilSerie(null);
      // Recargar cubiertas al volver del perfil
      listarCubiertas()
        .then(async (data) => {
          setCubiertas(data);
          const colectivos: { [idCubierta: number]: string } = {};
          await Promise.all(
            data.map(async (cubierta: any) => {
              try {
                const historial = await obtenerHistorialMontajeCubierta(cubierta.idCubierta);
                if (Array.isArray(historial) && historial.length > 0) {
                  const actual = historial[0];
                  colectivos[cubierta.idCubierta] = actual.fechaDesinstalacion == null ? (actual.nroColectivo || '-') : '-';
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
        .catch(() => setCubiertas([]));
    };
    return <PerfilCubierta nroSerie={cubiertaPerfilSerie} onVolver={handleVolver} />;
  }

  if (cubiertaHistorialId !== null) {
    const handleVolver = () => setCubiertaHistorialId(null);
    return <HistorialMontajeCubierta idCubierta={cubiertaHistorialId} onVolver={handleVolver} />;
  }

  return (
    <div className="w-full bg-blue-100 py-12">
      <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Stock de Cubiertas</h2>
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
          {/* Filtro 2: Nro Colectivo (solo input) */}
          <div className="bg-white rounded shadow p-3 flex flex-col items-center min-w-[180px]">
            <label className="font-medium mb-1">Nro Colectivo</label>
            <input
              type="text"
              value={inputColectivo}
              onChange={e => setInputColectivo(e.target.value)}
              placeholder="Filtrar por colectivo..."
              className="border rounded px-2 py-1 w-full"
              list="colectivo-list"
            />
            <datalist id="colectivo-list">
              {colectivosBD.map((colectivo) => (
                <option key={String(colectivo.idColectivo)} value={colectivo.nroColectivo} />
              ))}
            </datalist>
          </div>
          {/* Filtro 3: Nro Cubierta (solo input) */}
          <div className="bg-white rounded shadow p-3 flex flex-col items-center min-w-[180px]">
            <label className="font-medium mb-1">Nro Cubierta</label>
            <input
              type="text"
              value={inputNroCubierta}
              onChange={e => setInputNroCubierta(e.target.value)}
              placeholder="Filtrar por nro cubierta..."
              className="border rounded px-2 py-1 w-full"
              list="cubierta-list"
            />
            <datalist id="cubierta-list">
              {cubiertas.map((cubierta) => (
                <option key={String(cubierta.idCubierta)} value={cubierta.nroSerie} />
              ))}
            </datalist>
          </div>
          {/* Filtro 4: Estado (solo select) */}
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
              <option value="TripleRecapada">Triple Recapada</option>
              <option value="EnReparacion">En Reparación</option>
              <option value="Emparchada">Emparchada</option>
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
            {cubiertasFiltradas.map((c, i) => {
              // Determinar color de fila
              const estado = c.estadoInfo?.estado;
              const colectivo = colectivosCubierta[c.idCubierta] || '-';
              const ubicacion = c.ubicacionDescripcion && c.ubicacionDescripcion.trim() !== '';
              let rowClass = '';
              // Rojo: en reparación
              if (
                estado === 'EnReparacion' || estado === 'En Reparación' || estado === 'enReparacion' || estado === 'en reparacion'
              ) {
                rowClass = 'bg-red-500';
              } else if ((colectivo === '-' || colectivo === '' || colectivo == null) && !ubicacion) {
                // Verde: libre
                rowClass = 'bg-green-500';
              } else if (colectivo !== '-' && colectivo !== '' && colectivo != null && ubicacion) {
                // Azul: montada
                rowClass = 'bg-blue-500';
              }
              return (
                <tr key={c.idCubierta ?? i} className={`cursor-pointer ${rowClass}`}
                  onClick={() => setCubiertaPerfilSerie(c.nroSerie)}>
                  <td className="border border-gray-300 p-2 text-center">{c.nroSerie || '-'}</td>
                  <td className="border border-gray-300 p-2 text-center">{c.marca || '-'}</td>
                  <td className="border border-gray-300 p-2 text-center">{c.medida || '-'}</td>
                  <td className="border border-gray-300 p-2 text-center">{traducirEstadoCubierta(c.estadoInfo?.estado)}</td>
                  <td className="border border-gray-300 p-2 text-center">{colectivo}</td>
                  <td className="border border-gray-300 p-2 text-center">{ubicacion ? c.ubicacionDescripcion : '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaStockCubiertas;
        
