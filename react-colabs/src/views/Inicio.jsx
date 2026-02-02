import useColab from "../hooks/useColab";
import ColaboradoresCrud from "./ColaboradoresCrud";
import DepartamentosCrud from "./DepartamentosCrud";
import EmpresasCrud from "./EmpresasCrud";
import MunicipioCrud from "./MunicipioCrud";
import PaisesCrud from "./PaisesCrud";

export default function Inicio() {

  const { categoriaActual } = useColab();

  if (!categoriaActual) return null;

  return (
    <>
      <h1 className="text-4xl font-black">{categoriaActual.nombre}</h1>

      {categoriaActual.nombre === "Mantenimiento países" && (
        <PaisesCrud />
      )}

      {categoriaActual.nombre === "Mantenimiento departamentos" && (
        <DepartamentosCrud />
      )}

      {categoriaActual.nombre === "Mantenimiento municipios" && (
        <MunicipioCrud />
      )}

      {categoriaActual.nombre === "Mantenimiento Empresas" && (
        <EmpresasCrud />
      )}

      {categoriaActual.nombre === "Mantenimiento Colaboradores" && (
        <ColaboradoresCrud />
      )}
    </>
  );
}

