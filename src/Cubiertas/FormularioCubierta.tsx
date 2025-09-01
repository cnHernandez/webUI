import { useState } from 'react';
import { crearCubierta } from '../serviceCubierta/crearCubierta';
import { actualizarEstadoCubierta } from '../serviceCubierta/actualizarEstadoCubierta';
import { obtenerCubiertaPorNroSerie } from '../serviceCubierta/obtenerCubiertaPorNroSerie';


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
      // Normalizar el estado para el backend
      let estadoEnviar = estado;
      if (estado === 'En Reparación') estadoEnviar = 'EnReparacion';
      if (estado === 'en reparacion') estadoEnviar = 'EnReparacion';
      if (estado === 'enReparacion') estadoEnviar = 'EnReparacion';
      const result = await actualizarEstadoCubierta(nroSerie, estadoEnviar, fechaRecapado, fechaDobleRecapada);
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
        let estadoActual = cubierta.estado ?? 'Nueva';
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
        setMensaje('Cubierta existente, puedes editar el estado.');
      } else {
        setEditando(false);
      }
    } catch {
      setEditando(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl">
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
                  value="295/80 R22.5"
                  readOnly
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
            </div>
          </div>
          <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-md mt-6 self-center w-40 font-medium text-base cursor-pointer border-none">{editando ? 'Actualizar Estado' : 'Guardar Cubierta'}</button>
        </form>
        {mensaje && <p className={`mt-4 text-base ${mensaje.includes('correctamente') ? 'text-green-600' : 'text-red-600'}`}>{mensaje}</p>}
      </div>
    </div>
  );
}
