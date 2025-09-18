import type { UsuarioDto } from "../Usuarios/types";
import { apiService } from '../utils/apiService';

export async function loginUsuario(usuario: UsuarioDto) {
  const response = await apiService(`${import.meta.env.VITE_API_BASE_URL}/api/usuarios/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json();
}
