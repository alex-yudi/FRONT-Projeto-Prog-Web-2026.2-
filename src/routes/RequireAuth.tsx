import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { PATHS } from './paths'

/** Rotas filhas só abrem com login; senão vai para /login e volta depois (state.from). */
export default function RequireAuth() {
  const { sessao } = useAuth()
  const local = useLocation()
  if (!sessao) return <Navigate to={PATHS.login} replace state={{ from: local.pathname + local.search }} />
  return <Outlet />
}
