import type { HistorialMontaje } from '../models/HistorialMontaje';

export async function obtenerHistorialMontajeCubierta(idCubierta: number): Promise<HistorialMontaje[]> {
  try {
    const response = await fetch(`http://localhost:5058/api/montajes/historialcubierta/${idCubierta}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener historial de montaje:', error);
    return [];
  }
}
