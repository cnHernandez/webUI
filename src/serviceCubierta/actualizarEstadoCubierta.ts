import { apiService } from '../utils/apiService';

export async function actualizarEstadoCubierta(
  nroSerie: string,
  estado: string,
  fechaRecapada?: string,
  fechaDobleRecapada?: string,
  motivoCambio?: string,
  fechaTripleRecapada?: string,
  fechaEmparchada?: string
): Promise<string> {
  try {
    let estadoStr = estado;
    if (typeof estado === 'number') {
      estadoStr = ['Nueva', 'Recapada', 'DobleRecapada', 'EnReparacion'][estado] ?? 'Nueva';
    }
    // Normalizar variantes del estado EnReparacion
    if (
      estadoStr === 'En Reparación' ||
      estadoStr === 'en reparacion' ||
      estadoStr === 'enReparacion'
    ) {
      estadoStr = 'EnReparacion';
    }
    // El backend espera Estado, FechaRecapada, FechaDobleRecapada
    const body: any = { Estado: estadoStr };
    if (estadoStr === 'Recapada' && fechaRecapada) body.FechaRecapada = fechaRecapada;
    if (estadoStr === 'DobleRecapada' && fechaDobleRecapada) body.FechaDobleRecapada = fechaDobleRecapada;
    if (estadoStr === 'TripleRecapada' && fechaTripleRecapada) body.FechaTripleRecapada = fechaTripleRecapada;
    if (estadoStr === 'EnReparacion' && motivoCambio) body.MotivoCambio = motivoCambio;
    if (estadoStr === 'Emparchada' && fechaEmparchada) body.FechaEmparchada = fechaEmparchada;
    // Eliminar claves con valor vacío o undefined
    Object.keys(body).forEach(key => {
      if (body[key] === '' || body[key] === undefined) {
        delete body[key];
      }
    });

  const response = await apiService(`${import.meta.env.VITE_API_BASE_URL}/api/cubiertas/nroserie/${nroSerie}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (response.ok) {
      return 'Estado actualizado correctamente';
    }
    return 'Error al actualizar el estado';
  } catch {
    return 'Error de conexión al actualizar el estado';
  }
}
