import type { Cubierta } from '../models/Cubierta';

export async function obtenerCubiertaPorNroSerie(nroSerie: string): Promise<Cubierta | null> {
  try {
  const { getApiKeyHeaders } = await import('../utilsApiKey');
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cubiertas/nroserie/${nroSerie}`, {
    headers: getApiKeyHeaders()
  });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return null;
  } catch {
    return null;
  }
}
