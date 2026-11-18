import { Outlet } from 'react-router'

// Layout das telas com Topbar (Figma: componente Topbar 4:7).
// TODO: implementar a Topbar na etapa do Feed.
export default function AppLayout() {
  return (
    <>
      <p>AppLayout</p>
      <Outlet />
    </>
  )
}
