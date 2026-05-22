
export type EstadoColectivo = 'Activo' | 'FueraDeServicio' | 'DarDeBaja';

export type CubiertaMontada = {
  IdUbicacion: number;
  DescripcionUbicacion: string;
  NroSerie: string;
  EstadoCubierta: string;
};

export type Colectivo = {
  IdColectivo: number;
  NroColectivo: string;
  NumeroLiberado?: string | null;
  NumeroDisponibleActual?: string | null;
  Patente: string;
  Modelo?: string;
  Estado: EstadoColectivo;
  SinAsignacion?: boolean;
  Kilometraje?: number | null;
  VtoVTV?: string | null; // ISO date string, puede ser null
  CubiertasMontadas?: CubiertaMontada[];
  UltimoCambioAceite?: {
    kilometros: number;
    fecha: string;
  } | null;
};
