import { useState, useEffect } from 'react';
import { ubicacionesCubierta } from '../serviceCubierta/listarUbicaciones';
import { listarColectivos } from '../serviceCubierta/listarColectivos';
import { listarCubiertas } from '../serviceCubierta/listarCubiertas';
import { consultarMontajeActual } from '../serviceCubierta/consultarMontajeActual';

function FormularioMontaje() {
  const [cubiertaActual, setCubiertaActual] = useState<any|null>(null);
  const [cubiertaEnReparacion, setCubiertaEnReparacion] = useState(false);
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
  }, [idCubierta, cubiertas]);

  // Verificar si la cubierta seleccionada está en reparación
  useEffect(() => {
    if (idCubierta) {
      // Buscar por nroSerie, que es lo que se ingresa en el input
      const cubierta = cubiertas.find(c => String(c.nroSerie) === String(idCubierta));
      if (cubierta) {
        const estado = cubierta.estadoInfo?.estado || cubierta.EstadoInfo?.Estado || cubierta.estado || cubierta.Estado;
        if (typeof estado === 'string' && estado.toLowerCase().replace(/\s/g, '') === 'enreparacion') {
          setCubiertaEnReparacion(true);
          setMensaje('La cubierta seleccionada está en reparación y no puede ser montada.');
        } else {
          setCubiertaEnReparacion(false);
          setMensaje('');
        }
      } else {
        setCubiertaEnReparacion(false);
        setMensaje('');
      }
    } else {
      setCubiertaEnReparacion(false);
      setMensaje('');
    }
  }, [idCubierta, cubiertas]);

  // Consultar montaje actual cuando cambian colectivo y ubicación
  useEffect(() => {
    // Buscar el id interno del colectivo seleccionado
    const colectivoObj = colectivos.find(c => String(c.NroColectivo) === String(idColectivo));
    const idColectivoInterno = colectivoObj?.IdColectivo;
    // idUbicacion ya debería ser el id interno si el select lo maneja bien
    const idUbicacionInterno = idUbicacion;
    if (idColectivoInterno && idUbicacionInterno) {
     
      consultarMontajeActual(Number(idColectivoInterno), Number(idUbicacionInterno)).then((data: any) => {
       
        setCubiertaActual(data);
        const nroSerieActual = data?.nroSerieCubierta ?? data?.NroSerieCubierta ?? data?.NroSerie ?? '';
     
        if (nroSerieActual && String(nroSerieActual) !== String(idCubierta)) {
          setMostrarCartel(true);
        } else {
          setMostrarCartel(false);
        }
          // Solo resetear confirmarReemplazo si aún no está confirmado
          setConfirmarReemplazo(prev => prev ? true : false);
      });
    } else {
      setCubiertaActual(null);
      setMostrarCartel(false);
      setConfirmarReemplazo(false);
    }
  }, [idColectivo, idUbicacion, idCubierta, colectivos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    // Validación de IDs
    if (!idCubierta || !idColectivo || !idUbicacion) {
      setMensaje('Debes seleccionar cubierta, colectivo y ubicación válidos.');
      return;
    }
    // Validar que la cubierta existe en la lista
    const cubierta = cubiertas.find(c => String(c.nroSerie) === String(idCubierta));
    if (!cubierta) {
      setMensaje('La cubierta seleccionada no existe.');
      return;
    }
    // Validar que el colectivo existe en la lista
    const colectivo = colectivos.find(c => String(c.NroColectivo) === String(idColectivo));
    if (!colectivo) {
      setMensaje('El colectivo seleccionado no existe.');
      return;
    }
    // Si hay cubierta actual y no se confirmó el reemplazo, mostrar cartel y no guardar
    if (cubiertaEnReparacion) {
      setMensaje('La cubierta seleccionada está en reparación y no puede ser montada.');
      return;
    }
    if (cubiertaActual && mostrarCartel && !confirmarReemplazo) {
      setMensaje('Ya existe una cubierta en ese colectivo y ubicación. Confirma el reemplazo.');
      return;
    }
    // Enviar DTO al backend
    const dto = {
      IdCubierta: cubierta.idCubierta ?? cubierta.IdCubierta,
      IdColectivo: colectivo.IdColectivo,
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
    <div className="w-full min-h-screen bg-blue-100 flex flex-col items-center justify-center">
      <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Montar/Rotar Cubierta</h2>
        {cubiertaEnReparacion && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 text-center font-medium">
            <span>La cubierta seleccionada está en reparación y no puede ser montada.</span>
          </div>
        )}
        {cubiertaActual && mostrarCartel && !confirmarReemplazo && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 text-center font-medium">
            <div>
              <span>Cubierta actual en este colectivo y ubicación:</span><br />
              <span>Nro. Serie: <b>{cubiertaActual.nroSerieCubierta ?? cubiertaActual.NroSerieCubierta ?? cubiertaActual.NroSerie ?? ''}</b></span>
              {cubiertaActual.estado && <> | <span>Estado: <b>{cubiertaActual.estado}</b></span></>}
            </div>
            <button
              type="button"
              className="mt-2 bg-red-700 text-white py-2 px-4 rounded-md font-medium cursor-pointer border-none"
              onClick={() => {
                setConfirmarReemplazo(true);
              }}
            >
              Confirmar reemplazo
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-row gap-8 justify-center">
            {/* Columna 1 */}
            <div className="flex flex-col gap-4 min-w-[220px]">
              <label className="font-medium text-black block">Cubierta
                <input
                  type="text"
                  value={idCubierta}
                  onChange={e => setIdCubierta(e.target.value)}
                  required
                  className="border border-gray-300 rounded-md p-2 w-full mt-1"
                  list="cubierta-list"
                  placeholder="Filtrar por nro cubierta..."
                />
                <datalist id="cubierta-list">
                  {cubiertas.map((c, i) => (
                    <option key={c.idCubierta ?? i} value={c.nroSerie} />
                  ))}
                </datalist>
              </label>
              <label className="font-medium text-black block">Colectivo
                <input
                  type="text"
                  value={idColectivo}
                  onChange={e => setIdColectivo(e.target.value)}
                  required
                  className="border border-gray-300 rounded-md p-2 w-full mt-1"
                  list="colectivo-list"
                  placeholder="Filtrar por colectivo..."
                />
                <datalist id="colectivo-list">
                  {colectivos.map((c: any, i: number) => (
                    <option key={c.IdColectivo ?? i} value={c.NroColectivo} />
                  ))}
                </datalist>
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
                        list="motivo-cambio-list"
                        placeholder="Seleccionar motivo..."
                    />
                    <datalist id="motivo-cambio-list">
                      <option value="PINCHADO" />
                      <option value="MAL DESGASTE" />
                      <option value="DESGASTE" />
                      <option value="RUPTURA" />
                    </datalist>
                  </label>
                )}
            </div>
          </div>
    <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-md mt-6 self-center w-40 font-medium text-base cursor-pointer border-none" disabled={cubiertaEnReparacion}>Guardar Montaje</button>
        </form>
        {/* Solo mostrar el mensaje si no es el de reparación, para evitar duplicidad de cartel */}
        {mensaje && !cubiertaEnReparacion && (
          <p className={`mt-4 text-base ${mensaje.includes('correctamente') ? 'text-green-600' : 'text-red-600'}`}>{mensaje}</p>
        )}
      </div>
    </div>
  );
}

export default FormularioMontaje;
