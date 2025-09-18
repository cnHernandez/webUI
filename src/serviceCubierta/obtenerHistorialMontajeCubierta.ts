import type { HistorialMontaje } from '../models/HistorialMontaje';
import { apiService } from '../utils/apiService';

export async function obtenerHistorialMontajeCubierta(idCubierta: number): Promise<HistorialMontaje[]> {
  try {
  const response = await apiService(`${import.meta.env.VITE_API_BASE_URL}/api/montajes/historialcubierta/${idCubierta}`);
    if (!response.ok) {
      // Si es 404, simplemente retornar [] sin hacer nada
      return [];
    }
    const data = await response.json();
    return data;
  } catch {
    // Si hay error de red u otro, tampoco mostrar nada
    return [];
  }
}
