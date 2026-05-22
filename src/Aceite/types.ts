export type EstadoCubierta = 'Nueva' | 'Recapada' | 'DobleRecapada' | 'TripleRecapada' | 'EnReparacion' | 'Emparchada';
export type Cubierta = {
	IdCubierta: number;
	NroSerie: string;
	Marca: string;
	Medida: string;
	FechaCompra: string;
	Estado: EstadoCubierta;
	FechaEmparchada?: string;
};

export type Colectivo = {
	IdColectivo: number;
	NroColectivo: string;
	Patente: string;
	Marca: string;
	Modelo?: string;
	Año: number;
	Estado: 'Activo' | 'FueraDeServicio' | 'DarDeBaja';
};

export type UbicacionCubierta = {
	IdUbicacion: number;
	Descripcion: string;
};