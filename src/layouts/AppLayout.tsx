import { Outlet } from 'react-router'
import Topbar from '@/components/layout/Topbar'
import BairroProvider from '@/contexts/BairroProvider'

export default function AppLayout() {
  return (
    <BairroProvider>
      <Topbar />
      <Outlet />
    </BairroProvider>
  )
}
