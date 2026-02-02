import { Outlet } from "react-router-dom"

export default function AuthLayout() {
  return (
    <main className="max-w-4xl m-auto mt-10 md:mt-28 flex flex-col md:flex-row items-center justify-center">
        <img src="../img/login.jpg" alt="imagen Login" className="max-w-sm"/>

        <div className="w-full p-10">
            <Outlet />
        </div>
    </main>
  )
}