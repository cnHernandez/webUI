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
      <h2 className="text-xl font-bold mb-4">Montar/Rotar Cubierta</h2>
      {cubiertaActual && mostrarCartel && !confirmarReemplazo && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 text-center font-medium">
          <div>
            <span>Cubierta actual en este colectivo y ubicación:</span><br />
            <span>Nro. Serie: <b>{cubiertaActual.nroSerieCubierta ?? cubiertaActual.NroSerieCubierta ?? cubiertaActual.NroSerie ?? ''}</b></span>
            {cubiertaActual.estado && <> | <span>Estado: <b>{cubiertaActual.estado}</b></span></>}
          </div>
          <button type="button" className="mt-2 bg-red-700 text-white py-2 px-4 rounded-md font-medium cursor-pointer border-none" onClick={() => setConfirmarReemplazo(true)}>
            Confirmar reemplazo
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-row gap-8 justify-center">
          {/* Columna 1 */}
          <div className="flex flex-col gap-4 min-w-[220px]">
            <label className="font-medium text-black block">Cubierta
              <select value={idCubierta} onChange={e => setIdCubierta(e.target.value)} required className="border border-gray-300 rounded-md p-2 w-full mt-1">
                <option value="">Seleccionar Cubierta</option>
                {cubiertas.map((c, i) => (
                  <option key={c.idCubierta ?? i} value={c.idCubierta}>{c.nroSerie}</option>
                ))}
              </select>
            </label>
            <label className="font-medium text-black block">Colectivo
              <select value={idColectivo} onChange={e => setIdColectivo(e.target.value)} required className="border border-gray-300 rounded-md p-2 w-full mt-1">
                <option value="">Seleccionar Colectivo</option>
                {colectivos.map((c: any, i: number) => (
                  <option key={c.IdColectivo ?? i} value={c.IdColectivo}>{c.NroColectivo}</option>
                ))}
              </select>
            </label>
          </div>
          {/* Columna 2 */}
          <div className="flex flex-col gap-4 min-w-[220px]">
            <label className="font-medium text-black block">Ubicación
              <select value={idUbicacion} onChange={e => setIdUbicacion(e.target.value)} required className="border border-gray-300 rounded-md p-2 w-full mt-1">
                <option value="">Seleccionar Ubicación</option>
                {ubicacionesCubierta.map(u => (
                  <option key={u.IdUbicacion} value={u.IdUbicacion}>{u.Descripcion}</option>
                ))}
              </select>
            </label>
              {cubiertaActual && mostrarCartel && (
                <label className="font-medium text-black block">Motivo de cambio:
                  <input
                      type="text"
                      id="motivoCambio"
                      value={motivoCambio}
                      onChange={e => setMotivoCambio(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  />
                </label>
              )}
          </div>
        </div>
        <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-md mt-6 self-center w-40 font-medium text-base cursor-pointer border-none">Guardar Montaje</button>
      </form>
      {mensaje && <p className={`mt-4 text-base ${mensaje.includes('correctamente') ? 'text-green-600' : 'text-red-600'}`}>{mensaje}</p>}
    </div>
  );
}

export default FormularioMontaje;
