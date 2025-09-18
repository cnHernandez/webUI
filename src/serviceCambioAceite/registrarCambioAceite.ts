import { apiService } from '../utils/apiService';

export interface CambioAceiteDto {
  Id?: number;
  ColectivoId: number;
  Fecha: string; // ISO string
  Kilometros: number;
  FiltrosCambiados: boolean;
}

export async function registrarCambioAceite(dto: CambioAceiteDto) {
  const apiHost = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5058' : 'http://api:80');
  const response = await apiService(`${apiHost}/api/cambioaceite`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dto),
  });
  if (!response.ok) throw new Error('Error al registrar el cambio de aceite');
  return await response.json();
}
