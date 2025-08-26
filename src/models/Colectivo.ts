export type EstadoColectivo = 'Activo' | 'FueraDeServicio';
export type Colectivo = {
  IdColectivo: number;
  NroColectivo: string;
  Patente: string;
  Marca: string;
  Modelo?: string;
  Año: number;
  Estado: EstadoColectivo;
};
