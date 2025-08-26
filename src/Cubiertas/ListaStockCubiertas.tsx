import { useEffect, useState } from 'react';
// import { listarCubiertas } from '../serviceCubierta/listarCubiertas';

export default function ListaStockCubiertas() {
  const [cubiertas, setCubiertas] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5058/api/cubiertas')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        
        setCubiertas(data);
      })
      .catch(() => setCubiertas([]));
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <h3 style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem', color: '#111' }}>Stock de Cubiertas</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
          <thead>
            <tr style={{ background: '#f3f4f6' }}>
              <th style={{ padding: '8px', border: '1px solid #e5e7eb', color: '#111', textAlign: 'center' }}>Nro. Serie</th>
              <th style={{ padding: '8px', border: '1px solid #e5e7eb', color: '#111', textAlign: 'center' }}>Marca</th>
              <th style={{ padding: '8px', border: '1px solid #e5e7eb', color: '#111', textAlign: 'center' }}>Medida</th>
              <th style={{ padding: '8px', border: '1px solid #e5e7eb', color: '#111', textAlign: 'center' }}>Fecha Compra</th>
              <th style={{ padding: '8px', border: '1px solid #e5e7eb', color: '#111', textAlign: 'center' }}>Estado</th>
              <th style={{ padding: '8px', border: '1px solid #e5e7eb', color: '#2563eb', fontWeight: 'bold', textAlign: 'center' }}>Colectivo</th>
              <th style={{ padding: '8px', border: '1px solid #e5e7eb', color: '#111', textAlign: 'center' }}>Ubicación</th>
            </tr>
          </thead>
          <tbody>
            {cubiertas.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: '#888', padding: '24px' }}>No hay cubiertas en stock.</td>
              </tr>
            ) : cubiertas.map((c: any) => (
              <tr key={c.idCubierta} style={{ transition: 'background 0.2s' }}>
                <td style={{ padding: '8px', border: '1px solid #e5e7eb', color: '#111', textAlign: 'center' }}>{c.nroSerie ?? '-'}</td>
                <td style={{ padding: '8px', border: '1px solid #e5e7eb', color: '#111', textAlign: 'center' }}>{c.marca ?? '-'}</td>
                <td style={{ padding: '8px', border: '1px solid #e5e7eb', color: '#111', textAlign: 'center' }}>{c.medida ?? '-'}</td>
                <td style={{ padding: '8px', border: '1px solid #e5e7eb', color: '#111', textAlign: 'center' }}>{c.fechaCompra ? c.fechaCompra.split('T')[0] : '-'}</td>
                <td style={{ padding: '8px', border: '1px solid #e5e7eb', color: '#111', textAlign: 'center' }}>{c.estadoInfo?.estado ?? '-'}</td>
                <td style={{ padding: '8px', border: '1px solid #e5e7eb', color: '#2563eb', fontWeight: 'bold', textAlign: 'center' }}>{(c.idColectivo && c.idColectivo !== 0) ? c.idColectivo : '-'}</td>
                <td style={{ padding: '8px', border: '1px solid #e5e7eb', color: '#111', textAlign: 'center' }}>{(c.ubicacionDescripcion && c.ubicacionDescripcion !== '') ? c.ubicacionDescripcion : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
