import { apiService } from '../utils/apiService';
import type { Usuario } from "../models/Usuario";

export async function registrarUsuario({ nombreUsuario, contrasena, rol }: { nombreUsuario: string; contrasena: string; rol: number | string }) {
  const body = {
    nombreUsuario,
    contrasena,
    rol: typeof rol === 'string' ? (rol === "Administrador" ? 0 : rol === "Gomeria" ? 1 : Number(rol)) : rol
  };
  const response = await apiService(`${import.meta.env.VITE_API_BASE_URL}/api/usuarios/registrar`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error(await response.text());
  return response.text();
}

export async function listarUsuarios(): Promise<Usuario[]> {
  const response = await apiService(`${import.meta.env.VITE_API_BASE_URL}/api/usuarios/listado`);
  if (!response.ok) throw new Error(await response.text());
  const data = await response.json();
  // Mapear Contraseña a contrasena
  return data.map((u: any) => ({
    id: u.id,
    nombreUsuario: u.nombreUsuario,
    contrasena: u.contrasena,
    rol: u.rol
  }));
}

export async function eliminarUsuario(id: number) {
  const response = await apiService(`${import.meta.env.VITE_API_BASE_URL}/api/usuarios/baja/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error(await response.text());
}

export async function modificarUsuario(id: number, data: { nombreUsuario: string; contrasena: string; rol: number | string }) {
  const response = await apiService(`${import.meta.env.VITE_API_BASE_URL}/api/usuarios/modificar/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error(await response.text());
  return response.text();
}
