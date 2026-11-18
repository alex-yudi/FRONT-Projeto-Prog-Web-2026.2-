/**
 * Formato das "tabelas" do banco mockado. Guardam um pouco mais do que a API expõe
 * (senha, role, soft delete); os handlers convertem para os *Response de src/types.
 */
import type {
  AvaliacaoResponse,
  BairroResponse,
  CategoriaAviso,
  DataHoraLocal,
  NegocioResponse,
  OfertaResponse,
  ReivindicacaoResponse,
  RespostaDono,
  Role,
  UsuarioResponse,
} from '@/types'

export interface UsuarioRow extends UsuarioResponse {
  senha: string
  role: Role
  ativo: boolean
}

export interface NegocioRow extends NegocioResponse {
  ativo: boolean
}

export type OfertaRow = OfertaResponse

export interface AvisoRow {
  id: number
  negocioId: number
  autorId: number
  categoria: CategoriaAviso
  texto: string
  criadoEm: DataHoraLocal
  /** Votos de "vizinhos fictícios" do seed, somados aos votos reais da tabela `votos`. */
  votosBase: { util: number; naoUtil: number }
  respostaDono: RespostaDono | null
}

export type VotoRow = AvaliacaoResponse

export type ReivindicacaoRow = ReivindicacaoResponse

export interface MetricasRow {
  negocioId: number
  visualizacoesSemana: number
  seguidores: number
}

export type BairroRow = BairroResponse

export interface MockDb {
  usuarios: UsuarioRow[]
  negocios: NegocioRow[]
  ofertas: OfertaRow[]
  avisos: AvisoRow[]
  votos: VotoRow[]
  reivindicacoes: ReivindicacaoRow[]
  metricas: MetricasRow[]
  bairros: BairroRow[]
}
