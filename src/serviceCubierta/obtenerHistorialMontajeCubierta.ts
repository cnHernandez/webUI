import type { HistorialMontaje } from '../models/HistorialMontaje';

export async function obtenerHistorialMontajeCubierta(idCubierta: number): Promise<HistorialMontaje[]> {
  try {
  const { getApiKeyHeaders } = await import('../utilsApiKey');
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/montajes/historialcubierta/${idCubierta}`, {
    headers: getApiKeyHeaders()
  });
    if (!response.ok) {
      // Si es 404, simplemente retornar [] sin hacer nada
      return [];
    }
    const data = await response.json();
    return data;
  } catch {
    // Si hay error de red u otro, tampoco mostrar nada
    return [];
  }
}
