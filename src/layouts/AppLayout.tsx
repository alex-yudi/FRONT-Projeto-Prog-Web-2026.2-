import { Outlet, ScrollRestoration } from 'react-router'
import Topbar from '@/components/layout/Topbar'

// Layout das telas com Topbar (Figma: componente Topbar 4:7).
// TODO: implementar a Topbar na etapa do Feed.

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Topbar />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <ScrollRestoration />
    </div>
  )
}

