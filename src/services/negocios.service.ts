import { mockApi } from '@/mocks/server'
import type {
  NegocioFiltros,
  NegocioMetricas,
  NegocioRequest,
  NegocioResponse,
  ReivindicacaoRequest,
  ReivindicacaoResponse,
} from '@/types'

/** GET /negocios — paginado; `bairro` é igualdade exata; `q` busca no nome e na descrição. */
export const getNegocios = (filtros?: NegocioFiltros) => mockApi.get<NegocioResponse[]>('/negocios', filtros)

export const getNegocio = (id: number) => mockApi.get<NegocioResponse>(`/negocios/${id}`)

/** POST /negocios — usuário comum vira dono; ADMIN cria sem dono. */
export const criarNegocio = (dados: NegocioRequest) => mockApi.post<NegocioResponse>('/negocios', dados)

export const atualizarNegocio = (id: number, dados: NegocioRequest) =>
  mockApi.put<NegocioResponse>(`/negocios/${id}`, dados)

/** DELETE /negocios/:id — sem volta; apaga também ofertas e avisos. */
export const excluirNegocio = (id: number) => mockApi.delete(`/negocios/${id}`)

export const reivindicarNegocio = (id: number, dados?: ReivindicacaoRequest) =>
  mockApi.post<ReivindicacaoResponse>(`/negocios/${id}/reivindicacoes`, dados ?? {})

/** TODO backend: endpoint existe só no mock (números do Dashboard). */
export const getMetricasNegocio = (id: number) => mockApi.get<NegocioMetricas>(`/negocios/${id}/metricas`)
