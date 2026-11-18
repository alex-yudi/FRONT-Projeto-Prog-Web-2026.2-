import { Outlet } from 'react-router'

// Layout de Login e Cadastro (sem Topbar; logo + slogan à esquerda no Figma).
// TODO: implementar na etapa do Login.
export default function AuthLayout() {
  return (
    <>
      <p>AuthLayout</p>
      <Outlet />
    </>
  )
}
