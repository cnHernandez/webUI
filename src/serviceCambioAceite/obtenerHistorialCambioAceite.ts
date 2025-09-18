import { apiService } from '../utils/apiService';

export async function obtenerHistorialCambioAceite(colectivoId: number) {
  const apiHost = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5058' : 'http://api:80');
  const response = await apiService(`${apiHost}/api/cambioaceite/historial/${colectivoId}`);
  if (response.ok) {
    return await response.json();
  }
  return [];
}
