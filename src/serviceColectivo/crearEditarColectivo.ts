import { apiService } from '../utils/apiService';

export async function crearEditarColectivo({
  editando,
  idColectivoEditando,
  nroColectivo,
  patente,
  modelo,
  estado,
  kilometraje,
  vtoVTV
}: {
  editando: boolean;
  idColectivoEditando: number | null;
  nroColectivo: string;
  patente: string;
  modelo: string;
  estado: number;
  kilometraje?: number;
  vtoVTV?: string;
}): Promise<Response> {
  const apiHost = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5058' : 'http://api:80');
  if (editando && idColectivoEditando) {
    // PUT para modificar colectivo existente
    return apiService(`${apiHost}/api/colectivos/${idColectivoEditando}`, {
      method: 'PUT',
      body: JSON.stringify({
        nroColectivo,
        patente,
        modelo,
        estado,
        kilometraje,
        vtoVTV: vtoVTV || undefined,
      })
    });
  } else {
    // POST para crear nuevo colectivo
    return apiService(`${apiHost}/api/colectivos`, {
      method: 'POST',
      body: JSON.stringify({
        nroColectivo,
        patente,
        modelo,
        estado,
        kilometraje,
        vtoVTV: vtoVTV || undefined,
      })
    });
  }
}
