import { useEffect, useState } from "react";
import { listarUsuarios, eliminarUsuario, modificarUsuario } from "../serviceUsuario/usuarios";
import { RolUsuario } from "../models/Usuario";

interface Usuario {
  id: number;
  nombreUsuario: string;
  contraseñaHash: string;
  rol: RolUsuario;
}

export default function ConfiguracionUsuarios() {
  // Estado para modal de creación de usuario
  const [showCrearModal, setShowCrearModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState<{ nombreUsuario: string; contraseña: string; rol: RolUsuario | '' }>({ nombreUsuario: '', contraseña: '', rol: '' });
  const [crearLoading, setCrearLoading] = useState(false);
  // Función para mostrar el nombre del rol
  function mostrarRol(rol: RolUsuario) {
    // Convertir a número si es posible
    const rolNum = typeof rol === 'string' ? Number(rol) : rol;
    if (rolNum === 0) return 'Administrador';
    if (rolNum === 1) return 'Gomeria';
    if (rol === 'Administrador') return 'Administrador';
    if (rol === 'Gomeria') return 'Gomeria';
    return String(rol);
  }
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Usuario>>({});
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string>('');
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [showConfirm, setShowConfirm] = useState<{ id: number | null, nombre: string }>({ id: null, nombre: '' });
  const [eliminarLoading, setEliminarLoading] = useState(false);

  useEffect(() => {
    listarUsuarios()
      .then(setUsuarios)
      .catch(e => setError(e.message));
  }, []);

  const handleEdit = (usuario: Usuario) => {
    setEditId(usuario.id);
    setEditData({ ...usuario });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
  setShowConfirm({ id, nombre: usuarios.find(u => u.id === id)?.nombreUsuario || '' });
  };

  const handleSave = async () => {
    if (!editId || !editData.nombreUsuario || !editData.contraseñaHash || !editData.rol) return;
    try {
      await modificarUsuario(editId, {
        nombreUsuario: editData.nombreUsuario,
        contraseñaHash: editData.contraseñaHash,
        rol: editData.rol
      });
      setUsuarios(usuarios.map(u => u.id === editId ? { ...u, ...editData } as Usuario : u));
      setShowModal(false);
      setEditId(null);
      setEditData({});
      setMensaje('✅ Usuario modificado correctamente');
      setMostrarMensaje(true);
      setTimeout(() => setMostrarMensaje(false), 3000);
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-blue-700">Usuarios</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold shadow hover:bg-blue-700"
          onClick={() => setShowCrearModal(true)}
        >
          Crear Usuario
        </button>
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {/* Mensaje de éxito al modificar */}
      {mostrarMensaje && mensaje && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded-lg text-green-800 text-center font-semibold shadow">
          <span>{mensaje}</span>
        </div>
      )}
      <table className="w-full border">
        <thead>
          <tr className="bg-blue-100">
            {/* <th className="py-2 px-3">ID</th> */}
            <th className="py-2 px-3">Usuario</th>
            <th className="py-2 px-3">Contraseña</th>
            <th className="py-2 px-3">Rol</th>
            <th className="py-2 px-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id} className="border-t">
              {/* <td className="py-2 px-3">{usuario.id}</td> */}
              <td className="py-2 px-3">{usuario.nombreUsuario}</td>
              <td className="py-2 px-3">{usuario.contraseñaHash}</td>
              <td className="py-2 px-3">{mostrarRol(usuario.rol)}</td>
              <td className="py-2 px-3 flex gap-2">
                <button className="text-blue-600 hover:underline" onClick={() => handleEdit(usuario)}>Editar</button>
                <button className="text-red-600 hover:underline" onClick={() => handleDelete(usuario.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de edición */}
      {/* Modal de creación de usuario */}
      {showCrearModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4 text-blue-700">Crear usuario</h3>
            <label className="block mb-2">
              Usuario:
              <input
                className="w-full border rounded px-2 py-1 mt-1"
                value={nuevoUsuario.nombreUsuario}
                onChange={e => setNuevoUsuario(u => ({ ...u, nombreUsuario: e.target.value }))}
                autoFocus
              />
            </label>
            <label className="block mb-2">
              Contraseña:
              <input
                className="w-full border rounded px-2 py-1 mt-1"
                type="password"
                value={nuevoUsuario.contraseña}
                onChange={e => setNuevoUsuario(u => ({ ...u, contraseña: e.target.value }))}
              />
            </label>
            <label className="block mb-4">
              Rol:
              <select
                className="w-full border rounded px-2 py-1 mt-1"
                value={nuevoUsuario.rol}
                onChange={e => setNuevoUsuario(u => ({ ...u, rol: e.target.value as RolUsuario }))}
              >
                <option value="">Seleccione...</option>
                <option value={RolUsuario.Administrador}>Administrador</option>
                <option value={RolUsuario.Gomeria}>Gomeria</option>
              </select>
            </label>
            <div className="flex justify-end gap-2">
              <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setShowCrearModal(false)} disabled={crearLoading}>Cancelar</button>
              <button
                className="px-3 py-1 bg-blue-600 text-white rounded"
                disabled={crearLoading || !nuevoUsuario.nombreUsuario || !nuevoUsuario.contraseña || !nuevoUsuario.rol}
                onClick={async () => {
                  setCrearLoading(true);
                  setError(null);
                  try {
                    // Usar función del service
                    const { registrarUsuario, listarUsuarios } = await import("../serviceUsuario/usuarios");
                    await registrarUsuario({
                      nombreUsuario: nuevoUsuario.nombreUsuario,
                      contraseña: nuevoUsuario.contraseña,
                      rol: nuevoUsuario.rol
                    });
                    setMensaje('✅ Usuario creado correctamente');
                    setMostrarMensaje(true);
                    setTimeout(() => setMostrarMensaje(false), 3000);
                    setShowCrearModal(false);
                    setNuevoUsuario({ nombreUsuario: '', contraseña: '', rol: '' });
                    // Refrescar lista
                    const lista = await listarUsuarios();
                    setUsuarios(lista);
                  } catch (e: any) {
                    setError(e.message);
                  }
                  setCrearLoading(false);
                }}
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 w-96">
            <h3 className="text-lg font-bold mb-4 text-blue-700">Editar usuario</h3>
            <label className="block mb-2">
              Usuario:
              <input className="w-full border rounded px-2 py-1 mt-1" value={editData.nombreUsuario || ''} onChange={e => setEditData(d => ({ ...d, nombreUsuario: e.target.value }))} />
            </label>
            <label className="block mb-2">
              Contraseña:
              <input className="w-full border rounded px-2 py-1 mt-1" value={editData.contraseñaHash || ''} onChange={e => setEditData(d => ({ ...d, contraseñaHash: e.target.value }))} />
            </label>
            <label className="block mb-4">
              Rol:
              <select className="w-full border rounded px-2 py-1 mt-1" value={editData.rol || ''} onChange={e => setEditData(d => ({ ...d, rol: e.target.value as RolUsuario }))}>
                <option value="">Seleccione...</option>
                <option value={RolUsuario.Administrador}>Administrador</option>
                <option value={RolUsuario.Gomeria}>Gomeria</option>
              </select>
            </label>
            <div className="flex justify-end gap-2">
              <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={handleSave}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación personalizado para eliminar */}
      {showConfirm.id !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full text-center">
            <h3 className="text-lg font-bold mb-2 text-red-700">Confirmar eliminación de usuario</h3>
            <p className="mb-4 text-gray-700">¿Está seguro que desea eliminar el usuario <span className="font-semibold">{showConfirm.nombre}</span>? Esta acción no se puede deshacer.</p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={async () => {
                  if (!showConfirm.id) return;
                  setEliminarLoading(true);
                  try {
                    await eliminarUsuario(showConfirm.id);
                    setUsuarios(usuarios.filter(u => u.id !== showConfirm.id));
                    setShowConfirm({ id: null, nombre: '' });
                    setMensaje('✅ Usuario eliminado correctamente');
                    setMostrarMensaje(true);
                    setTimeout(() => setMostrarMensaje(false), 3000);
                  } catch (e: any) {
                    setError(e.message);
                  }
                  setEliminarLoading(false);
                }}
                disabled={eliminarLoading}
              >
                Confirmar Eliminación
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                onClick={() => setShowConfirm({ id: null, nombre: '' })}
                disabled={eliminarLoading}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
