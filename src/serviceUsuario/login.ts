

import type { UsuarioDto } from "../Usuarios/types";
import { getApiKeyHeaders } from '../utilsApiKey';

export async function loginUsuario(usuario: UsuarioDto) {
  const apiHost = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' ? 'http://localhost:5058' : 'http://api:80');
  const response = await fetch(`${apiHost}/api/usuarios/login`, {
    method: "POST",
    headers: getApiKeyHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(usuario),
  });
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return response.json();
}
