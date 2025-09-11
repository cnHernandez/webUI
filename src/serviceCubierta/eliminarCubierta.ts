// Servicio para eliminar una cubierta por id
export async function eliminarCubierta(idCubierta: number): Promise<boolean> {
  try {
  const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/cubiertas/${idCubierta}`, {
      method: 'DELETE',
    });
    return resp.ok;
  } catch (e) {
    return false;
  }
}
