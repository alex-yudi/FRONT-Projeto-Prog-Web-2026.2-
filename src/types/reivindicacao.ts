import type { DataHoraLocal, Paginacao } from './common'

export type StatusReivindicacao = 'PENDENTE' | 'APROVADA' | 'REJEITADA'

export interface ReivindicacaoResponse {
  id: number
  negocioId: number
  usuarioId: number
  justificativa: string | null
  status: StatusReivindicacao
  criadoEm: DataHoraLocal
  decididaEm: DataHoraLocal | null
  decididaPorId: number | null
}

/** Corpo opcional; se vier, `justificativa` não pode ser vazia. */
export interface ReivindicacaoRequest {
  justificativa?: string
}

export interface ReivindicacaoDecisaoRequest {
  status: Exclude<StatusReivindicacao, 'PENDENTE'>
}

export interface ReivindicacaoFiltros extends Paginacao {
  status?: StatusReivindicacao
}
