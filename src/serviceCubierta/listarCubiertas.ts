import type { Cubierta } from '../models/Cubierta';

export async function listarCubiertas(): Promise<Cubierta[]> {
  try {
    const response = await fetch('http://localhost:5058/api/cubiertas');
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
