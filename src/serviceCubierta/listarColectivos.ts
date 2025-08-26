import type { Colectivo } from '../models/Colectivo';

export async function listarColectivos(): Promise<Colectivo[]> {
  try {
    const response = await fetch('http://localhost:5058/api/colectivos');
    if (response.ok) {
      const data = await response.json();
      return data.map((c: any) => ({
        IdColectivo: c.idColectivo,
        NroColectivo: c.nroColectivo,
        Patente: c.patente,
        Marca: c.marca,
        Modelo: c.modelo,
        Año: c.año,
        Estado: c.estado // Si necesitas mapear el número a string, avísame
      }));
    }
    return [];
  } catch {
    return [];
  }
}
