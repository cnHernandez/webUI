import type { Cubierta } from '../models/Cubierta';
import { apiService } from '../utils/apiService';

export async function listarCubiertas(): Promise<Cubierta[]> {
  try {
  const apiHost = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5058' : 'http://api:80');
    const response = await apiService(`${apiHost}/api/cubiertas`);
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return [];
  } catch (error) {
    console.error('Error al obtener cubiertas:', error);
    return [];
  }
}
