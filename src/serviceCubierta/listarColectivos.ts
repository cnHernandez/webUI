
import { apiService } from '../utils/apiService';

function mapearEstado(estado: unknown, estadoDescripcion?: string): 'Activo' | 'FueraDeServicio' | 'DarDeBaja' {
  if (estadoDescripcion === 'DarDeBaja' || estado === 2 || estado === '2') {
    return 'DarDeBaja';
  }

  if (estadoDescripcion === 'FueraDeServicio' || estado === 1 || estado === '1') {
    return 'FueraDeServicio';
  }

  return 'Activo';
}

export async function listarColectivos(opciones?: { incluirSinAsignacion?: boolean; incluirDadasDeBaja?: boolean }): Promise<any[]> {
  try {
    const apiHost = import.meta.env.VITE_API_BASE_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5058' : 'http://api:80');
    const response = await apiService(`${apiHost}/api/colectivos`);
    if (response.ok) {
      const data = await response.json();
      const colectivos = data.map((c: any) => ({
        IdColectivo: c.idColectivo,
        NroColectivo: c.nroColectivo,
        NumeroLiberado: c.numeroLiberado ?? null,
        NumeroDisponibleActual: c.numeroDisponibleActual ?? null,
        Patente: c.patente,
        Modelo: c.modelo,
        Estado: mapearEstado(c.estado, c.estadoDescripcion),
        SinAsignacion: c.sinAsignacion === true,
        Kilometraje: c.kilometraje,
        VtoVTV: c.vtoVTV ?? null,
        CubiertasMontadas: Array.isArray(c.cubiertasMontadas)
          ? c.cubiertasMontadas.map((montaje: any) => ({
              IdUbicacion: montaje.idUbicacion,
              DescripcionUbicacion: montaje.descripcionUbicacion,
              NroSerie: montaje.nroSerie,
              EstadoCubierta: montaje.estadoCubierta,
            }))
          : [],
        UltimoCambioAceite: c.ultimoCambioAceite || null,
      }));

      return colectivos.filter((c: any) => {
        if (!opciones?.incluirSinAsignacion && c.SinAsignacion) return false;
        if (!opciones?.incluirDadasDeBaja && c.Estado === 'DarDeBaja') return false;
        return true;
      });
    }
    return [];
  } catch (err) {
    console.error('Error en listarColectivos:', err);
    return [];
  }
}
