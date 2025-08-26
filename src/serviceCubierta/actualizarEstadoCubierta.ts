
export async function actualizarEstadoCubierta(
  nroSerie: string,
  estado: string,
  fechaRecapada?: string,
  fechaDobleRecapada?: string
): Promise<string> {
  try {
    let estadoStr = estado;
    if (typeof estado === 'number') {
      estadoStr = ['Nueva', 'Recapada', 'DobleRecapada'][estado] ?? 'Nueva';
    }
    const body: any = { estado: estadoStr };
    if (estadoStr === 'Recapada' && fechaRecapada) body.fechaRecapada = fechaRecapada;
    if (estadoStr === 'DobleRecapada' && fechaDobleRecapada) body.fechaDobleRecapada = fechaDobleRecapada;

    const response = await fetch(`http://localhost:5058/api/cubiertas/nroserie/${nroSerie}/estado`, {
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
