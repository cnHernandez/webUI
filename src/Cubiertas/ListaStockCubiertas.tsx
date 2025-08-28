import { useEffect, useState } from 'react';
import HistorialMontajeCubierta from './HistorialMontajeCubierta';
// import { listarCubiertas } from '../serviceCubierta/listarCubiertas';


const ListaStockCubiertas: React.FC = () => {
  const [cubiertas, setCubiertas] = useState<any[]>([]);
  const [cubiertaHistorialId, setCubiertaHistorialId] = useState<number | null>(null);

  useEffect(() => {
    fetch('http://localhost:5058/api/cubiertas')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        console.log('Cubiertas recibidas:', data);
        setCubiertas(data);
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
    <div style={{ padding: '1rem' }}>
      <h2>Stock de Cubiertas</h2>
  <table style={{ width: '100%', borderCollapse: 'collapse', color: '#000' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem', color: '#000', textAlign: 'center' }}>Nro Serie</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem', color: '#000', textAlign: 'center' }}>Marca</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem', color: '#000', textAlign: 'center' }}>Medida</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem', color: '#000', textAlign: 'center' }}>Estado</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem', color: '#000', textAlign: 'center' }}>Ubicación</th>
          </tr>
        </thead>
        <tbody>
          {cubiertas.map((c, i) => (
            <tr key={c.idCubierta ?? i} style={{ cursor: 'pointer' }} onClick={() => setCubiertaHistorialId(c.idCubierta)}>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem', color: '#000', textAlign: 'center' }}>{c.nroSerie || '-'}</td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem', color: '#000', textAlign: 'center' }}>{c.marca || '-'}</td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem', color: '#000', textAlign: 'center' }}>{c.medida || '-'}</td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem', color: '#000', textAlign: 'center' }}>{c.estadoInfo?.estado || '-'}</td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem', color: '#000', textAlign: 'center' }}>{c.ubicacionDescripcion && c.ubicacionDescripcion.trim() !== '' ? c.ubicacionDescripcion : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaStockCubiertas;
        
