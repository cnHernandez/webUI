import { apiService } from '../utils/apiService';
import type { Colectivo } from '../models/Colectivo';

export async function obtenerColectivoPorNro(nroColectivo: string): Promise<Colectivo | null> {
  const apiHost = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5058' : 'http://api:80');
  const response = await apiService(`${apiHost}/api/colectivos/por-nro/${nroColectivo}`);
  if (!response.ok) return null;
  const data = await response.json();
  if (!data) return null;
  return {
    IdColectivo: data.idColectivo,
    NroColectivo: data.nroColectivo,
    Patente: data.patente,
    Modelo: data.modelo,
    Estado: data.estado,
    Kilometraje: data.kilometraje,
    VtoVTV: data.vtoVTV ?? null,
  };
}
