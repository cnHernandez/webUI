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

  if (loading) return <div>Cargando historial...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ color: '#000' }}>Historial de Montajes de Cubierta</h2>
      {onVolver && <button onClick={onVolver} style={{ marginBottom: '1rem' }}>Volver</button>}
      <table style={{ width: '100%', borderCollapse: 'collapse', color: '#000' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem', color: '#000' }}>Fecha Montaje</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem', color: '#000' }}>Nro Serie</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem', color: '#000' }}>Colectivo</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem', color: '#000' }}>Ubicación</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem', color: '#000' }}>Fecha Desinstalación</th>
            <th style={{ border: '1px solid #ccc', padding: '0.5rem', color: '#000' }}>Motivo Cambio</th>
          </tr>
        </thead>
        <tbody>
          {historial.map((h, i) => (
            <tr key={i}>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem', color: '#000', textAlign: 'center' }}>{h.fechaMontaje ? new Date(h.fechaMontaje).toLocaleString() : '-'}</td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem', color: '#000', textAlign: 'center' }}>{h.nroSerieCubierta || '-'}</td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem', color: '#000', textAlign: 'center' }}>{h.nroColectivo || '-'}</td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem', color: '#000', textAlign: 'center' }}>{h.descripcionUbicacion || '-'}</td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem', color: '#000', textAlign: 'center' }}>{h.fechaDesinstalacion ? new Date(h.fechaDesinstalacion).toLocaleString() : '-'}</td>
              <td style={{ border: '1px solid #ccc', padding: '0.5rem', color: '#000', textAlign: 'center' }}>{h.motivoCambio || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistorialMontajeCubierta;
