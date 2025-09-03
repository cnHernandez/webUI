export async function crearMontaje(data: {
  IdCubierta: number;
  IdColectivo: number;
  IdUbicacion: number;
  MotivoCambio?: string;
}): Promise<string> {
  try {
    const response = await fetch('http://localhost:5058/api/montajes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        FechaInstalacion: new Date().toISOString()
      })
    });
    
   
    if (response.ok) return 'Montaje guardado correctamente';
    return 'Error al guardar el montaje';
  } catch {
    return 'Error de conexión';
  }
}
