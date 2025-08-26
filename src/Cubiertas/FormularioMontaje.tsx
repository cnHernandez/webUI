import { useState, useEffect } from 'react';
import { ubicacionesCubierta } from '../serviceCubierta/listarUbicaciones';
import { listarColectivos } from '../serviceCubierta/listarColectivos';
import { listarCubiertas } from '../serviceCubierta/listarCubiertas';

function FormularioMontaje() {
  const [cubiertaActual, setCubiertaActual] = useState<any|null>(null);
  const [mostrarCartel, setMostrarCartel] = useState(false);
  const [confirmarReemplazo, setConfirmarReemplazo] = useState(false);
  const [idCubierta, setIdCubierta] = useState('');
  const [idColectivo, setIdColectivo] = useState('');
  const [idUbicacion, setIdUbicacion] = useState('');
  const [motivoCambio, setMotivoCambio] = useState('');
  const [colectivos, setColectivos] = useState<any[]>([]);
  const [cubiertas, setCubiertas] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    listarColectivos().then((data) => setColectivos(data));
    listarCubiertas().then((data) => {
      setCubiertas(data);
    });
  }, []);

  // Consultar montaje actual cuando cambian colectivo y ubicación
  useEffect(() => {
    if (idColectivo && idUbicacion) {
      fetch(`http://localhost:5058/api/montajes/actual/${idColectivo}/${idUbicacion}`)
    .then(async (res) => {
      // El backend responde 200 OK con null si no hay montaje
      if (!res.ok) {
        setCubiertaActual(null);
        return null;
      }
      const contentType = res.headers.get('content-type');
      const contentLength = res.headers.get('content-length');
      if (!contentType?.includes('application/json') || contentLength === '0') {
        setCubiertaActual(null);
        return null;
      }
      const text = await res.text();
      if (!text) {
        setCubiertaActual(null);
        return null;
      }
      const data = JSON.parse(text);
      if (!data) {
        setCubiertaActual(null);
        return null;
      }
      setCubiertaActual(data);
      return data;
    })
        .then((data: any) => {
          setCubiertaActual(data);
          if (data && typeof data === 'object' && data.idCubierta !== undefined) {
            setMostrarCartel(String(data.idCubierta) !== idCubierta);
          } else {
            setMostrarCartel(false);
          }
          setConfirmarReemplazo(false);
        });
    } else {
      setCubiertaActual(null);
      setMostrarCartel(false);
      setConfirmarReemplazo(false);
    }
  }, [idColectivo, idUbicacion, idCubierta]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    // Si hay cubierta actual y no se confirmó el reemplazo, mostrar cartel y no guardar
    if (cubiertaActual && mostrarCartel && !confirmarReemplazo) {
      setMensaje('Ya existe una cubierta en ese colectivo y ubicación. Confirma el reemplazo.');
      return;
    }
    // Enviar DTO al backend
    const dto = {
      IdCubierta: Number(idCubierta),
      IdColectivo: Number(idColectivo),
      IdUbicacion: Number(idUbicacion),
      MotivoCambio: motivoCambio
    };
    const res = await fetch('http://localhost:5058/api/montajes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto)
    });
    const result = await res.text();
    setMensaje(result);
    if (result === 'Montaje guardado correctamente') {
      setIdCubierta('');
      setIdColectivo('');
      setIdUbicacion('');
      setMotivoCambio('');
      setCubiertaActual(null);
      setMostrarCartel(false);
      setConfirmarReemplazo(false);
            setIdColectivo('0');
            setIdUbicacion('0');
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Montar/Rotar Cubierta</h2>
      {cubiertaActual && mostrarCartel && !confirmarReemplazo && (
        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center', fontWeight: '500' }}>
          <div>
            <span>Cubierta actual en este colectivo y ubicación:</span><br />
            <span>Nro. Serie: <b>{cubiertaActual.nroSerieCubierta ?? cubiertaActual.NroSerieCubierta ?? cubiertaActual.NroSerie ?? ''}</b></span>
            {cubiertaActual.estado && <> | <span>Estado: <b>{cubiertaActual.estado}</b></span></>}
          </div>
          <button type="button" style={{ marginTop: '0.5rem', background: '#b91c1c', color: 'white', padding: '0.4rem 1rem', borderRadius: '6px', border: 'none', fontWeight: '500', cursor: 'pointer' }} onClick={() => setConfirmarReemplazo(true)}>
            Confirmar reemplazo
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem', justifyContent: 'center' }}>
          {/* Columna 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '220px' }}>
            <label style={{ fontWeight: '500', color: '#000', display: 'block' }}>Cubierta
              <select value={idCubierta} onChange={e => setIdCubierta(e.target.value)} required style={{ border: '1px solid #ccc', borderRadius: '6px', padding: '0.5rem', width: '100%', marginTop: '0.25rem' }}>
                <option value="">Seleccionar Cubierta</option>
                {cubiertas.map((c, i) => (
                  <option key={c.idCubierta ?? i} value={c.idCubierta}>{c.nroSerie}</option>
                ))}
              </select>
            </label>
            <label style={{ fontWeight: '500', color: '#000', display: 'block' }}>Colectivo
              <select value={idColectivo} onChange={e => setIdColectivo(e.target.value)} required style={{ border: '1px solid #ccc', borderRadius: '6px', padding: '0.5rem', width: '100%', marginTop: '0.25rem' }}>
                <option value="">Seleccionar Colectivo</option>
                {colectivos.map((c: any, i: number) => (
                  <option key={c.IdColectivo ?? i} value={c.IdColectivo}>{c.NroColectivo}</option>
                ))}
              </select>
            </label>
          </div>
          {/* Columna 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minWidth: '220px' }}>
            <label style={{ fontWeight: '500', color: '#000', display: 'block' }}>Ubicación
              <select value={idUbicacion} onChange={e => setIdUbicacion(e.target.value)} required style={{ border: '1px solid #ccc', borderRadius: '6px', padding: '0.5rem', width: '100%', marginTop: '0.25rem' }}>
                <option value="">Seleccionar Ubicación</option>
                {ubicacionesCubierta.map(u => (
                  <option key={u.IdUbicacion} value={u.IdUbicacion}>{u.Descripcion}</option>
                ))}
              </select>
            </label>
              {cubiertaActual && mostrarCartel && (
                <label style={{ fontWeight: '500', color: '#000', display: 'block' }}>Motivo de cambio:
                  <input
                      type="text"
                      id="motivoCambio"
                      value={motivoCambio}
                      onChange={e => setMotivoCambio(e.target.value)}
                      style={{ width: '100%', border: '1px solid #ccc', borderRadius: '6px', padding: '0.5rem', marginTop: '0.25rem' }}
                  />
                </label>
              )}
          </div>
        </div>
        <button type="submit" style={{ background: '#2563eb', color: 'white', padding: '0.5rem 1.5rem', borderRadius: '6px', marginTop: '1.5rem', alignSelf: 'center', width: '160px', fontWeight: '500', fontSize: '1rem', cursor: 'pointer', border: 'none' }}>Guardar Montaje</button>
      </form>
      {mensaje && <p style={{ marginTop: '1rem', fontSize: '0.95rem', color: mensaje.includes('correctamente') ? '#16a34a' : '#dc2626' }}>{mensaje}</p>}
    </div>
  );
}

export default FormularioMontaje;
