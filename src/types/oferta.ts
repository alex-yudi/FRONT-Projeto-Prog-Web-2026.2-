import type { DataISO } from './common'

export interface OfertaResponse {
  id: number
  negocioId: number
  nome: string
  descricao: string
  preco: number
  /** null = sem prazo. A API não filtra as vencidas. */
  validade: DataISO | null

  // mock-only
  /** Ex.: "kg", "dúzia". */
  unidade?: string
}

/** Mesmo formato para POST e PUT. */
export interface OfertaRequest {
  /** Até 150 caracteres. */
  nome: string
  /** Até 500 caracteres. Obrigatória na API (o Figma diz "opcional"). */
  descricao: string
  /** >= 0. */
  preco: number
  validade?: DataISO | null
}
