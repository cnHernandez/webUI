import { apiService } from '../utils/apiService';
import type { Colectivo } from '../models/Colectivo';

function mapearEstado(estado: unknown, estadoDescripcion?: string): Colectivo['Estado'] {
  if (estadoDescripcion === 'DarDeBaja' || estado === 2 || estado === '2') {
    return 'DarDeBaja';
  }

  if (estadoDescripcion === 'FueraDeServicio' || estado === 1 || estado === '1') {
    return 'FueraDeServicio';
  }

  return 'Activo';
}

export async function obtenerColectivoPorNro(nroColectivo: string): Promise<Colectivo | null> {
  const apiHost = import.meta.env.VITE_API_BASE_URL || 'http://3.145.26.78:8080';
  const response = await apiService(`${apiHost}/api/colectivos/por-nro/${nroColectivo}`);
  if (!response.ok) return null;
  const data = await response.json();
  if (!data) return null;
  return {
    IdColectivo: data.idColectivo,
    NroColectivo: data.nroColectivo,
    NumeroLiberado: data.numeroLiberado ?? null,
    NumeroDisponibleActual: data.numeroDisponibleActual ?? null,
    Patente: data.patente,
    Modelo: data.modelo,
    Estado: mapearEstado(data.estado, data.estadoDescripcion),
    SinAsignacion: data.sinAsignacion === true,
    Kilometraje: data.kilometraje,
    VtoVTV: data.vtoVTV ?? null,
    CubiertasMontadas: Array.isArray(data.cubiertasMontadas)
      ? data.cubiertasMontadas.map((montaje: any) => ({
          IdUbicacion: montaje.idUbicacion,
          DescripcionUbicacion: montaje.descripcionUbicacion,
          NroSerie: montaje.nroSerie,
          EstadoCubierta: montaje.estadoCubierta,
        }))
      : [],
  };
}
