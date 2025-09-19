import { apiService } from '../utils/apiService';

export async function eliminarColectivo(idColectivo: number): Promise<boolean> {
  try {
    const resp = await apiService(`${import.meta.env.VITE_API_BASE_URL}/api/colectivos/${idColectivo}`, {
      method: 'DELETE',
    });
    return resp.ok;
  } catch (e) {
    return false;
  }
}
