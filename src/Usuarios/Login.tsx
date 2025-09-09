
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { loginUsuario } from "../serviceUsuario/login";
import type { UsuarioDto } from "./types";
import logo from '../assets/logo.png';


interface LoginProps {
  onLoginSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [form, setForm] = useState<UsuarioDto>({ nombreUsuario: "", contrasena: "" });
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await loginUsuario(form);
      localStorage.setItem('rolUsuario', result.rol);
      localStorage.setItem('nombreUsuario', form.nombreUsuario);
      if (onLoginSuccess) onLoginSuccess();
      // alert(result.mensaje); // Puedes mostrar el mensaje en App si lo prefieres
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-blue-100">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm w-full mx-auto mt-10 p-6 bg-white rounded shadow">
    <img src={logo} alt="Logo Gomería" className="h-40 w-40 object-contain mx-auto mt-6" />
    <h2 className="text-xl font-bold mb-8 text-center">Iniciar sesión</h2>
        <input
          name="nombreUsuario"
          value={form.nombreUsuario}
          onChange={handleChange}
          placeholder="Usuario"
          required
          className="border p-2 rounded"
        />
        <div className="relative">
          <input
            name="contrasena"
            type={showPassword ? "text" : "password"}
            value={form.contrasena}
            onChange={handleChange}
            placeholder="Contraseña"
            required
            className="border p-2 rounded w-full pr-10"
          />
          <button
            type="button"
            tabIndex={-1}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
        <button type="submit" className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Ingresar</button>
        {error && <div className="text-red-600 text-center">{error}</div>}
      </form>
    </div>
  );
};

export default Login;
