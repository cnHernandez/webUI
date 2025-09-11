export async function crearCubierta(data: {
  NroSerie: string;
  Marca: string;
  Medida: string;
  FechaCompra: string;
  Estado: 'Nueva' | 'Recapada' | 'DobleRecapada' | 'TripleRecapada';
  FechaRecapado?: string;
  FechaDobleRecapada?: string;
  FechaTripleRecapada?: string;
}): Promise<string> {
  try {
    const body: any = {
      NroSerie: data.NroSerie,
      Marca: data.Marca,
      Medida: data.Medida,
      FechaCompra: data.FechaCompra + 'T00:00:00',
      EstadoInfo: {
        Estado: data.Estado,
        FechaRecapada: data.FechaRecapado ? data.FechaRecapado + 'T00:00:00' : undefined,
        FechaDobleRecapada: data.FechaDobleRecapada ? data.FechaDobleRecapada + 'T00:00:00' : undefined,
        FechaTripleRecapada: data.FechaTripleRecapada ? data.FechaTripleRecapada + 'T00:00:00' : undefined
      }
    };
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cubiertas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (response.ok) return 'Cubierta guardada correctamente';
    return 'Error al guardar la cubierta';
  } catch {
    return 'Error de conexión';
  }
}
