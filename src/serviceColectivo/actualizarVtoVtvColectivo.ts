import { apiService } from '../utils/apiService';
import type { Colectivo } from '../models/Colectivo';

export async function actualizarVtoVtvColectivo(colectivo: Colectivo): Promise<string> {
  const apiHost = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5058' : 'http://api:80');
  const response = await apiService(`${apiHost}/api/colectivos/${colectivo.IdColectivo}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(colectivo)
  });
  if (!response.ok) {
    let msg = 'Error al actualizar colectivo';
    try {
      const errText = await response.text();
      msg += ': ' + errText;
    } catch {}
    throw new Error(msg);
  }
  return 'Fecha de VTV actualizada correctamente';
}
