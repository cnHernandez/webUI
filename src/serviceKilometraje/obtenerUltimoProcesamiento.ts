import { apiService } from '../utils/apiService';

export interface UltimoProcesamientoResponse {
  fechaUltimoArchivo?: string;
  nombreUltimoArchivo?: string;
  fechaProcesamiento?: string;
  archivosProceados?: number;
  colectivosActualizados?: number;
  fechaUltimoArchivoFormateada?: string;
  fechaProcesamientoFormateada?: string;
  mensaje?: string;
}

export async function obtenerUltimoProcesamiento(): Promise<UltimoProcesamientoResponse | null> {
  try {
    const apiHost = import.meta.env.VITE_API_BASE_URL || 'http://3.145.26.78:8080';
    const response = await apiService(`${apiHost}/api/sistema/ultimo-procesamiento`);
    
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    
    return null;
  } catch (err) {
    console.error('Error al obtener último procesamiento:', err);
    return null;
  }
}