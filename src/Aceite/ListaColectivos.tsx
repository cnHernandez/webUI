import { useEffect, useState } from 'react';
import HistorialCambioAceiteTab from './HistorialCambioAceiteTab';
import { listarColectivos } from '../serviceCubierta/listarColectivos';
import { obtenerHistorialCambioAceite } from '../serviceCambioAceite/obtenerHistorialCambioAceite';
import { registrarCambioAceite } from '../serviceCambioAceite/registrarCambioAceite';
import type { Colectivo } from '../models/Colectivo';

interface ListaColectivosProps {
	tab?: 'listado' | 'historial';
}

const ListaColectivos: React.FC<ListaColectivosProps> = ({ tab = 'listado' }) => {
		const [colectivos, setColectivos] = useState<Colectivo[]>([]);
		// Guardar el último cambio como objeto { kilometros, fecha }
		const [ultimoCambio, setUltimoCambio] = useState<Record<number, { kilometros: number; fecha: string }>>({});
	const [modal, setModal] = useState<null | { colectivoId: number; kilometros: number }>(null);
	const [form, setForm] = useState({
		cambioAceite: true,
		cambioFiltros: false,
		fecha: '',
	});
	const [enviando, setEnviando] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [exito, setExito] = useState(false);
	const [filtroNro, setFiltroNro] = useState('');
	const [filtroProximos, setFiltroProximos] = useState(false);

	// Manejo de formulario modal
	const abrirModal = (colectivoId: number, kilometros: number) => {
		const hoy = new Date();
		const yyyy = hoy.getFullYear();
		const mm = String(hoy.getMonth() + 1).padStart(2, '0');
		const dd = String(hoy.getDate()).padStart(2, '0');
		const fechaActual = `${yyyy}-${mm}-${dd}`;
		setModal({ colectivoId, kilometros });
		setForm({ cambioAceite: true, cambioFiltros: false, fecha: fechaActual });
		setError(null);
		setExito(false);
	};
			const recargarDatos = async () => {
				const data = await listarColectivos();
				setColectivos(data);
				const cambios: { [id: number]: { kilometros: number, fecha: string } } = {};
				await Promise.all(
					data.map(async (c: Colectivo) => {
						try {
							const historial = await obtenerHistorialCambioAceite(c.IdColectivo);
							if (Array.isArray(historial) && historial.length > 0) {
								// Buscar el registro con mayor kilometraje (último cambio real)
								const ultimo = historial.reduce((max, curr) => curr.kilometros > max.kilometros ? curr : max, historial[0]);
								cambios[c.IdColectivo] = { kilometros: ultimo.kilometros, fecha: ultimo.fecha };
							}
						} catch {}
					})
				);
				setUltimoCambio(cambios);
			};
		const cerrarModal = () => setModal(null);
	const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, type, checked, value } = e.target;
		setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
	};
		const handleSubmit = async (e: React.FormEvent) => {
			e.preventDefault();
			if (!modal) return;
			setEnviando(true);
			setError(null);
			try {
				await registrarCambioAceite({
					ColectivoId: modal.colectivoId,
					Fecha: form.fecha,
					Kilometros: modal.kilometros,
					FiltrosCambiados: form.cambioFiltros,
				});
				setExito(true);
				setTimeout(async () => {
					cerrarModal();
					await recargarDatos();
				}, 1200);
			} catch (err: any) {
				setError(err.message || 'Error al registrar el cambio');
			} finally {
				setEnviando(false);
			}
		};

			useEffect(() => {
				listarColectivos().then(async (data) => {
					setColectivos(data);
					// Para cada colectivo, obtener el historial completo y guardar el último cambio (mayor kilometraje)
					const cambios: { [id: number]: { kilometros: number, fecha: string } } = {};
					await Promise.all(
						data.map(async (c: Colectivo) => {
							try {
								const historial = await obtenerHistorialCambioAceite(c.IdColectivo);
								if (Array.isArray(historial) && historial.length > 0) {
									const ultimo = historial.reduce((max, curr) => curr.kilometros > max.kilometros ? curr : max, historial[0]);
									cambios[c.IdColectivo] = { kilometros: ultimo.kilometros, fecha: ultimo.fecha };
								}
							} catch {}
						})
					);
					setUltimoCambio(cambios);
				});
			}, []);

		// Filtro de colectivos
		let colectivosFiltrados = colectivos
			.filter((c) => {
				if (filtroNro && !String(c.NroColectivo).includes(filtroNro)) return false;
				if (filtroProximos) {
					const cambio = ultimoCambio[c.IdColectivo];
					const kmUltimo: number = typeof cambio?.kilometros === 'number' && !isNaN(cambio.kilometros) ? cambio.kilometros : 0;
					const kmActual: number = typeof c.Kilometraje === 'number' && !isNaN(c.Kilometraje) ? c.Kilometraje : 0;
					const kmDesdeCambio: number = kmActual - kmUltimo;
					if (kmDesdeCambio < 14000) return false;
				}
				return true;
			})
			// Ordenar de mayor a menor kilometraje
			.sort((a, b) => (b.Kilometraje ?? 0) - (a.Kilometraje ?? 0));
			// No limitar, solo mostrar el scroll

	return (
		<div className="w-full bg-blue-100 py-4">
			<div className="max-w-4xl h-screen mx-auto p-8 bg-white rounded-xl shadow-lg overflow-visible">
				{/* Las tabs ahora se controlan desde App.tsx */}
				{tab === 'listado' && (
					<div>
						<h2 className="text-xl font-bold mb-4 text-center">Listado de Colectivos</h2>
						{/* Filtros estilo stockCubierta */}
						<div className="flex flex-row justify-center gap-16 mb-6 items-center">
							{/* Filtro 1: Nro Colectivo */}
							<div className="bg-white rounded shadow p-3 flex flex-col items-center min-w-[180px]">
								<label className="font-medium mb-1">Nro Colectivo</label>
								<input
									type="text"
									value={filtroNro}
									onChange={e => setFiltroNro(e.target.value)}
									placeholder="Filtrar por colectivo..."
									className="border rounded px-2 py-1 w-full"
								/>
							</div>
							{/* Filtro 2: Próximos a cambio */}
							<div className="bg-white rounded shadow p-3 flex flex-col items-center min-w-[180px]">
								<label className="flex items-center gap-2">
									<input
										type="checkbox"
										checked={filtroProximos}
										onChange={e => setFiltroProximos(e.target.checked)}
									/>
									<span className="font-medium">Próximos a cambio</span>
								</label>
								<span className="text-xs text-gray-500 mt-1">&gt; 14000 km</span>
							</div>
						</div>
						{/* Scroll solo a la tabla, altura para mostrar 10 filas aprox. */}
						<div className="overflow-x-auto max-h-[450px] overflow-y-auto rounded border border-gray-200">
							<table className="w-full border-collapse text-black">
								<thead className="sticky top-0 bg-white z-10">
									<tr>
										<th className="border border-gray-300 p-2 text-center">Nro Colectivo</th>
										<th className="border border-gray-300 p-2 text-center">Patente</th>
										<th className="border border-gray-300 p-2 text-center">Modelo</th>
										<th className="border border-gray-300 p-2 text-center">Kilometraje</th>
										<th className="border border-gray-300 p-2 text-center">Km Último Cambio</th>
										<th className="border border-gray-300 p-2 text-center">Acciones</th>
									</tr>
								</thead>
								<tbody>
									{colectivosFiltrados.map((c) => {
																				const cambio = ultimoCambio[c.IdColectivo];
																				  const kmUltimo: number = typeof cambio?.kilometros === 'number' && !isNaN(cambio.kilometros) ? cambio.kilometros : 0;
																				  const fechaUltimo: string = typeof cambio?.fecha === 'string' ? cambio.fecha : '';
																				  const kmActual: number = typeof c.Kilometraje === 'number' && !isNaN(c.Kilometraje) ? c.Kilometraje : 0;
																				  const kmDesdeCambio: number = kmActual - kmUltimo;
																				let rowClass = '';
																				// Colores:
																				// Rojo: >15000 km
																				// Amarillo: >=14000 km y <=15000 km
																				// Verde: desde el último cambio hasta <14000 km (incluye ok y normal)
																				const hoy = new Date().toISOString().slice(0, 10);
																				const esCambioHoy = fechaUltimo.slice(0, 10) === hoy;
																				if (kmUltimo === kmActual && esCambioHoy) {
																					rowClass = 'bg-green-500';
																				} else if (kmDesdeCambio > 15000) {
																					rowClass = 'bg-red-500';
																				} else if (kmDesdeCambio >= 14000) {
																					rowClass = 'bg-yellow-500';
																				} else {
																					rowClass = 'bg-green-500';
																				}
										return (
											<tr key={c.IdColectivo} className={rowClass}>
												<td className="border border-gray-300 p-2 text-center">{c.NroColectivo}</td>
												<td className="border border-gray-300 p-2 text-center">{c.Patente}</td>
												<td className="border border-gray-300 p-2 text-center">{c.Modelo || '-'}</td>
												<td className="border border-gray-300 p-2 text-center">{c.Kilometraje ?? '-'}</td>
												  <td className="border border-gray-300 p-2 text-center">{kmUltimo}</td>
												<td className="border border-gray-300 p-2 text-center">
													<button
														className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
														onClick={() => abrirModal(c.IdColectivo, c.Kilometraje ?? 0)}
													>
														Realizar cambio
													</button>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</div>
				)}
				{tab === 'historial' && <HistorialCambioAceiteTab />}
			</div>

			{/* Modal de cambio de aceite */}
			{modal && (
				<div className="fixed inset-0 bg-white bg-opacity-10 flex items-center justify-center z-50 transition-all">
					<div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] max-w-[90vw] relative border">
						<button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={cerrarModal}>&times;</button>
						<h3 className="text-lg font-bold mb-4">Registrar cambio de aceite</h3>
						<form onSubmit={handleSubmit} className="flex flex-col gap-4">
							<div>
								<label className="font-medium">Cambio de aceite</label>
								<input type="checkbox" name="cambioAceite" checked={form.cambioAceite} onChange={handleFormChange} className="ml-2" disabled />
								<span className="text-xs text-gray-500 ml-2">(Obligatorio)</span>
							</div>
							<div>
								<label className="font-medium">Cambio de filtros</label>
								<input type="checkbox" name="cambioFiltros" checked={form.cambioFiltros} onChange={handleFormChange} className="ml-2" />
							</div>
							<div>
								<label className="font-medium">Fecha de cambio</label>
								<input type="date" name="fecha" value={form.fecha.slice(0,10)} onChange={handleFormChange} className="ml-2 border rounded px-2 py-1" required />
							</div>
							<div>
								<label className="font-medium">Kilometraje actual</label>
								<input type="number" value={modal.kilometros} readOnly className="ml-2 border rounded px-2 py-1 bg-gray-100" />
							</div>
							{error && <div className="text-red-600 text-sm">{error}</div>}
							{exito && (
								<div className="mt-2 p-3 bg-green-100 border border-green-400 rounded-lg text-green-800 text-center font-semibold shadow transition-all">
									¡Cambio registrado!
								</div>
							)}
							<button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" disabled={enviando}>
								{enviando ? 'Enviando...' : 'Registrar'}
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default ListaColectivos;