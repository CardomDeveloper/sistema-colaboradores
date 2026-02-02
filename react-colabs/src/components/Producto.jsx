
export default function Producto({producto}) {

    const {nombre, precio, imagen} = producto

    return (
        <div className="border border-gray-500 p-3 shadow bg-white">
            <img src={`/img/${imagen}.jpg `} alt={`imagen ${nombre} `}  className="w-full"/>

            <div className="p-5">
                <h3 className="text-2xl font-bold">{nombre}</h3>
            </div>
        </div>
    )
}
