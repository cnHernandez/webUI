
export async function actualizarEstadoCubierta(
  nroSerie: string,
  estado: string,
  fechaRecapada?: string,
  fechaDobleRecapada?: string,
  motivoCambio?: string,
  fechaTripleRecapada?: string
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

  

   
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cubiertas/nroserie/${nroSerie}/estado`, {
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
