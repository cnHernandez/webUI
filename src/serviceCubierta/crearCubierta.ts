export async function crearCubierta(data: {
  NroSerie: string;
  Marca: string;
  Medida: string;
  FechaCompra: string;
  Estado: 'Nueva' | 'Recapada' | 'DobleRecapada' | 'TripleRecapada' | 'EnReparacion' | 'Emparchada';
  FechaRecapado?: string;
  FechaDobleRecapada?: string;
  FechaTripleRecapada?: string;
  FechaEmparchada?: string;
}): Promise<string> {
  try {
    const estadoInfo: any = { Estado: data.Estado };
    if (data.FechaRecapado) estadoInfo.FechaRecapada = data.FechaRecapado + 'T00:00:00';
    if (data.FechaDobleRecapada) estadoInfo.FechaDobleRecapada = data.FechaDobleRecapada + 'T00:00:00';
    if (data.FechaTripleRecapada) estadoInfo.FechaTripleRecapada = data.FechaTripleRecapada + 'T00:00:00';
    if (data.FechaEmparchada) estadoInfo.FechaEmparchada = data.FechaEmparchada + 'T00:00:00';
    const body: any = {
      NroSerie: data.NroSerie,
      Marca: data.Marca,
      Medida: data.Medida,
      FechaCompra: data.FechaCompra + 'T00:00:00',
      EstadoInfo: estadoInfo
    };
  const { getApiKeyHeaders } = await import('../utilsApiKey');
  const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cubiertas`, {
      method: 'POST',
      headers: getApiKeyHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body)
    });
    if (response.ok) return 'Cubierta guardada correctamente';
    return 'Error al guardar la cubierta';
  } catch {
    return 'Error de conexión';
  }
}
