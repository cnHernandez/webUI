import { useState } from 'react';
import { crearCubierta } from '../serviceCubierta/crearCubierta';
import { actualizarEstadoCubierta } from '../serviceCubierta/actualizarEstadoCubierta';


export default function FormularioCubierta() {
  const [nroSerie, setNroSerie] = useState('');
  const [marca, setMarca] = useState('');
  const [medida, setMedida] = useState('');
  const [fechaCompra, setFechaCompra] = useState('');
  const [estado, setEstado] = useState('Nueva');
  const [fechaRecapado, setFechaRecapado] = useState('');
  const [fechaDobleRecapada, setFechaDobleRecapada] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [editando, setEditando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    if (editando) {
      // Actualizar estado en la base de datos
      const result = await actualizarEstadoCubierta(nroSerie, estado, fechaRecapado, fechaDobleRecapada);
      setMensaje(result);
      setNroSerie('');
      setMarca('');
      setMedida('');
      setFechaCompra('');
      setEstado('Nueva');
      setFechaRecapado('');
      setFechaDobleRecapada('');
      setEditando(false);
      return;
    }
    const result = await crearCubierta({
      NroSerie: nroSerie,
      Marca: marca,
      Medida: medida,
      FechaCompra: fechaCompra,
      Estado: estado as any,
      FechaRecapado: estado === 'Recapada' ? fechaRecapado : undefined,
      FechaDobleRecapada: estado === 'DobleRecapada' ? fechaDobleRecapada : undefined,
    });
    setMensaje(result);
    if (result === 'Cubierta guardada correctamente') {
      setNroSerie('');
      setMarca('');
      setMedida('');
      setFechaCompra('');
      setEstado('Nueva');
      setFechaRecapado('');
      setFechaDobleRecapada('');
    }
  };

  // Autocompletar datos si el nroSerie existe
  const handleNroSerieBlur = async () => {
    if (!nroSerie) return;
    try {
      const res = await fetch(`http://localhost:5058/api/cubiertas/nroserie/${nroSerie}`);
      if (res.ok) {
        const cubierta = await res.json();
        if (cubierta) {
          setMarca(cubierta.Marca ?? cubierta.marca ?? '');
          setMedida(cubierta.Medida ?? cubierta.medida ?? '');
          // Formatear fecha a yyyy-MM-dd si viene con hora
          let fecha = cubierta.FechaCompra ?? cubierta.fechaCompra ?? '';
          if (fecha && fecha.includes('T')) {
            fecha = fecha.split('T')[0];
          }
          setFechaCompra(fecha);
          setEstado(cubierta.Estado ?? cubierta.estado ?? 'Nueva');
          setEditando(true);
          setMensaje('Cubierta existente, puedes editar el estado.');
        } else {
          setEditando(false);
        }
      } else {
        setEditando(false);
      }
    } catch {
      setEditando(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem', background: '#fff', borderRadius: '12px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Ingresar Cubierta Nueva</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem', justifyContent: 'center' }}>
          {/* Columna 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '220px' }}>
            <label style={{ fontWeight: '500', color: '#000', display: 'block' }}>Nro. Serie
              <input type="text" value={nroSerie} onChange={e => setNroSerie(e.target.value)} onBlur={handleNroSerieBlur} required style={{ border: '1px solid #ccc', borderRadius: '6px', padding: '0.5rem', width: '100%', marginTop: '0.25rem' }} />
            </label>
            <label style={{ fontWeight: '500', color: '#000', display: 'block' }}>Marca
              <input type="text" value={marca} onChange={e => setMarca(e.target.value)} required style={{ border: '1px solid #ccc', borderRadius: '6px', padding: '0.5rem', width: '100%', marginTop: '0.25rem', color: editando ? '#000' : undefined }} disabled={editando} />
            </label>
            <label style={{ fontWeight: '500', color: '#000', display: 'block' }}>Medida
              <input type="text" value={medida} onChange={e => setMedida(e.target.value)} required style={{ border: '1px solid #ccc', borderRadius: '6px', padding: '0.5rem', width: '100%', marginTop: '0.25rem', color: editando ? '#000' : undefined }} disabled={editando} />
            </label>
          </div>
          {/* Columna 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '220px' }}>
            <label style={{ fontWeight: '500', color: '#000', display: 'block' }}>Fecha de Compra
              <input type="date" value={fechaCompra} onChange={e => setFechaCompra(e.target.value)} required style={{ border: '1px solid #ccc', borderRadius: '6px', padding: '0.5rem', width: '100%', marginTop: '0.25rem', color: editando ? '#000' : undefined }} disabled={editando} />
            </label>
            <label style={{ fontWeight: '500', color: '#000', display: 'block' }}>Estado
              <select value={estado} onChange={e => setEstado(e.target.value)} style={{ border: '1px solid #ccc', borderRadius: '6px', padding: '0.5rem', width: '100%', marginTop: '0.25rem' }}>
                <option value="Nueva">Nueva</option>
                <option value="Recapada">Recapada</option>
                <option value="DobleRecapada">Doble Recapada</option>
              </select>
            </label>
            {estado === 'Recapada' && (
              <label style={{ fontWeight: '500', color: '#000', display: 'block', marginTop: '0rem' }}>Fecha de recapado
                <input type="date" value={fechaRecapado} onChange={e => setFechaRecapado(e.target.value)} required style={{ border: '1px solid #ccc', borderRadius: '6px', padding: '0.5rem', width: '100%', marginTop: '0rem', color: '#fff', background: '#222' }} />
              </label>
            )}
            {estado === 'DobleRecapada' && (
              <label style={{ fontWeight: '500', color: '#000', display: 'block', marginTop: '0rem' }}>Fecha de doble recapada
                <input type="date" value={fechaDobleRecapada} onChange={e => setFechaDobleRecapada(e.target.value)} required style={{ border: '1px solid #ccc', borderRadius: '6px', padding: '0.5rem', width: '100%', marginTop: '0rem', color: '#fff', background: '#222' }} />
              </label>
            )}
          </div>
        </div>
        <button type="submit" style={{ background: '#2563eb', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '6px', marginTop: '1.5rem', alignSelf: 'center', width: '160px', fontWeight: '500', fontSize: '1rem', cursor: 'pointer', border: 'none' }}>{editando ? 'Actualizar Estado' : 'Guardar Cubierta'}</button>
      </form>
      {mensaje && <p style={{ marginTop: '1rem', fontSize: '0.95rem', color: mensaje.includes('correctamente') ? '#16a34a' : '#dc2626' }}>{mensaje}</p>}
    </div>
  );
}
