// Servicio para eliminar una cubierta por id
export async function eliminarCubierta(idCubierta: number): Promise<boolean> {
  try {
    const resp = await fetch(`http://localhost:5058/api/cubiertas/${idCubierta}`, {
      method: 'DELETE',
    });
    return resp.ok;
  } catch (e) {
    return false;
  }
}
