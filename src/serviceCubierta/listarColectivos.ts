import type { Colectivo } from '../models/Colectivo';
import { apiService } from '../utils/apiService';

export async function listarColectivos(): Promise<Colectivo[]> {
  try {
  const apiHost = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5058' : 'http://api:80');
    const response = await apiService(`${apiHost}/api/colectivos`);
    if (response.ok) {
      const data = await response.json();
      return data.map((c: any) => ({
        IdColectivo: c.idColectivo,
        NroColectivo: c.nroColectivo,
        Patente: c.patente,
        Marca: c.marca,
        Modelo: c.modelo,
        Año: c.año,
        Estado: c.estado, // Si necesitas mapear el número a string, avísame
        Kilometraje: c.kilometraje,
        VtoVTV: c.vtoVTV ?? null,
      }));
    }
    return [];
  } catch (err) {
    console.error('Error en listarColectivos:', err);
    return [];
  }
}
