export type EstadoCubierta = 'Nueva' | 'Recapada' | 'DobleRecapada' | 'TripleRecapada' | 'EnReparacion' | 'Emparchada' | 0 | 1 | 2 | 3 | 4 | 5 | string | number;
export type EstadoCubiertaInfo = {
  Estado?: string;
  estado?: string;
  FechaRecapada?: string;
  fechaRecapada?: string;
  FechaDobleRecapada?: string;
  fechaDobleRecapada?: string;
  FechaTripleRecapada?: string;
  fechaTripleRecapada?: string;
  FechaEmparchada?: string;
  fechaEmparchada?: string;
  MotivoCambio?: string;
  motivoCambio?: string;
  [key: string]: any;
};

export type Cubierta = {
  idCubierta: number;
  nroSerie: string;
  marca: string;
  medida: string;
  fechaCompra?: string;
  estadoInfo?: EstadoCubiertaInfo;
  fechaRecapada?: string;
  fechaDobleRecapada?: string;
  fechaTripleRecapada?: string;
  fechaReparacion?: string;
  FechaReparacion?: string;
  fechaEmparchada?: string;
  FechaEmparchada?: string;
  idColectivo?: number;
  idUbicacion?: number;
  ubicacionDescripcion?: string;
  UbicacionDescripcion?: string;
  [key: string]: any;
};

// Utilidad para traducir cualquier valor de estado a su descripción
export function traducirEstadoCubierta(estado: EstadoCubierta | undefined): string {
  if (typeof estado === 'string') {
    switch (estado) {
      case 'Nueva':
        return 'Nueva';
      case 'Recapada':
        return 'Recapada';
      case 'DobleRecapada':
      case 'Doble Recapada':
        return 'Doble Recapada';
      case 'TripleRecapada':
      case 'Triple Recapada':
        return 'Triple Recapada';
      case 'EnReparacion':
      case 'En Reparacion':
      case 'enReparacion':
      case 'en reparacion':
        return 'En Reparación';
      case 'Emparchada':
      case 'emparchada':
        return 'Emparchada';
      case '3':
        return 'Doble Recapada';
      case '2':
        return 'Doble Recapada';
      case '4':
        return 'Triple Recapada';
      case '5':
        return 'Emparchada';
      case '1':
        return 'Recapada';
      case '0':
        return 'Nueva';
      default:
        return estado;
    }
  }
  switch (estado) {
    case 0:
      return 'Nueva';
    case 1:
      return 'Recapada';
    case 2:
    case 3:
      return 'Doble Recapada';
    case 4:
      return 'Triple Recapada';
    case 5:
      return 'Emparchada';
    default:
      return '-';
  }
}
