import { useEffect, useState } from "react";
import clienteAxios from "../config/axios";
import Swal from "sweetalert2";

const toast = (icon, title) => {
  return Swal.fire({
    toast: true,
    position: "top-end",
    icon,
    title,
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
  });
};

export default function DepartamentosCrud() {
  const [departamentos, setDepartamentos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  const obtenerDepartamentos = async () => {
    try {
      const { data } = await clienteAxios("/api/departamentos");
      setDepartamentos(data.data);
    } catch (e) {
      console.log("GET departamentos error:", e?.response?.status, e?.response?.data);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: e?.response?.data?.message || "No se pudo cargar departamentos",
      });
    }
  };

  useEffect(() => {
    obtenerDepartamentos();
  }, []);

  const guardarDepartamento = async (e) => {
    e.preventDefault();

    const n = nombre.trim();
    if (!n) {
      toast("warning", "Escriba el nombre del departamento");
      return;
    }

    try {
      if (editando) {
        await clienteAxios.put(`/api/departamentos/${idEditar}`, {
          nombre: n,
          activo: true,
        });

        toast("success", "Departamento actualizado ");
      } else {
        await clienteAxios.post("/api/departamentos", { nombre: n });
        toast("success", "Departamento guardado ");
      }

      setNombre("");
      setEditando(false);
      setIdEditar(null);

  
      await obtenerDepartamentos();
    } catch (e) {
      console.log("SAVE departamento error:", e?.response?.status, e?.response?.data);
      const msg = e?.response?.data?.message || "No se pudo guardar";
      Swal.fire({ icon: "error", title: "Error", text: msg });
    }
  };

  const editarDepartamento = (departamento) => {
    setEditando(true);
    setIdEditar(departamento.id);
    setNombre(departamento.nombre ?? "");
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setIdEditar(null);
    setNombre("");
    toast("info", "Edición cancelada");
  };

  const eliminarDepartamento = async (departamento) => {
    const result = await Swal.fire({
      title: "¿Desactivar departamento?",
      text: `Se desactivará: ${departamento.nombre}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await clienteAxios.delete(`/api/departamentos/${departamento.id}`);
      toast("success", "Departamento desactivado");
      await obtenerDepartamentos();
    } catch (e) {
      console.log("DELETE departamento error:", e?.response?.status, e?.response?.data);
      const msg = e?.response?.data?.message || "No se pudo eliminar";
      Swal.fire({ icon: "error", title: "Error", text: msg });
    }
  };

  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Mantenimiento Departamentos</h2>

      {/* frmm */}
      <form onSubmit={guardarDepartamento} className="flex flex-col md:flex-row gap-2 mb-6">
        <input
          type="text"
          placeholder="Nombre del departamento"
          className="border p-2 flex-1 rounded"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <button
          type="submit"
          className="px-4 py-2 rounded font-bold text-white bg-green-600 hover:bg-green-700"
        >
          {editando ? "Actualizar" : "Agregar"}
        </button>

        {editando && (
          <button
            type="button"
            onClick={cancelarEdicion}
            className="border px-4 py-2 rounded font-bold"
          >
            Cancelar
          </button>
        )}
      </form>

      {/* tabla */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {departamentos.map((departamento) => (
              <tr key={departamento.id} className="border-t">
                <td className="p-2">{departamento.nombre}</td>
                <td className="p-2 text-center space-x-2">
                  <button
                    type="button"
                    onClick={() => editarDepartamento(departamento)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => eliminarDepartamento(departamento)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {departamentos.length === 0 && (
              <tr>
                <td className="p-4 text-gray-600" colSpan={2}>
                  No hay departamentos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
