
import type { UsuarioDto } from "../Usuarios/types";

export async function loginUsuario(usuario: UsuarioDto) {
  const response = await fetch("http://localhost:5058/api/usuarios/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json();
}
