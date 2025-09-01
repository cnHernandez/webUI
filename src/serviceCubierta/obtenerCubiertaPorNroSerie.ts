import type { Cubierta } from '../models/Cubierta';

export async function obtenerCubiertaPorNroSerie(nroSerie: string): Promise<Cubierta | null> {
  try {
    const response = await fetch(`http://localhost:5058/api/cubiertas/nroserie/${nroSerie}`);
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch {
    return null;
  }
}
