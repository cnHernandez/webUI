// Servicio para eliminar una cubierta por id
export async function eliminarCubierta(idCubierta: number): Promise<boolean> {
  try {
  const { getApiKeyHeaders } = await import('../utilsApiKey');
  const resp = await fetch(`${import.meta.env.VITE_API_URL}/api/cubiertas/${idCubierta}`, {
      method: 'DELETE',
      headers: getApiKeyHeaders()
    });
    return resp.ok;
  } catch (e) {
    return false;
  }
}
