
import { apiService } from '../utils/apiService';

export async function listarColectivos(): Promise<any[]> {
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
        Estado: c.estado,
        Kilometraje: c.kilometraje,
        VtoVTV: c.vtoVTV ?? null,
        UltimoCambioAceite: c.ultimoCambioAceite || null,
      }));
    }
    return [];
  } catch (err) {
    console.error('Error en listarColectivos:', err);
    return [];
  }
}
