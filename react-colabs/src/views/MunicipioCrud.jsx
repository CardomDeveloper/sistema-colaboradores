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

export default function MunicipioCrud() {
  const [municipios, setMunicipios] = useState([]);
  const [nombre, setNombre] = useState("");
  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  const obtenerMunicipios = async () => {
    try {
      const { data } = await clienteAxios("/api/municipios");
      setMunicipios(data.data);
    } catch (e) {
      console.log("GET municipios error:", e?.response?.status, e?.response?.data);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: e?.response?.data?.message || "No se pudo cargar municipios",
      });
    }
  };

  useEffect(() => {
    obtenerMunicipios();
  }, []);

  const guardarMunicipio = async (e) => {
    e.preventDefault();

    const n = nombre.trim();
    if (!n) {
      toast("warning", "Escriba el nombre del municipio");
      return;
    }

    try {
      if (editando) {
        await clienteAxios.put(`/api/municipios/${idEditar}`, {
          nombre: n,
          activo: true,
        });
        toast("success", "Municipio actualizado ✅");
      } else {
        await clienteAxios.post("/api/municipios", { nombre: n });
        toast("success", "Municipio guardado ✅");
      }

      setNombre("");
      setEditando(false);
      setIdEditar(null);

      // refresca seguro (backend filtra activos)
      await obtenerMunicipios();
    } catch (e) {
      console.log("SAVE municipio error:", e?.response?.status, e?.response?.data);
      const msg = e?.response?.data?.message || "No se pudo guardar";
      Swal.fire({ icon: "error", title: "Error", text: msg });
    }
  };

  const editarMunicipio = (municipio) => {
    setEditando(true);
    setIdEditar(municipio.id);
    setNombre(municipio.nombre ?? "");
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setIdEditar(null);
    setNombre("");
    toast("info", "Edición cancelada");
  };

  const eliminarMunicipio = async (municipio) => {
    const result = await Swal.fire({
      title: "¿Desactivar municipio?",
      text: `Se desactivará: ${municipio.nombre}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await clienteAxios.delete(`/api/municipios/${municipio.id}`);
      toast("success", "Municipio desactivado ✅");
      await obtenerMunicipios();
    } catch (e) {
      console.log("DELETE municipio error:", e?.response?.status, e?.response?.data);
      const msg = e?.response?.data?.message || "No se pudo eliminar";
      Swal.fire({ icon: "error", title: "Error", text: msg });
    }
  };

  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Mantenimiento Municipios</h2>

      {/* FORM */}
      <form onSubmit={guardarMunicipio} className="flex flex-col md:flex-row gap-2 mb-6">
        <input
          type="text"
          placeholder="Nombre del municipio"
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

      {/* TABLA */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Nombre</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {municipios.map((municipio) => (
              <tr key={municipio.id} className="border-t">
                <td className="p-2">{municipio.nombre}</td>
                <td className="p-2 text-center space-x-2">
                  <button
                    type="button"
                    onClick={() => editarMunicipio(municipio)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => eliminarMunicipio(municipio)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {municipios.length === 0 && (
              <tr>
                <td className="p-4 text-gray-600" colSpan={2}>
                  No hay municipios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
