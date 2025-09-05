import type { RolUsuario } from "../models/Usuario";

export function getOpcionesPorRol(rol: RolUsuario): string[] {
  if (rol === "Administrador") {
    return [
      "Ingreso",
      "Rotación",
      "Stock",
      "Cubiertas",
      "Colectivos",
      "Historial",
      "Usuarios"
    ];
  }
  if (rol === "Gomeria") {
    return ["Ingreso", "Rotación", "Stock"];
  }
  return [];
}
