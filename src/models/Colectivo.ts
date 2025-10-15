
export type EstadoColectivo = 'Activo' | 'FueraDeServicio';
export type Colectivo = {
  IdColectivo: number;
  NroColectivo: string;
  Patente: string;
  Modelo?: string;
  Estado: EstadoColectivo;
  Kilometraje?: number | null;
  VtoVTV?: string | null; // ISO date string, puede ser null
  UltimoCambioAceite?: {
    kilometros: number;
    fecha: string;
  } | null;
};
