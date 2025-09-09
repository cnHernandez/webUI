export async function registrarUsuario({ nombreUsuario, contrasena, rol }: { nombreUsuario: string; contrasena: string; rol: number | string }) {
  const body = {
    nombreUsuario,
    contrasena,
    rol: typeof rol === 'string' ? (rol === "Administrador" ? 0 : rol === "Gomeria" ? 1 : Number(rol)) : rol
  };
  const response = await fetch("http://localhost:5058/api/usuarios/registrar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error(await response.text());
  return response.text();
}
import type { Usuario } from "../models/Usuario";

export async function listarUsuarios(): Promise<Usuario[]> {
  const response = await fetch("http://localhost:5058/api/usuarios/listado");
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
  const response = await fetch(`http://localhost:5058/api/usuarios/baja/${id}`, {
    method: "DELETE"
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
  const response = await fetch(`http://localhost:5058/api/usuarios/modificar/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error(await response.text());
  return response.text();
}
