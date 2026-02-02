import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { ColabProvider } from './context/ColabProvider'
import router from './router'
import './index.css'

createRoot(document.getElementById('root')).render(
    <StrictMode>

        <ColabProvider>
            <RouterProvider router={router} />
        </ColabProvider>

    </StrictMode>,
)
