import { createBrowserRouter } from 'react-router'
import AppLayout from '@/layouts/AppLayout'
import AuthLayout from '@/layouts/AuthLayout'
import BuscaPage from '@/pages/Busca'
import CadastroPage from '@/pages/Cadastro'
import CadastroNegocioPage from '@/pages/CadastroNegocio'
import DashboardPage from '@/pages/Dashboard'
import EditarNegocioPage from '@/pages/EditarNegocio'
import FeedPage from '@/pages/Feed'
import LoginPage from '@/pages/Login'
import MeusAvisosPage from '@/pages/MeusAvisos'
import MinhaContaPage from '@/pages/MinhaConta'
import NegocioPerfilPage from '@/pages/NegocioPerfil'
import NotFoundPage from '@/pages/NotFound'
import ReivindicarPerfilPage from '@/pages/ReivindicarPerfil' // <-- ADICIONADO AQUI
import { PATHS } from './paths'
import RequireAuth from './RequireAuth'

/** Rotas do app. Painel, conta, avisos e cadastro/edição de negócio exigem login (RequireAuth). */
export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: PATHS.login, element: <LoginPage /> },
      { path: PATHS.cadastro, element: <CadastroPage /> },
    ],
  },
  {
    element: <AppLayout />,
    children: [
      { path: PATHS.feed, element: <FeedPage /> },
      { path: PATHS.busca, element: <BuscaPage /> },
      { path: PATHS.negocio(), element: <NegocioPerfilPage /> },
      { path: PATHS.reivindicar(), element: <ReivindicarPerfilPage /> },
      {
        element: <RequireAuth />,
        children: [
          { path: PATHS.novoNegocio, element: <CadastroNegocioPage /> },
          { path: PATHS.editarNegocio(), element: <EditarNegocioPage /> },
          { path: PATHS.painel, element: <DashboardPage /> },
          { path: PATHS.minhaConta, element: <MinhaContaPage /> },
          { path: PATHS.meusAvisos, element: <MeusAvisosPage /> },
        ],
      },
      // As rotas duplicadas que estavam aqui embaixo foram removidas.
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])