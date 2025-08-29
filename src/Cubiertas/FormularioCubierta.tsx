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
    <div className="w-full bg-blue-100 py-12">
      <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Ingresar Cubierta Nueva</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-row gap-8 justify-center">
            {/* Columna 1 */}
            <div className="flex flex-col gap-4 min-w-[220px]">
              <label className="font-medium text-black block">Nro. Serie
                <input type="text" value={nroSerie} onChange={e => setNroSerie(e.target.value)} onBlur={handleNroSerieBlur} required className="border border-gray-300 rounded-md p-2 w-full mt-1" />
              </label>
              <label className="font-medium text-black block">Marca
                <input type="text" value={marca} onChange={e => setMarca(e.target.value)} required className={`border border-gray-300 rounded-md p-2 w-full mt-1 ${editando ? 'text-black' : ''}`} disabled={editando} />
              </label>
              <label className="font-medium text-black block">Medida
                <input type="text" value={medida} onChange={e => setMedida(e.target.value)} required className={`border border-gray-300 rounded-md p-2 w-full mt-1 ${editando ? 'text-black' : ''}`} disabled={editando} />
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
