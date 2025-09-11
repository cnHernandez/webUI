import type { Cubierta } from '../models/Cubierta';

export async function listarCubiertas(): Promise<Cubierta[]> {
  try {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cubiertas`);
    if (response.ok) {
      const data = await response.json();
     
      return data;
    }
    return [];
  } catch (error) {
    console.error('Error al obtener cubiertas:', error);
    return [];
  }
}
