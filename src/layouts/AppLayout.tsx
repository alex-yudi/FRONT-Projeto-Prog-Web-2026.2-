import { Outlet, ScrollRestoration } from 'react-router'
import Topbar from '@/components/layout/Topbar'
import BairroProvider from '@/contexts/BairroProvider'

// Layout das telas com Topbar (Figma: componente Topbar 4:7).
export default function AppLayout() {
  return (
    <BairroProvider>
      <div className="flex min-h-screen flex-col">
        <Topbar />
        <main className="flex flex-1 flex-col">
          <Outlet />
        </main>
        <ScrollRestoration />
      </div>
    </BairroProvider>
  )
}