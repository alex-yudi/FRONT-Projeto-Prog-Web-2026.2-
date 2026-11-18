import type { DataHoraLocal } from './common'

export type CategoriaAviso = 'PRECO' | 'ESTOQUE' | 'ATENDIMENTO'

/** mock-only — TODO backend: resposta do dono ao aviso. */
export type RespostaDono = 'CONFIRMADO' | 'CONTESTADO'

export interface AvisoResponse {
  id: number
  negocioId: number
  autorId: number
  categoria: CategoriaAviso
  texto: string
  criadoEm: DataHoraLocal
  votosUtil: number
  votosNaoUtil: number

  // mock-only
  autorNome?: string
  negocioNome?: string
  /** Voto do usuário logado: true = útil, false = não confere, null = não votou. */
  meuVoto?: boolean | null
  respostaDono?: RespostaDono | null
}

/** Mesmo formato para POST e PUT. */
export interface AvisoRequest {
  categoria: CategoriaAviso
  /** Até 500 caracteres. */
  texto: string
}

/** Sempre envie `util`: na API, um corpo `{}` vira util=false. */
export interface VotoRequest {
  util: boolean
}

export interface AvaliacaoResponse {
  id: number
  avisoId: number
  usuarioId: number
  util: boolean
  criadoEm: DataHoraLocal
}

/** mock-only — TODO backend */
export interface RespostaDonoRequest {
  resposta: RespostaDono
}
