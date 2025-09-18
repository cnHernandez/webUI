import type { Cubierta } from '../models/Cubierta';
import { apiService } from '../utils/apiService';

export async function obtenerCubiertaPorNroSerie(nroSerie: string): Promise<Cubierta | null> {
  try {
  const response = await apiService(`${import.meta.env.VITE_API_BASE_URL}/api/cubiertas/nroserie/${nroSerie}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return null;
  } catch {
    return null;
  }
}
