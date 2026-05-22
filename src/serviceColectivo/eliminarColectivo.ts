import { apiService } from '../utils/apiService';

export async function eliminarColectivo(idColectivo: number): Promise<boolean> {
  try {
    const apiHost = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5058' : 'http://api:80');
    const resp = await apiService(`${apiHost}/api/colectivos/${idColectivo}`, {
      method: 'DELETE',
    });
    return resp.ok;
  } catch (e) {
    return false;
  }
}
