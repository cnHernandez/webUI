import { useEffect, useState } from 'react';
import { obtenerCubiertaPorNroSerie } from '../serviceCubierta/obtenerCubiertaPorNroSerie';
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

  // Log para depuración
  console.log('Datos recibidos en PerfilCubierta:', cubierta);

  // Estado y fechas desde el modelo actualizado
  // El backend envía las propiedades de estadoInfo en minúscula
  // Acceso flexible para propiedades en mayúscula y minúscula
  // Acceso flexible usando notación de índice para evitar errores de compilación
  const estado = cubierta.estadoInfo?.['Estado'] ?? cubierta.estadoInfo?.['estado'] ?? '-';
  const estadoTraducido = traducirEstadoCubierta(estado);
  const fechaRecapada = cubierta.estadoInfo?.['FechaRecapada'] ?? cubierta.estadoInfo?.['fechaRecapada'] ?? cubierta.fechaRecapada;
  const fechaDobleRecapada = cubierta.estadoInfo?.['FechaDobleRecapada'] ?? cubierta.estadoInfo?.['fechaDobleRecapada'] ?? cubierta.fechaDobleRecapada;
  const motivoCambio = cubierta.estadoInfo?.['MotivoCambio'] ?? cubierta.estadoInfo?.['motivoCambio'] ?? '-';
  const fechaReparacion = cubierta['FechaReparacion'] ?? cubierta.fechaReparacion ?? '-';
  const ubicacionDescripcion = cubierta.ubicacionDescripcion ?? '-';

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-black text-center">Perfil de cubierta: {cubierta.nroSerie}</h2>
      {onVolver && (
        <div className="flex justify-center mb-4">
          <button onClick={onVolver} className="px-4 py-2 bg-blue-600 text-white rounded-md">Volver</button>
        </div>
      )}
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
            <td className="font-semibold p-2 border border-gray-300">Fecha Reparación</td>
            <td className="p-2 border border-gray-300">{fechaReparacion !== '-' && fechaReparacion ? new Date(fechaReparacion).toLocaleDateString() : '-'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
