
export const RolUsuario = {
  Administrador: "Administrador",
  Gomeria: "Gomeria"
} as const;
export type RolUsuario = typeof RolUsuario[keyof typeof RolUsuario];

export interface Usuario {
  id: number;
  nombreUsuario: string;
  contraseñaHash: string;
  rol: RolUsuario;
}
