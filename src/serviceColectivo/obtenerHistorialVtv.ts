import { apiService } from '../utils/apiService';
import type { HistorialVtvDto } from '../Colectivos/types';

export async function obtenerHistorialVtv(nroColectivo: string | number): Promise<HistorialVtvDto[]> {
  const apiHost = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5058' : 'http://api:80');
  const response = await apiService(`${apiHost}/api/colectivos/${nroColectivo}/historial-vtv`);
  if (!response.ok) throw new Error('No hay historial para este colectivo.');
  return await response.json();
}
