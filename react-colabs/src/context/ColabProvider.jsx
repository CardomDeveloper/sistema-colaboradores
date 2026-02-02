import { createContext, useEffect, useInsertionEffect, useState } from "react"
import clienteAxios from "../config/axios";


const ColabContext = createContext();

export const ColabProvider = ({children}) => {

    const [categorias, setCategorias] = useState([]);
    const [categoriaActual, setCategoriaActual] = useState({});
    const handleClickCategoria = id => {
        const categoria = categorias.filter(categoria => categoria.id === id)[0]
        setCategoriaActual(categoria)
    }

    const obtenerCategorias = async () => {
        try {
            const {data} = await clienteAxios('/api/categorias');
            setCategorias(data.data)
            setCategoriaActual(data.data[0])
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        obtenerCategorias();
    }, [])


    return (
        <ColabContext.Provider 
            value={{
                categorias,
                categoriaActual,
                handleClickCategoria
            }}               
        >
            {children}
        </ColabContext.Provider>
    )
}

export default ColabContext