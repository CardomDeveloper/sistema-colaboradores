import { useEffect, useState } from "react";
import clienteAxios from "../config/axios";
import Swal from "sweetalert2";


const emptyForm = {
  pais_id: "",
  departamento_id: "",
  municipio_id: "",
  nit: "",
  razon_social: "",
  nombre_comercial: "",
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


export default function EmpresasCrud() {
  const [empresas, setEmpresas] = useState([]);

  const [paises, setPaises] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [municipios, setMunicipios] = useState([]);

  const [form, setForm] = useState(emptyForm);
  const [editando, setEditando] = useState(false);
  const [idEditar, setIdEditar] = useState(null);
  const [error, setError] = useState("");

  // cargar datos
  const obtenerEmpresas = async () => {
    const { data } = await clienteAxios("/api/empresas");
    setEmpresas(data.data);
  };

  const obtenerPaises = async () => {
    const { data } = await clienteAxios("/api/paises");
    setPaises(data.data);
  };

  const obtenerDepartamentosPorPais = async (paisId) => {
    if (!paisId) {
      setDepartamentos([]);
      return;
    }
    const { data } = await clienteAxios(`/api/departamentos?pais_id=${paisId}`);
    setDepartamentos(data.data);
  };

  const obtenerMunicipiosPorDepto = async (deptoId) => {
    if (!deptoId) {
      setMunicipios([]);
      return;
    }
    const { data } = await clienteAxios(`/api/municipios?departamento_id=${deptoId}`);
    setMunicipios(data.data);
  };

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([obtenerPaises(), obtenerEmpresas()]);
      } catch (e) {
        console.log(e);
        setError("No se pudo cargar la información inicial.");
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await obtenerDepartamentosPorPais(form.pais_id);
        setMunicipios([]);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [form.pais_id]);

  useEffect(() => {
    (async () => {
      try {
        await obtenerMunicipiosPorDepto(form.departamento_id);
      } catch (e) {
        console.log(e);
      }
    })();
  }, [form.departamento_id]);

  const guardarEmpresa = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.pais_id || !form.departamento_id || !form.municipio_id) {
      setError("Seleccione país, departamento y municipio.");
      toast("warning", "Seleccione país, departamento y municipio");
      return;
    }
    if (!form.nit.trim() || !form.razon_social.trim()) {
      setError("NIT y Razón Social son obligatorios.");
      toast("warning", "NIT y Razón Social son obligatorios");
      return;
    }

    try {
      const payload = {
        ...form,
        pais_id: Number(form.pais_id),
        departamento_id: Number(form.departamento_id),
        municipio_id: Number(form.municipio_id),
      };

      if (editando) {
        await clienteAxios.put(`/api/empresas/${idEditar}`, payload);
        toast("success", "Empresa actualizada ");
      } else {
        await clienteAxios.post("/api/empresas", payload);
        toast("success", "Empresa guardada ");
      }

      setForm(emptyForm);
      setEditando(false);
      setIdEditar(null);
      await obtenerEmpresas();
    } catch (e2) {
      console.log("SAVE empresa error:", e2?.response?.status, e2?.response?.data);
      const msg = e2?.response?.data?.message || "Error al guardar empresa";
      setError(msg);
      Swal.fire({ icon: "error", title: "Error", text: msg });
    }
  };


  const editarEmpresa = async (empresa) => {
    setEditando(true);
    setIdEditar(empresa.id);

    const paisId = String(empresa.pais_id ?? "");
    const deptoId = String(empresa.departamento_id ?? "");

    setForm({
      pais_id: paisId,
      departamento_id: deptoId,
      municipio_id: String(empresa.municipio_id ?? ""),
      nit: empresa.nit ?? "",
      razon_social: empresa.razon_social ?? "",
      nombre_comercial: empresa.nombre_comercial ?? "",
      telefono: empresa.telefono ?? "",
      correo: empresa.correo ?? "",
    });

    try {
      await obtenerDepartamentosPorPais(paisId);
      await obtenerMunicipiosPorDepto(deptoId);
    } catch (e) {
      console.log(e);
    }
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setIdEditar(null);
    setForm(emptyForm);
    setError("");
    setDepartamentos([]);
    setMunicipios([]);
  };

  const eliminarEmpresa = async (id) => {
    const result = await Swal.fire({
      title: "¿Desactivar empresa?",
      text: "La empresa ya no aparecerá en listados.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await clienteAxios.delete(`/api/empresas/${id}`);
      toast("success", "Empresa desactivada");
      await obtenerEmpresas();
    } catch (e) {
      console.log("DELETE empresa error:", e?.response?.status, e?.response?.data);
      const msg = e?.response?.data?.message || "No se pudo eliminar";
      Swal.fire({ icon: "error", title: "Error", text: msg });
    }
  };
  
  return (
    <div className="bg-white p-5 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Mantenimiento Empresas</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-3 rounded">
          {error}
        </div>
      )}

      {/* form */}
      <form
        onSubmit={guardarEmpresa}
        className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6"
      >
        {/* pais */}
        <select
          className="border p-2 rounded"
          value={form.pais_id}
          onChange={(e) =>
            setForm({
              ...form,
              pais_id: e.target.value,
              departamento_id: "",
              municipio_id: "",
            })
          }
        >
          <option value="">Seleccione país</option>
          {paises.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nombre}
            </option>
          ))}
        </select>

        {/* deepartamento */}
        <select
          className="border p-2 rounded"
          value={form.departamento_id}
          disabled={!form.pais_id}
          onChange={(e) =>
            setForm({
              ...form,
              departamento_id: e.target.value,
              municipio_id: "",
            })
          }
        >
          <option value="">Seleccione departamento</option>
          {departamentos.map((d) => (
            <option key={d.id} value={d.id}>
              {d.nombre}
            </option>
          ))}
        </select>

        {/* municipio */}
        <select
          className="border p-2 rounded"
          value={form.municipio_id}
          disabled={!form.departamento_id}
          onChange={(e) => setForm({ ...form, municipio_id: e.target.value })}
        >
          <option value="">Seleccione municipio</option>
          {municipios.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="NIT"
          className="border p-2 rounded"
          value={form.nit}
          onChange={(e) => setForm({ ...form, nit: e.target.value })}
        />

        <input
          type="text"
          placeholder="Razón Social"
          className="border p-2 rounded md:col-span-2"
          value={form.razon_social}
          onChange={(e) => setForm({ ...form, razon_social: e.target.value })}
        />

        <input
          type="text"
          placeholder="Nombre Comercial"
          className="border p-2 rounded md:col-span-2"
          value={form.nombre_comercial}
          onChange={(e) => setForm({ ...form, nombre_comercial: e.target.value })}
        />

        <input
          type="text"
          placeholder="Teléfono"
          className="border p-2 rounded"
          value={form.telefono}
          onChange={(e) => setForm({ ...form, telefono: e.target.value })}
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          className="border p-2 rounded md:col-span-2"
          value={form.correo}
          onChange={(e) => setForm({ ...form, correo: e.target.value })}
        />

        <div className="md:col-span-3 flex flex-col md:flex-row gap-2">
          <button className="px-4 py-2 rounded font-bold text-white bg-green-600 hover:bg-green-700 flex-1">
            {editando ? "Actualizar" : "Agregar"}
          </button>

          {editando && (
            <button
              type="button"
              onClick={cancelarEdicion}
              className="border px-4 py-2 rounded"
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
              <th className="p-2 text-start">País</th>
              <th className="p-2 text-start">Departamento</th>
              <th className="p-2 text-start">Municipio</th>
              <th className="p-2 text-start">NIT</th>
              <th className="p-2 text-start">Razón Social</th>
              <th className="p-2 text-start">Nombre Comercial</th>
              <th className="p-2 text-start">Teléfono</th>
              <th className="p-2 text-start">Correo Eletrónico</th>
              <th className="p-2 text-start">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empresas.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="p-2">{e.pais_nombre}</td>
                <td className="p-2">{e.departamento_nombre}</td>
                <td className="p-2">{e.municipio_nombre}</td>

                <td className="p-2">{e.nit}</td>
                <td className="p-2">{e.razon_social}</td>
                <td className="p-2">{e.nombre_comercial}</td>
                <td className="p-2">{e.telefono}</td>
                <td className="p-2">{e.correo}</td>

                <td className="p-2 space-x-2">
                  <button
                    type="button"
                    onClick={() => editarEmpresa(e)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => eliminarEmpresa(e.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}

            {empresas.length === 0 && (
              <tr>
                <td className="p-4 text-gray-600" colSpan={4}>
                  No hay empresas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
