import { getApiKeyHeaders } from '../utilsApiKey';

export async function registrarUsuario({ nombreUsuario, contrasena, rol }: { nombreUsuario: string; contrasena: string; rol: number | string }) {
  const body = {
    nombreUsuario,
    contrasena,
    rol: typeof rol === 'string' ? (rol === "Administrador" ? 0 : rol === "Gomeria" ? 1 : Number(rol)) : rol
  };
  const apiHost = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5058' : 'http://api:80');
  const response = await fetch(`${apiHost}/api/usuarios/registrar`, {
    method: "POST",
    headers: getApiKeyHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error(await response.text());
  return response.text();
}
import type { Usuario } from "../models/Usuario";

export async function listarUsuarios(): Promise<Usuario[]> {
  const apiHost = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5058' : 'http://api:80');
  const response = await fetch(`${apiHost}/api/usuarios/listado`, {
    headers: getApiKeyHeaders()
  });
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
  const apiHost = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5058' : 'http://api:80');
  const response = await fetch(`${apiHost}/api/usuarios/baja/${id}`, {
    method: "DELETE",
    headers: getApiKeyHeaders()
  });
  if (!response.ok) throw new Error(await response.text());
  return response.text();
}

export async function modificarUsuario(id: number, usuario: Omit<Usuario, 'id'>) {
  const body = {
    nombreUsuario: usuario.nombreUsuario,
    contrasena: usuario.contrasena,
    rol: usuario.rol === "Administrador" ? 0 : 1
  };
  const apiHost = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5058' : 'http://api:80');
  const response = await fetch(`${apiHost}/api/usuarios/modificar/${id}`, {
    method: "PUT",
    headers: getApiKeyHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error(await response.text());
  return response.text();
}
