import type { Cubierta } from '../models/Cubierta';

export async function obtenerCubiertaPorNroSerie(nroSerie: string): Promise<Cubierta | null> {
  try {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cubiertas/nroserie/${nroSerie}`);
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch {
    return null;
  }
}
