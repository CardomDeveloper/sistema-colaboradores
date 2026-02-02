import { Link } from "react-router-dom"

export default function Registro() {
  return (
    
    <>
        <h1 className="text-4xl font-black">Crea tu cuenta</h1>
        <p>Crea tu cuenta llenando el formulario</p>

        <div className="bg-white shadow-md rounded-md mt-10 px-5 py-10">
            <form action="">
                <div className="mb-4">
                    <label className="text-slate-800" htmlFor="name">
                        Nombre:
                    </label>
                    <input type="text"  id="name" className="mt-2 w-full p-3 bg-gray-50" name="name" placeholder=" Tu nombre"/>
                </div>

                <div className="mb-4">
                    <label className="text-slate-800" htmlFor="email">
                        Email:
                    </label>
                    <input type="email"  id="email" className="mt-2 w-full p-3 bg-gray-50" name="email" placeholder=" Tu email"/>
                </div>

                <div className="mb-4">
                    <label className="text-slate-800" htmlFor="password">
                        Contraseña:
                    </label>
                    <input type="password"  id="password" className="mt-2 w-full p-3 bg-gray-50" name="password" placeholder=" Tu contraseña"/>
                </div>

                <div className="mb-4">
                    <label className="text-slate-800" htmlFor="password_confirmation">
                        Repetir Contraseña:
                    </label>
                    <input type="password"  id="password_confirmation" className="mt-2 w-full p-3 bg-gray-50" name="password_confirmation" placeholder=" Repetir contraseña"/>
                </div>

                <input className="bg-indigo-600 hover:bg-indigo-800 text-white w-full mt-5 p-3 uppercase font-bold cursor-pointer" type="submit" value="Crear Cuenta" />
            </form>
        </div>

        <nav className="mt-5">
            <Link to="/auth/login" className="text-blue-400">¿Ya tienes cuenta? Inicia Sesión</Link>
        </nav>
    </>
  )
}
