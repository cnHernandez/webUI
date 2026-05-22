import { apiService } from '../utils/apiService';
import type { HistorialVtvDto } from '../Colectivos/types';

export async function registrarVtv(nroColectivo: string | number, fechaRealizacion: string): Promise<HistorialVtvDto> {
  const apiHost = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5058' : 'http://api:80');
  const fechaReal = new Date(fechaRealizacion);
  const fechaRealStr = fechaReal.toISOString().slice(0, 10) + 'T00:00:00.000Z';
  const body = {
    fechaRealizacion: fechaRealStr,
  };
  const response = await apiService(`${apiHost}/api/colectivos/${nroColectivo}/historial-vtv`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    let msg = 'Error al registrar VTV';
    try {
      const errText = await response.text();
      console.error('Respuesta error VTV:', errText);
      msg += ': ' + errText;
    } catch {}
    throw new Error(msg);
  }
  return await response.json();
}
