import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { AuthProvider } from './contexts/AuthContext'
import { BairroProvider } from './contexts/BairroContext'
import { router } from './routes/router'
import './index.css'

// Carrega o banco mockado logo no início, para `bairroMock.resetDb()` funcionar no console.
import './mocks/db'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BairroProvider>
        <RouterProvider router={router} />
      </BairroProvider>
    </AuthProvider>
  </StrictMode>,
)
