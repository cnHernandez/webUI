import { apiService } from '../utils/apiService';

// Consulta si hay una cubierta montada en un colectivo y ubicación específicos
export async function consultarMontajeActual(idColectivo: number, idUbicacion: number) {
  try {
    const response = await apiService(`${import.meta.env.VITE_API_BASE_URL}/api/montajes/actual/${idColectivo}/${idUbicacion}`);
    if (!response.ok) return null;
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    if (!contentType?.includes('application/json') || contentLength === '0') return null;
    const text = await response.text();
    if (!text) return null;
    const data = JSON.parse(text);
    return data || null;
  } catch {
    return null;
  }
}
