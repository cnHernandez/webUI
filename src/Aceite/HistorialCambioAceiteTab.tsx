import { useEffect, useState } from 'react';
import { listarColectivos } from '../serviceCubierta/listarColectivos';
import { obtenerHistorialCambioAceite } from '../serviceCambioAceite/obtenerHistorialCambioAceite';

export default function HistorialCambioAceiteTab() {
	const [colectivos, setColectivos] = useState<{ idColectivo: number; nroColectivo: string }[]>([]);
	const [selectedNro, setSelectedNro] = useState('');
	const [historial, setHistorial] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [buscado, setBuscado] = useState(false);

	useEffect(() => {
		listarColectivos().then(data => {
			setColectivos(data.map((c: any) => ({ idColectivo: c.IdColectivo, nroColectivo: c.NroColectivo })));
		});
	}, []);

	const handleBuscar = async () => {
		setLoading(true);
		setError('');
		setHistorial([]);
		setBuscado(true);
		const colectivo = colectivos.find(c => c.nroColectivo === selectedNro);
		if (!colectivo) {
			setError('Seleccione un número de colectivo válido.');
			setLoading(false);
			return;
		}
		try {
			const data = await obtenerHistorialCambioAceite(colectivo.idColectivo);
			setHistorial(data);
		} catch (err: any) {
			setError('Error al obtener historial.');
		}
		setLoading(false);
	};

			return (
					<div className="w-full min-h-screen bg-blue-100 flex flex-col items-center justify-center">
							<div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg mb-30">
									<h2 className="text-xl font-bold mb-4 text-black text-center">Historial de Cambios de Aceite por Colectivo</h2>
									<div className="flex flex-col gap-4 mb-6 items-center">
											<label className="font-medium text-black block">Nro. Colectivo:
													<input
															type="text"
															value={selectedNro}
															onChange={e => setSelectedNro(e.target.value)}
															list="colectivo-nros-list"
															className="border border-gray-300 rounded-md p-2 w-20 mt-1 ml-2 text-black"
													/>
													<datalist id="colectivo-nros-list">
															{colectivos.map(c => (
																	<option key={c.idColectivo} value={c.nroColectivo} />
															))}
													</datalist>
											</label>
											<button
													onClick={handleBuscar}
													className="bg-blue-600 text-white py-2 px-6 rounded-md mt-2 font-medium text-base cursor-pointer border-none mx-auto"
													style={{ display: 'block' }}
											>Buscar historial</button>
									</div>
									{loading && <div className="p-4">Cargando historial...</div>}
									{error && <div className="p-4 text-red-600">{error}</div>}
									{historial.length > 0 && (
											<table className="w-full border-collapse text-black mt-6">
													<thead>
															<tr>
																	<th className="border border-gray-300 p-2">Fecha</th>
																	<th className="border border-gray-300 p-2">Kilometros</th>
																	<th className="border border-gray-300 p-2">Filtros cambiados</th>
															</tr>
													</thead>
													<tbody>
															{historial.map((h, i) => (
																	<tr key={i}>
																			<td className="border border-gray-300 p-2 text-center">{h.Fecha ? new Date(h.Fecha).toLocaleString() : '-'}</td>
																			<td className="border border-gray-300 p-2 text-center">{h.Kilometros}</td>
																			<td className="border border-gray-300 p-2 text-center">{h.FiltrosCambiados ? 'Sí' : 'No'}</td>
																	</tr>
															))}
													</tbody>
											</table>
									)}
									{buscado && !loading && !error && historial.length === 0 && selectedNro && (
											<div className="p-4 text-gray-500 text-center">No hay historial para este colectivo.</div>
									)}
							</div>
					</div>
			);
}