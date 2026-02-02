import Swal from "sweetalert2";
import { useEffect, useMemo, useState } from "react";
import clienteAxios from "../config/axios";

const emptyForm = {
  empresa_id: "",
  nombre_completo: "",
  edad: "",
  telefono: "",
  correo: "",
};

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

export default function ColaboradoresCrud() {
  const [colaboradores, setColaboradores] = useState([]);
  const [empresas, setEmpresas] = useState([]);

  const [form, setForm] = useState(emptyForm);
  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);
  const [error, setError] = useState("");

  // fetchers
  const obtenerEmpresas = async () => {
    const { data } = await clienteAxios("/api/empresas");
    setEmpresas(data.data);
  };

  const obtenerColaboradores = async () => {
    const { data } = await clienteAxios("/api/colaboradores");
    setColaboradores(data.data);
  };

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([obtenerEmpresas(), obtenerColaboradores()]);
      } catch (e) {
        console.log(e);
        setError("No se pudo cargar la información.");
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo cargar la información.",
        });
      }
    })();
  }, []);

  const empresaSeleccionada = useMemo(() => {
    if (!form.empresa_id) return null;
    return empresas.find((e) => String(e.id) === String(form.empresa_id)) || null;
  }, [empresas, form.empresa_id]);

  // crud
  const guardarColaborador = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.empresa_id) {
      setError("Seleccione una empresa.");
      toast("warning", "Seleccione una empresa");
      return;
    }

    if (!form.nombre_completo.trim()) {
      setError("Nombre completo es obligatorio.");
      toast("warning", "Nombre completo es obligatorio");
      return;
    }

    const edadNum = Number(form.edad);
    if (!Number.isFinite(edadNum) || edadNum < 0 || edadNum > 120) {
      setError("Edad inválida (0-120).");
      toast("warning", "Edad inválida (0-120)");
      return;
    }

    try {
      const payload = {
        empresa_id: Number(form.empresa_id),
        nombre_completo: form.nombre_completo.trim(),
        edad: edadNum,
        telefono: form.telefono.trim() || null,
        correo: form.correo.trim() || null,
        activo: true,
      };

      if (editando) {
        await clienteAxios.put(`/api/colaboradores/${idEditar}`, payload);
        toast("success", "Colaborador actualizado ");
      } else {
        await clienteAxios.post(`/api/colaboradores`, payload);
        toast("success", "Colaborador guardado ");
      }

      setForm(emptyForm);
      setEditando(false);
      setIdEditar(null);
      await obtenerColaboradores();
    } catch (e2) {
      console.log("SAVE colaborador error:", e2?.response?.status, e2?.response?.data);
      const msg = e2?.response?.data?.message || "Error al guardar colaborador.";
      setError(msg);
      Swal.fire({ icon: "error", title: "Error", text: msg });
    }
  };

  const editarColaborador = (c) => {
    setEditando(true);
    setIdEditar(c.id);

    setForm({
      empresa_id: String(c.empresa_id ?? ""),
      nombre_completo: c.nombre_completo ?? "",
      edad: String(c.edad ?? ""),
      telefono: c.telefono ?? "",
      correo: c.correo ?? "",
    });
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setIdEditar(null);
    setForm(emptyForm);
    setError("");
    toast("info", "Edición cancelada");
  };

  const eliminarColaborador = async (c) => {
    const result = await Swal.fire({
      title: "¿Desactivar colaborador?",
      text: `Se desactivará: ${c.nombre_completo}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await clienteAxios.delete(`/api/colaboradores/${c.id}`);
      toast("success", "Colaborador desactivado ");
      await obtenerColaboradores();
    } catch (e) {
      console.log("DELETE colaborador error:", e?.response?.status, e?.response?.data);
      const msg = e?.response?.data?.message || "No se pudo eliminar";
      Swal.fire({ icon: "error", title: "Error", text: msg });
    }
  };

  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Mantenimiento Colaboradores</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-3 rounded">
          {error}
        </div>
      )}

      {/* form */}
      <form
        onSubmit={guardarColaborador}
        className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6"
      >
        {/* Datos de empresa */}
        <div className="md:col-span-3">
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Empresa
          </label>
          <select
            className="border p-2 rounded w-full"
            value={form.empresa_id}
            onChange={(e) => setForm({ ...form, empresa_id: e.target.value })}
          >
            <option value="">Seleccione empresa</option>
            {empresas.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.razon_social} ({emp.nit})
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-3">
          <p className="text-sm font-bold text-gray-700 mb-2">
            Datos de la empresa (solo lectura)
          </p>
        </div>

        <input
          disabled
          className="border p-2 rounded bg-gray-100"
          placeholder="País"
          value={empresaSeleccionada?.pais_nombre ?? empresaSeleccionada?.pais_id ?? ""}
        />
        <input
          disabled
          className="border p-2 rounded bg-gray-100"
          placeholder="Departamento"
          value={
            empresaSeleccionada?.departamento_nombre ??
            empresaSeleccionada?.departamento_id ??
            ""
          }
        />
        <input
          disabled
          className="border p-2 rounded bg-gray-100"
          placeholder="Municipio"
          value={
            empresaSeleccionada?.municipio_nombre ??
            empresaSeleccionada?.municipio_id ??
            ""
          }
        />

        <input
          disabled
          className="border p-2 rounded bg-gray-100"
          placeholder="NIT"
          value={empresaSeleccionada?.nit ?? ""}
        />
        <input
          disabled
          className="border p-2 rounded bg-gray-100 md:col-span-2"
          placeholder="Razón Social"
          value={empresaSeleccionada?.razon_social ?? ""}
        />

        <input
          disabled
          className="border p-2 rounded bg-gray-100 md:col-span-2"
          placeholder="Nombre Comercial"
          value={empresaSeleccionada?.nombre_comercial ?? ""}
        />
        <input
          disabled
          className="border p-2 rounded bg-gray-100"
          placeholder="Teléfono Empresa"
          value={empresaSeleccionada?.telefono ?? ""}
        />

        <input
          disabled
          className="border p-2 rounded bg-gray-100 md:col-span-2"
          placeholder="Correo Empresa"
          value={empresaSeleccionada?.correo ?? ""}
        />

        {/* colaborador */}
        <div className="md:col-span-3 mt-2">
          <p className="text-sm font-bold text-gray-700 mb-2">
            Datos del colaborador
          </p>
        </div>

        <input
          className="border p-2 rounded md:col-span-2"
          placeholder="Nombre completo"
          value={form.nombre_completo}
          onChange={(e) => setForm({ ...form, nombre_completo: e.target.value })}
        />

        <input
          className="border p-2 rounded"
          placeholder="Edad"
          type="number"
          min="0"
          max="120"
          value={form.edad}
          onChange={(e) => setForm({ ...form, edad: e.target.value })}
        />

        <input
          className="border p-2 rounded"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
        />

        <input
          className="border p-2 rounded md:col-span-2"
          placeholder="Correo electrónico"
          type="email"
          value={form.correo}
          onChange={(e) => setForm({ ...form, correo: e.target.value })}
        />

        <div className="md:col-span-3 flex flex-col md:flex-row gap-2">
          <button className="px-4 py-2 rounded font-bold text-white bg-green-600 hover:bg-green-700 w-full md:flex-1">
            {editando ? "Actualizar" : "Agregar"}
          </button>

          {editando && (
            <button
              type="button"
              onClick={cancelarEdicion}
              className="border px-4 py-2 rounded w-full md:w-auto"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* tabla */}
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-start">Empresa</th>
              <th className="p-2 text-start">Nombre Completo</th>
              <th className="p-2 text-start">Edad</th>
              <th className="p-2 text-start">Teléfono</th>
              <th className="p-2 text-start">Correo</th>
              <th className="p-2 text-start">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {colaboradores.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.empresa_razon_social ?? c.empresa_id}</td>
                <td className="p-2">{c.nombre_completo}</td>
                <td className="p-2">{c.edad}</td>
                <td className="p-2">{c.telefono}</td>
                <td className="p-2">{c.correo}</td>
                <td className="p-2 space-x-2">
                  <button
                    type="button"
                    onClick={() => editarColaborador(c)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => eliminarColaborador(c)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {colaboradores.length === 0 && (
              <tr>
                <td className="p-4 text-gray-600" colSpan={6}>
                  No hay colaboradores registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
