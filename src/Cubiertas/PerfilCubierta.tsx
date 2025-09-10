import { useEffect, useState } from 'react';
import { obtenerCubiertaPorNroSerie } from '../serviceCubierta/obtenerCubiertaPorNroSerie';
import { eliminarCubierta } from '../serviceCubierta/eliminarCubierta';
import type { Cubierta } from '../models/Cubierta';
import { traducirEstadoCubierta } from '../models/Cubierta';

interface PerfilCubiertaProps {
  nroSerie: string;
  onVolver?: () => void;
}

export default function PerfilCubierta({ nroSerie, onVolver }: PerfilCubiertaProps) {
  const [cubierta, setCubierta] = useState<Cubierta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [bajaLoading, setBajaLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    obtenerCubiertaPorNroSerie(nroSerie)
      .then(data => {
        setCubierta(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al obtener la cubierta');
        setLoading(false);
      });
  }, [nroSerie]);

  if (loading) return <div className="p-4">Cargando perfil...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!cubierta) return <div className="p-4 text-gray-500">No se encontró la cubierta.</div>;



  // Estado y fechas desde el modelo actualizado
  // El backend envía las propiedades de estadoInfo en minúscula
  // Acceso flexible para propiedades en mayúscula y minúscula
  // Acceso flexible usando notación de índice para evitar errores de compilación
  const estado = cubierta.estadoInfo?.['Estado'] ?? cubierta.estadoInfo?.['estado'] ?? '-';
  const estadoTraducido = traducirEstadoCubierta(estado);
  const fechaRecapada = cubierta.estadoInfo?.['FechaRecapada'] ?? cubierta.estadoInfo?.['fechaRecapada'] ?? cubierta.fechaRecapada;
  const fechaDobleRecapada = cubierta.estadoInfo?.['FechaDobleRecapada'] ?? cubierta.estadoInfo?.['fechaDobleRecapada'] ?? cubierta.fechaDobleRecapada;
  const fechaTripleRecapada = cubierta.estadoInfo?.['FechaTripleRecapada'] ?? cubierta.estadoInfo?.['fechaTripleRecapada'] ?? cubierta.fechaTripleRecapada;

  const fechaReparacion = cubierta['FechaReparacion'] ?? cubierta.fechaReparacion ?? '-';
 

  return (
    <div className="w-full min-h-screen bg-blue-100 flex flex-col items-center justify-center">
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-black text-center">Perfil de cubierta: {cubierta.nroSerie}</h2>
    
        <table className="w-full border-collapse text-black mb-6">
          <tbody>
            <tr>
              <td className="font-semibold p-2 border border-gray-300">Nro Serie</td>
              <td className="p-2 border border-gray-300">{cubierta.nroSerie}</td>
            </tr>
            <tr>
              <td className="font-semibold p-2 border border-gray-300">Marca</td>
              <td className="p-2 border border-gray-300">{cubierta.marca}</td>
            </tr>
            <tr>
              <td className="font-semibold p-2 border border-gray-300">Medida</td>
              <td className="p-2 border border-gray-300">{cubierta.medida}</td>
            </tr>
            <tr>
              <td className="font-semibold p-2 border border-gray-300">Fecha de Compra</td>
              <td className="p-2 border border-gray-300">{cubierta.fechaCompra ? new Date(cubierta.fechaCompra).toLocaleDateString() : '-'}</td>
            </tr>
            <tr>
              <td className="font-semibold p-2 border border-gray-300">Estado</td>
              <td className="p-2 border border-gray-300">{estadoTraducido}</td>
            </tr>
            <tr>
              <td className="font-semibold p-2 border border-gray-300">Fecha Recapada</td>
              <td className="p-2 border border-gray-300">{fechaRecapada ? new Date(fechaRecapada).toLocaleDateString() : '-'}</td>
            </tr>
            <tr>
              <td className="font-semibold p-2 border border-gray-300">Fecha Doble Recapada</td>
              <td className="p-2 border border-gray-300">{fechaDobleRecapada ? new Date(fechaDobleRecapada).toLocaleDateString() : '-'}</td>
            </tr>
            <tr>
              <td className="font-semibold p-2 border border-gray-300">Fecha Triple Recapada</td>
              <td className="p-2 border border-gray-300">{fechaTripleRecapada ? new Date(fechaTripleRecapada).toLocaleDateString() : '-'}</td>
            </tr>
            <tr>
              <td className="font-semibold p-2 border border-gray-300">Fecha Reparación</td>
              <td className="p-2 border border-gray-300">{fechaReparacion !== '-' && fechaReparacion ? new Date(fechaReparacion).toLocaleDateString() : '-'}</td>
            </tr>
          </tbody>
        </table>
        {/* Botones Dar de Baja y Volver */}
        <div className="flex justify-center mt-6 gap-4">
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            onClick={() => setShowConfirm(true)}
            disabled={bajaLoading}
          >
            Dar de Baja
          </button>
          {onVolver && (
            <button
              onClick={onVolver}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
              disabled={bajaLoading}
            >
              Volver
            </button>
          )}
        </div>

        {/* Modal de confirmación personalizado */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
              <h3 className="text-lg font-bold mb-2 text-red-700">Confirmar baja de cubierta</h3>
              <p className="mb-4 text-gray-700">¿Está seguro que desea dar de baja la cubierta <span className="font-semibold">{cubierta?.nroSerie}</span>? Esta acción no se puede deshacer.</p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  onClick={async () => {
                    if (!cubierta?.idCubierta) {
                      setShowConfirm(false);
                      return;
                    }
                    setBajaLoading(true);
                    const ok = await eliminarCubierta(cubierta.idCubierta);
                    setBajaLoading(false);
                    setShowConfirm(false);
                    if (ok && onVolver) onVolver();
                  }}
                  disabled={bajaLoading}
                >
                  Confirmar Baja
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                  onClick={() => setShowConfirm(false)}
                  disabled={bajaLoading}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
