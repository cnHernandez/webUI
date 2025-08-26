export type EstadoCubierta = 'Nueva' | 'Recapada' | 'DobleRecapada';
export type Cubierta = {
  idCubierta: number;
  nroSerie: string;
  marca: string;
  medida: string;
  fechaCompra?: string;
  estado?: number | EstadoCubierta;
  fechaRecapado?: string;
  fechaDobleRecapada?: string;
};
