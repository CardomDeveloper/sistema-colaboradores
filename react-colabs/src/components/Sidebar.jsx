
import useColab from "../hooks/useColab"
import Categoria from "./Categoria"

export default function Sidebar() {

    const { categorias } = useColab()

    return (
        <aside className="md:w-72 bg-sky-600">
            <div className="p-4 flex justify-center items-center">
                <img className="w-80 md:w-full rounded-2xl shadow-2xl" src="img/login.jpg" alt="" />
            </div>

            <div className="mt-10">
                {categorias.map( categoria => (
                    <Categoria
                        key={categoria.id}
                        categoria = {categoria}
                    />
                ))}
            </div>

        </aside>
    )
}
