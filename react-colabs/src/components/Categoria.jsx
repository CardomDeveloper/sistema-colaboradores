import useColab from "../hooks/useColab"

export default function Categoria({categoria}) {

    const {handleClickCategoria, categoriaActual} = useColab()
    const {icono, id, nombre} = categoria

    const resaltarCategoriaActual = () => categoriaActual.id === id ? "bg-amber-400" : "bg-white"

    return (
        <div className={`${resaltarCategoriaActual()} flex items-center gap-4 border border-gray-500 w-full p-3 hover:bg-amber-400 cursor-pointer`}>
            <img src={`/img/icono_${icono}.svg`} alt="Imagen Icono" className="w-10 flex-none" />
            <div className="flex items-center ">
                <p className="text-lg font-bold cursor-pointer" onClick={() => handleClickCategoria(id)}>{nombre}</p>
            </div>
        </div>
    )
}
