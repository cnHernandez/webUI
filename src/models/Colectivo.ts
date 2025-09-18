export type EstadoColectivo = 'Activo' | 'FueraDeServicio';
export type Colectivo = {
  IdColectivo: number;
  NroColectivo: string;
  Patente: string;
  Modelo?: string;
  Estado: EstadoColectivo;
  Kilometraje?: number;
};
