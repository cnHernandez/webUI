export async function crearCubierta(data: {
  NroSerie: string;
  Marca: string;
  Medida: string;
  FechaCompra: string;
  Estado: 'Nueva' | 'Recapada' | 'DobleRecapada';
  FechaRecapado?: string;
  FechaDobleRecapada?: string;
}): Promise<string> {
  try {
    // Mapeo de estado string a número
    const estadoMap: Record<string, number> = {
      'Nueva': 0,
      'Recapada': 1,
      'DobleRecapada': 2
    };
    const body: any = {
      NroSerie: data.NroSerie,
      Marca: data.Marca,
      Medida: data.Medida,
      FechaCompra: data.FechaCompra + 'T00:00:00',
      Estado: estadoMap[data.Estado] ?? 0
    };
    if (data.FechaRecapado) body.FechaRecapado = data.FechaRecapado + 'T00:00:00';
    if (data.FechaDobleRecapada) body.FechaDobleRecapada = data.FechaDobleRecapada + 'T00:00:00';
    const response = await fetch('http://localhost:5058/api/cubiertas', {
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
