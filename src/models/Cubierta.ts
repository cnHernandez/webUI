export type EstadoCubierta = 'Nueva' | 'Recapada' | 'DobleRecapada' | 'EnReparacion' | 0 | 1 | 2 | 3 | string | number;
export type EstadoCubiertaInfo = {
  Estado: string;
  FechaRecapada?: string;
  FechaDobleRecapada?: string;
  MotivoCambio?: string;
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
  fechaReparacion?: string;
  idColectivo?: number;
  idUbicacion?: number;
  ubicacionDescripcion?: string;
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
      case 'EnReparacion':
      case 'En Reparacion':
      case 'enReparacion':
      case 'en reparacion':
        return 'En Reparación';
      case '3':
        return 'Doble Recapada';
      case '2':
        return 'Doble Recapada';
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
    default:
      return '-';
  }
}
