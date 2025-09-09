import { useState } from 'react';
import { obtenerHistorialMontajeCubierta } from '../serviceCubierta/obtenerHistorialMontajeCubierta';
import { crearCubierta } from '../serviceCubierta/crearCubierta';
import { actualizarEstadoCubierta } from '../serviceCubierta/actualizarEstadoCubierta';
import { obtenerCubiertaPorNroSerie } from '../serviceCubierta/obtenerCubiertaPorNroSerie';


export default function FormularioCubierta() {
  const [nroSerie, setNroSerie] = useState('');
  const [marca, setMarca] = useState('');
  const [medida, setMedida] = useState('295/80 R22.5');
  const [fechaCompra, setFechaCompra] = useState('');
  const [estado, setEstado] = useState('Nueva');
  const [fechaRecapado, setFechaRecapado] = useState('');
  const [fechaDobleRecapada, setFechaDobleRecapada] = useState('');
  const [motivoCambio, setMotivoCambio] = useState('');
  const [mensaje, setMensaje] = useState('');
  // Controla visibilidad del mensaje
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [editando, setEditando] = useState(false);
  const [montajeActual, setMontajeActual] = useState<{ nroColectivo: string; descripcionUbicacion: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setMostrarMensaje(false);
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    // Validar fechas
    if (fechaCompra) {
      const fecha = new Date(fechaCompra);
      if (fecha > hoy) {
        setMensaje('La fecha de compra no puede ser mayor a la fecha actual.');
        setMostrarMensaje(true);
        return;
      }
    }
    if (estado === 'Recapada' && fechaRecapado) {
      const fecha = new Date(fechaRecapado);
      if (fecha > hoy) {
        setMensaje('La fecha de recapado no puede ser mayor a la fecha actual.');
        setMostrarMensaje(true);
        return;
      }
    }
    if (estado === 'DobleRecapada' && fechaDobleRecapada) {
      const fecha = new Date(fechaDobleRecapada);
      if (fecha > hoy) {
        setMensaje('La fecha de doble recapada no puede ser mayor a la fecha actual.');
        setMostrarMensaje(true);
        return;
      }
    }
    if (editando) {
      // Normalizar el estado para el backend
      let estadoEnviar = estado;
      if (estado === 'En Reparación') estadoEnviar = 'EnReparacion';
      if (estado === 'en reparacion') estadoEnviar = 'EnReparacion';
      if (estado === 'enReparacion') estadoEnviar = 'EnReparacion';
      const result = await actualizarEstadoCubierta(
        nroSerie,
        estadoEnviar,
        fechaRecapado,
        fechaDobleRecapada,
        estadoEnviar === 'EnReparacion' ? motivoCambio : undefined
      );
      if (result === 'Estado actualizado correctamente') {
        setMensaje('✅ Estado actualizado correctamente');
      } else {
        setMensaje(result);
      }
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
      setNroSerie('');
      setMarca('');
      setMedida('');
      setFechaCompra('');
      setEstado('Nueva');
      setFechaRecapado('');
      setFechaDobleRecapada('');
      setMotivoCambio('');
      setEditando(false);
      setMontajeActual(null);
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
    setMostrarMensaje(true);
    setTimeout(() => setMostrarMensaje(false), 3000);
    if (result === 'Cubierta guardada correctamente') {
      setNroSerie('');
      setMarca('');
      setMedida('295/80 R22.5');
      setFechaCompra('');
      setEstado('Nueva');
      setFechaRecapado('');
      setFechaDobleRecapada('');
    }
  };

  // Autocompletar datos si el nroSerie existe
  const handleNroSerieBlur = async () => {
    if (!nroSerie) return;
    setMontajeActual(null);
    try {
      const cubierta = await obtenerCubiertaPorNroSerie(nroSerie);
      if (cubierta) {
        setMarca(cubierta.marca ?? '');
        setMedida(cubierta.medida ?? '');
        // Formatear fecha a yyyy-MM-dd si viene con hora
        let fecha = cubierta.fechaCompra ?? '';
        if (fecha && fecha.includes('T')) {
          fecha = fecha.split('T')[0];
        }
        setFechaCompra(fecha);
        let estadoActual = cubierta.estadoInfo?.Estado ?? 'Nueva';
        // Normalizar para el select
        if (typeof estadoActual === 'number') {
          estadoActual = ['Nueva', 'Recapada', 'DobleRecapada', 'En Reparación'][estadoActual] ?? 'Nueva';
        }
        if (estadoActual === 'EnReparacion' || estadoActual === 'enReparacion' || estadoActual === 'En Reparación') {
          estadoActual = 'En Reparación';
        }
        if (estadoActual === 'DobleRecapada' || estadoActual === 'Doble Recapada') {
          estadoActual = 'DobleRecapada';
        }
        if (estadoActual === 'Recapada' || estadoActual === 'recapada') {
          estadoActual = 'Recapada';
        }
        if (estadoActual === 'Nueva' || estadoActual === 'nueva') {
          estadoActual = 'Nueva';
        }
        setEstado(estadoActual);
        setEditando(true);
        // Consultar si está montada actualmente
        if (cubierta.idCubierta) {
          const historial = await obtenerHistorialMontajeCubierta(cubierta.idCubierta);
          // Buscar el montaje actual (sin fechaDesinstalacion)
          const actual = historial.find(h => !h.fechaDesinstalacion);
          if (actual) {
            setMontajeActual({ nroColectivo: actual.nroColectivo, descripcionUbicacion: actual.descripcionUbicacion });
          } else {
            setMontajeActual(null);
          }
        } else {
          setMontajeActual(null);
        }
  setMensaje('<b>ℹ️ Cubierta existente, puedes editar el estado.</b>');
  setMostrarMensaje(true);
  setTimeout(() => setMostrarMensaje(false), 4000);
      } else {
        setEditando(false);
        setMontajeActual(null);
      }
    } catch {
      setEditando(false);
      setMontajeActual(null);
    }
  };
  return (
  <div className="w-full min-h-screen bg-blue-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl mb-30">
        <h2 className="text-xl font-bold mb-4 text-center">Ingreso / Cambio de Estado</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex gap-8">
            {/* Columna 1 */}
            <div className="flex flex-col gap-4 min-w-[220px]">
              <label className="font-medium text-black block">Nro. Serie
                <input
                  type="text"
                  value={nroSerie}
                  onChange={e => setNroSerie(e.target.value)}
                  onBlur={handleNroSerieBlur}
                  className="border border-gray-300 rounded-md p-2 w-full mt-1 text-black"
                />
              </label>
              <label className="font-medium text-black block">Marca
                <input
                  type="text"
                  value={marca}
                  onChange={e => setMarca(e.target.value)}
                  disabled={editando}
                  list="marca-list"
                  placeholder="Seleccionar marca..."
                  className="border border-gray-300 rounded-md p-2 w-full mt-1 text-black"
                />
                <datalist id="marca-list">
                  <option value="DAYTON" />
                  <option value="BRIDGESTONE" />
                  <option value="FATE" />
                  <option value="FIRESTONE" />
                  <option value="SAMSON" />
                  <option value="GOODYEAR" />
                  <option value="CONTINENTAL" />
                  <option value="ESTELMAN" />
                  <option value="MICHELIN" />
                </datalist>
              </label>
              <label className="font-medium text-black block">Medida
                <input
                  type="text"
                  value={medida}
                  onChange={e => setMedida(e.target.value)}
                  className={`border border-gray-300 rounded-md p-2 w-full mt-1 text-black bg-gray-100`}
                />
              </label>
            </div>
            {/* Columna 2 */}
            <div className="flex flex-col gap-4 min-w-[220px]">
              <label className="font-medium text-black block">Fecha de Compra
                <input type="date" value={fechaCompra} onChange={e => setFechaCompra(e.target.value)} required className={`border border-gray-300 rounded-md p-2 w-full mt-1 ${editando ? 'text-black' : ''}`} disabled={editando} />
              </label>
              <label className="font-medium text-black block">Estado
                <select value={estado} onChange={e => setEstado(e.target.value)} className="border border-gray-300 rounded-md p-2 w-full mt-1">
                  <option value="Nueva">Nueva</option>
                  <option value="Recapada">Recapada</option>
                  <option value="DobleRecapada">Doble Recapada</option>
                  <option value="EnReparacion">En Reparación</option>
                </select>
              </label>
              {estado === 'Recapada' && (
                <label className="font-medium text-black block mt-0">Fecha de recapado
                  <input type="date" value={fechaRecapado} onChange={e => setFechaRecapado(e.target.value)} required className="border border-gray-300 rounded-md p-2 w-full mt-0 text-white bg-gray-800" />
                </label>
              )}
              {estado === 'DobleRecapada' && (
                <label className="font-medium text-black block mt-0">Fecha de doble recapada
                  <input type="date" value={fechaDobleRecapada} onChange={e => setFechaDobleRecapada(e.target.value)} required className="border border-gray-300 rounded-md p-2 w-full mt-0 text-white bg-gray-800" />
                </label>
              )}
              {(estado === 'EnReparacion' || estado === 'En Reparación') && (
                <label className="font-medium text-black block mt-0">Motivo de cambio
                  <select value={motivoCambio} onChange={e => setMotivoCambio(e.target.value)} required className="border border-gray-300 rounded-md p-2 w-full mt-1">
                    <option value="">Seleccionar motivo...</option>
                    <option value="PINCHADO">PINCHADO</option>
                    <option value="MAL DESGASTE">MAL DESGASTE</option>
                    <option value="DESGASTE">DESGASTE</option>
                    <option value="RUPTURA">RUPTURA</option>
                  </select>
                </label>
              )}
            </div>
          </div>
          <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-md mt-6 self-center w-40 font-medium text-base cursor-pointer border-none">{editando ? 'Actualizar Estado' : 'Guardar Cubierta'}</button>
        </form>
        {/* Cartel de éxito estilizado y mensajes temporales */}
        {mostrarMensaje && (mensaje === 'Cubierta guardada correctamente' || mensaje === '✅ Estado actualizado correctamente') && (
          <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded-lg text-green-800 text-center font-semibold shadow">
            <span>{mensaje}</span>
          </div>
        )}
        {mostrarMensaje && mensaje && mensaje !== 'Cubierta guardada correctamente' && mensaje !== '✅ Estado actualizado correctamente' && (
          <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 rounded-lg text-yellow-800 text-center font-semibold shadow" style={{whiteSpace: 'pre-line'}}>
            <span dangerouslySetInnerHTML={{__html: mensaje}} />
          </div>
        )}
        {montajeActual && (
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg text-yellow-800 text-center font-semibold shadow">
            <span>Actualmente montada en colectivo <b>{montajeActual.nroColectivo}</b>, ubicación <b>{montajeActual.descripcionUbicacion}</b></span>
          </div>
        )}
      </div>
    </div>
  );
}
