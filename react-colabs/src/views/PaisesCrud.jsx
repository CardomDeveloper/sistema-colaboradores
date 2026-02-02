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

export default function PaisesCrud() {
  const [paises, setPaises] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  const obtenerPaises = async () => {
    const { data } = await clienteAxios("/api/paises");
    setPaises(data.data);
  };

  useEffect(() => {
    obtenerPaises();
  }, []);

  const guardarPais = async (e) => {
    e.preventDefault();

    const nombreLimpio = nombre.trim();
    if (!nombreLimpio) {
      toast("warning", "Escriba el nombre del país");
      return;
    }

    try {
      if (editando) {
        await clienteAxios.put(`/api/paises/${idEditar}`, {
          nombre: nombreLimpio,
          activo: true,
        });
        toast("success", "País actualizado");
      } else {
        await clienteAxios.post("/api/paises", { nombre: nombreLimpio });
        toast("success", "País guardado");
      }

      setNombre("");
      setEditando(false);
      setIdEditar(null);
      await obtenerPaises();
    } catch (e2) {
      console.log("SAVE ERROR:", e2?.response?.status, e2?.response?.data);
      const msg = e2?.response?.data?.message || "Error al guardar";
      Swal.fire({ icon: "error", title: "Error", text: msg });
    }
  };

  const editarPais = (pais) => {
    setEditando(true);
    setIdEditar(pais.id);
    setNombre(pais.nombre ?? "");
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setIdEditar(null);
    setNombre("");
    toast("info", "Edición cancelada");
  };

  const eliminarPais = async (pais) => {
    const result = await Swal.fire({
      title: "¿Desactivar país?",
      text: `Se desactivará: ${pais.nombre}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await clienteAxios.delete(`/api/paises/${pais.id}`);
      toast("success", "País desactivado");
      await obtenerPaises();
    } catch (e) {
      console.log("DELETE ERROR:", e?.response?.status, e?.response?.data);
      const msg = e?.response?.data?.message || "Error al eliminar";
      Swal.fire({ icon: "error", title: "Error", text: msg });
    }
  };

  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Mantenimiento Países</h2>

      {/* form */}
      <form onSubmit={guardarPais} className="flex flex-col md:flex-row gap-2 mb-6">
        <input
          type="text"
          placeholder="Nombre del país"
          className="border p-2 flex-1 rounded"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-bold">
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

      {/* listaa */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paises.map((pais) => (
              <tr key={pais.id} className="border-t">
                <td className="p-2">{pais.nombre}</td>
                <td className="p-2 text-center space-x-2">
                  <button
                    type="button"
                    onClick={() => editarPais(pais)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => eliminarPais(pais)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {paises.length === 0 && (
              <tr>
                <td className="p-4 text-gray-600" colSpan={2}>
                  No hay países registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
