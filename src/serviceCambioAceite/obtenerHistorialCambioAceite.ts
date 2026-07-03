import { apiService } from '../utils/apiService';

export async function obtenerHistorialCambioAceite(colectivoId: number) {
  const apiHost = import.meta.env.VITE_API_BASE_URL || 'http://3.145.26.78:8080';
  const response = await apiService(`${apiHost}/api/cambioaceite/historial/${colectivoId}`);
  if (response.ok) {
    return await response.json();
  }
  return [];
}
