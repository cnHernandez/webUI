// Consulta si hay una cubierta montada en un colectivo y ubicación específicos
export async function consultarMontajeActual(idColectivo: number, idUbicacion: number) {
  try {
    const response = await fetch(`http://localhost:5058/api/montajes/actual?colectivo=${idColectivo}&ubicacion=${idUbicacion}`);
    if (!response.ok) return null;
    return await response.json(); // Debe devolver la cubierta actual o null
  } catch {
    return null;
  }
}
