import type { MockRoute } from '../router'
import { authRoutes } from './auth'
import { avisosRoutes } from './avisos'
import { bairrosRoutes } from './bairros'
import { negociosRoutes } from './negocios'
import { ofertasRoutes } from './ofertas'
import { reivindicacoesRoutes } from './reivindicacoes'
import { usuariosRoutes } from './usuarios'
import { votosRoutes } from './votos'

/** Todas as rotas mockadas. A primeira que casar com método + caminho responde. */
export const rotas: MockRoute[] = [
  ...authRoutes,
  ...usuariosRoutes,
  ...negociosRoutes,
  ...ofertasRoutes,
  ...avisosRoutes,
  ...votosRoutes,
  ...reivindicacoesRoutes,
  ...bairrosRoutes,
]
