import { useEffect, useState } from 'react';
import { obtenerUltimoProcesamiento } from '../serviceKilometraje/obtenerUltimoProcesamiento';
import type { UltimoProcesamientoResponse } from '../serviceKilometraje/obtenerUltimoProcesamiento';

const InfoUltimoProcesamiento: React.FC = () => {
  const [ultimoProcesamiento, setUltimoProcesamiento] = useState<UltimoProcesamientoResponse | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarUltimoProcesamiento = async () => {
      setCargando(true);
      const datos = await obtenerUltimoProcesamiento();
      setUltimoProcesamiento(datos);
      setCargando(false);
    };

    cargarUltimoProcesamiento();
  }, []);

  if (cargando) {
    return (
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
        <span className="text-blue-600 text-sm">Cargando información...</span>
      </div>
    );
  }

  if (!ultimoProcesamiento) {
    return (
      <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
        <span className="text-gray-600 text-sm">No se pudo obtener la información del último procesamiento</span>
      </div>
    );
  }

  if (ultimoProcesamiento.mensaje) {
    return (
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
        <span className="text-yellow-700 text-sm font-medium">{ultimoProcesamiento.mensaje}</span>
      </div>
    );
  }

  return (
    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
      <span className="text-green-700 text-sm font-medium">
        Último archivo de kilometrajes procesado: {ultimoProcesamiento.fechaUltimoArchivoFormateada || 'N/A'}
      </span>
    </div>
  );
};

export default InfoUltimoProcesamiento;