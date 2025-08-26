export type EstadoCubierta = 'Nueva' | 'Recapada' | 'DobleRecapada';
export type Cubierta = {
  IdCubierta: number;
  NroSerie: string;
  Marca: string;
  Medida: string;
  FechaCompra: string;
  Estado: EstadoCubierta;
};

export type Colectivo = {
  IdColectivo: number;
  NroColectivo: string;
  Patente: string;
  Marca: string;
  Modelo?: string;
  Año: number;
  Estado: 'Activo' | 'FueraDeServicio';
};

export type UbicacionCubierta = {
  IdUbicacion: number;
  Descripcion: string;
};
