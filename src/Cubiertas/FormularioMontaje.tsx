import { useState, useEffect } from 'react';
import { crearMontaje } from '../serviceCubierta/crearMontaje';
import { ubicacionesCubierta } from '../serviceCubierta/listarUbicaciones';
import { listarColectivos } from '../serviceCubierta/listarColectivos';
import { listarCubiertas } from '../serviceCubierta/listarCubiertas';
import { consultarMontajeActual } from '../serviceCubierta/consultarMontajeActual';

function FormularioMontaje() {
  // ...existing code...
  // Estado para mostrar info de montaje si la cubierta está montada
  const [cubiertaMontadaInfo, setCubiertaMontadaInfo] = useState<{ nroColectivo: string, descripcionUbicacion: string } | null>(null);
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
  // Determinar si la cubierta seleccionada está montada en otro colectivo/ubicación (debe ir después de declarar los estados)
  let cubiertaSeleccionada: any = null;
  let cubiertaMontadaEnOtroLugar = false;
  if (cubiertas && idCubierta) {
    cubiertaSeleccionada = cubiertas.find(c => String(c.nroSerie) === String(idCubierta));
    if (cubiertaSeleccionada && cubiertaSeleccionada.idColectivo && cubiertaSeleccionada.idUbicacion) {
      cubiertaMontadaEnOtroLugar = (String(cubiertaSeleccionada.idColectivo) !== String(idColectivo) || String(cubiertaSeleccionada.idUbicacion) !== String(idUbicacion));
    }
  }
  // Controla visibilidad del mensaje de éxito
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  useEffect(() => {
    listarColectivos().then((data) => setColectivos(data));
    listarCubiertas().then((data) => {
      setCubiertas(data);
    });
  }, []); // Solo al montar

  // Verificar si la cubierta seleccionada está en reparación
  useEffect(() => {
    if (idCubierta) {
      const cubierta = cubiertas.find(c => String(c.nroSerie) === String(idCubierta));
      if (cubierta) {
        // Verificar si la cubierta está montada en algún colectivo y ubicación
        if ((cubierta.idColectivo && cubierta.idColectivo !== 0) && (cubierta.idUbicacion && cubierta.idUbicacion !== 0)) {
          // Buscar nroColectivo y descripcionUbicacion
          const colectivoObj = colectivos.find(c => c.IdColectivo === cubierta.idColectivo);
          const nroColectivo = colectivoObj ? colectivoObj.NroColectivo : cubierta.idColectivo;
          const ubicacionObj = ubicacionesCubierta.find(u => u.IdUbicacion === cubierta.idUbicacion);
          const descripcionUbicacion = ubicacionObj ? ubicacionObj.Descripcion : cubierta.idUbicacion;
          setCubiertaMontadaInfo({ nroColectivo: String(nroColectivo), descripcionUbicacion: String(descripcionUbicacion) });
          setMensaje('');
        } else {
          setCubiertaMontadaInfo(null);
          setMensaje('');
        }
        const estado = cubierta.estadoInfo?.estado || cubierta.EstadoInfo?.Estado || cubierta.estado || cubierta.Estado;
        if (typeof estado === 'string' && estado.toLowerCase().replace(/\s/g, '') === 'enreparacion') {
          setCubiertaEnReparacion(true);
          setMensaje('La cubierta seleccionada está en reparación y no puede ser montada.');
        } else {
          setCubiertaEnReparacion(false);
        }
      } else {
        setCubiertaMontadaInfo(null);
        setCubiertaEnReparacion(false);
        setMensaje('');
      }
    } else {
      setCubiertaMontadaInfo(null);
      setCubiertaEnReparacion(false);
      setMensaje('');
    }
  }, [idCubierta, cubiertas]);

  // Consultar montaje actual cuando cambian colectivo y ubicación
  useEffect(() => {
    if (idColectivo && idUbicacion) {
      // Buscar el colectivo por NroColectivo y obtener su IdColectivo
      const colectivoObj = colectivos.find(c => String(c.NroColectivo) === String(idColectivo));
      const idColectivoReal = colectivoObj ? colectivoObj.IdColectivo : idColectivo;
      consultarMontajeActual(Number(idColectivoReal), Number(idUbicacion)).then((data: any) => {
        // Si la cubierta actual está desinstalada, no mostrar cartel
        if (data && typeof data === 'object' && data.idCubierta !== undefined && !data.fechaDesinstalacion) {
          setCubiertaActual(data);
          setMostrarCartel(String(data.idCubierta) !== idCubierta);
        } else {
          setCubiertaActual(null);
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
  setMostrarMensaje(false);
  // Si se está reemplazando una cubierta, el motivo es obligatorio
  if ((cubiertaActual && mostrarCartel && confirmarReemplazo && !motivoCambio.trim()) ||
      (cubiertaMontadaEnOtroLugar && !motivoCambio.trim())) {
    setMensaje('Debes ingresar el motivo de cambio para reemplazar o mover la cubierta.');
    return;
  }
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
    
  // Usar el service crearMontaje
    const result = await crearMontaje(dto);
    setMensaje(result);
    if (result === 'Montaje guardado correctamente') {
      setMostrarMensaje(true);
      // El setTimeout solo limpia el mensaje, no los campos
      setTimeout(() => {
        setMostrarMensaje(false);
        setIdCubierta('');
        setIdColectivo('');
        setIdUbicacion('');
        setMotivoCambio('');
        setCubiertaActual(null);
        setMostrarCartel(false);
        setConfirmarReemplazo(false);
        setIdColectivo('');
        setIdUbicacion('0');
      }, 3000);
    }
  };

  return (
    <div className="w-full min-h-screen bg-blue-100 flex flex-col items-center justify-center">
      <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-lg mb-40">
        {cubiertaMontadaInfo && (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-4 text-center font-medium border border-yellow-300 shadow">
            <span>
              <b>¡Atención!</b> Esta cubierta ya está montada en el colectivo <b>{cubiertaMontadaInfo.nroColectivo}</b> en la ubicación <b>{cubiertaMontadaInfo.descripcionUbicacion}</b>.
            </span>
          </div>
        )}
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
                {(cubiertaActual && mostrarCartel) || cubiertaMontadaEnOtroLugar ? (
                  <label className="font-medium text-black block">Motivo de cambio:
          <input
            type="text"
            id="motivoCambio"
            value={motivoCambio}
            onChange={e => setMotivoCambio(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 mt-1"
            list="motivo-cambio-list"
            placeholder="Seleccionar motivo..."
            autoComplete="off"
          />
                    <datalist id="motivo-cambio-list">
                      <option value="PINCHADO" />
                      <option value="MAL DESGASTE" />
                      <option value="DESGASTE" />
                      <option value="RUPTURA" />
                      <option value="REPARACIÓN" />
                      <option value="ROTACION" />
                    </datalist>
                  </label>
                ) : null}
            </div>
          </div>
    <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-md mt-6 self-center w-40 font-medium text-base cursor-pointer border-none" disabled={cubiertaEnReparacion}>Guardar Montaje</button>
        </form>
        {/* Cartel de éxito estilizado y mensajes temporales */}
        {mostrarMensaje && mensaje === 'Montaje guardado correctamente' && (
          <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded-lg text-green-800 text-center font-semibold shadow">
            <span>✅ {mensaje.replace(/^✅\s*/, '')}</span>
          </div>
        )}
        {/* Otros mensajes de error o advertencia */}
        {mensaje && !cubiertaEnReparacion && mensaje !== 'Montaje guardado correctamente' && (
          <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 rounded-lg text-yellow-800 text-center font-semibold shadow">
            <span>{mensaje}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default FormularioMontaje;
