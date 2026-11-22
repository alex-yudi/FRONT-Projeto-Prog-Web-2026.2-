import { Outlet } from 'react-router'
import Topbar from '@/components/layout/Topbar'

// Layout das telas com Topbar.
// TODO: implementar o layout.
export default function AppLayout() {
  return (
    <>
      <Topbar />
      <Outlet />
    </>
  )
}
