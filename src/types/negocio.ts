import type { CategoriaNegocio, Paginacao } from './common'

export interface NegocioResponse {
  id: number
  nome: string
  categoria: CategoriaNegocio
  cep: string
  numero: string
  bairro: string
  descricao: string
  /** null = perfil ainda não reivindicado. */
  donoId: number | null

  // mock-only: campos que o backend ainda não fornece
  logradouro?: string
  distanciaMetros?: number
  catalogo?: string[]
  /** Posição do pino no mapa estilizado, em % (0–100). */
  mapa?: { x: number; y: number }
}

/** Mesmo formato para POST e PUT (envia todos os campos). */
export interface NegocioRequest {
  nome: string
  categoria: CategoriaNegocio
  cep: string
  numero: string
  bairro: string
  /** Até 500 caracteres. */
  descricao: string
}

export interface NegocioFiltros extends Paginacao {
  /** Igualdade exata (diferencia maiúsculas e acentos). */
  bairro?: string
  categoria?: CategoriaNegocio
  /** Busca no nome e na descrição do negócio. */
  q?: string
}

/** mock-only — TODO backend: GET /negocios/{id}/metricas */
export interface NegocioMetricas {
  negocioId: number
  visualizacoesSemana: number
  seguidores: number
  avisosParaRevisar: number
}
