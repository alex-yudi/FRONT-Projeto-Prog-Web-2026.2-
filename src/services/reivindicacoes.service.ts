import { mockApi } from '@/mocks/server'
import type { ReivindicacaoDecisaoRequest, ReivindicacaoFiltros, ReivindicacaoResponse } from '@/types'

/** GET /reivindicacoes (ADMIN). Sem tela no Figma por enquanto. */
export const getReivindicacoes = (filtros?: ReivindicacaoFiltros) =>
  mockApi.get<ReivindicacaoResponse[]>('/reivindicacoes', filtros)

/** PATCH /reivindicacoes/:id (ADMIN). Aprovar torna o solicitante dono do negócio. */
export const decidirReivindicacao = (id: number, dados: ReivindicacaoDecisaoRequest) =>
  mockApi.patch<ReivindicacaoResponse>(`/reivindicacoes/${id}`, dados)
