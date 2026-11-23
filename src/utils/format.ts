import type { CategoriaAviso, CategoriaNegocio, DataHoraLocal, DataISO, OfertaResponse } from '@/types'

// ---------------------------------------------------------------------------
// Categorias
// ---------------------------------------------------------------------------
export const CATEGORIAS_NEGOCIO: { valor: CategoriaNegocio; label: string; emoji: string }[] = [
  { valor: 'HORTIFRUTI', label: 'Hortifruti', emoji: '🥕' },
  { valor: 'MERCADO', label: 'Mercado', emoji: '🛒' },
  { valor: 'PADARIA', label: 'Padaria', emoji: '🥐' },
  { valor: 'SERVICOS', label: 'Serviços', emoji: '🧵' },
  { valor: 'OUTRO', label: 'Outro', emoji: '🏷️' },
]

export const CATEGORIAS_AVISO: { valor: CategoriaAviso; label: string }[] = [
  { valor: 'PRECO', label: 'Preço / Promoção' },
  { valor: 'ESTOQUE', label: 'Estoque' },
  { valor: 'ATENDIMENTO', label: 'Atendimento' },
]

export const labelCategoriaNegocio = (c: CategoriaNegocio) =>
  CATEGORIAS_NEGOCIO.find((x) => x.valor === c)?.label ?? c

export const emojiCategoriaNegocio = (c: CategoriaNegocio) => CATEGORIAS_NEGOCIO.find((x) => x.valor === c)?.emoji ?? '🏷️'

// ---------------------------------------------------------------------------
// Números, CEP e distância
// ---------------------------------------------------------------------------
export const somenteDigitos = (valor: string) => valor.replace(/\D/g, '')

/** "59600000" → "59600-000" (aceita digitação parcial). */
export function mascararCep(valor: string): string {
  const d = somenteDigitos(valor).slice(0, 8)
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
}

export function formatarDistancia(metros?: number): string | null {
  if (metros === undefined) return null
  if (metros < 1000) return `${metros}m`
  return `${(metros / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km`
}

/** Preço de oferta: R$ 3,20 · R$ 6,90/kg · "—" quando é brinde (0). */
export function formatarPreco(preco: number, unidade?: string): string {
  if (preco === 0) return '—'
  const valor = preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(/ /g, ' ')
  return unidade ? `${valor}/${unidade}` : valor
}

/** Texto do campo de preço ("3,20", "R$ 3,20", vazio) → número. Vazio = 0; inválido = NaN. */
export function lerPreco(texto: string): number {
  const limpo = texto.replace(/R\$|\s/g, '')
  if (limpo === '') return 0
  if (!/^\d+([.,]\d{1,2})?$/.test(limpo)) return Number.NaN
  return Number(limpo.replace(',', '.'))
}

export const precoParaCampo = (preco: number) => (preco === 0 ? '' : preco.toFixed(2).replace('.', ','))

// ---------------------------------------------------------------------------
// Datas
// ---------------------------------------------------------------------------
const pad = (n: number) => String(n).padStart(2, '0')
const paraISO = (d: Date): DataISO => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const hojeISO = () => paraISO(new Date())

/** Próximo domingo (hoje, se hoje for domingo). */
export function fimDaSemanaISO(): DataISO {
  const d = new Date()
  d.setDate(d.getDate() + ((7 - d.getDay()) % 7))
  return paraISO(d)
}

export function fimDoMesISO(): DataISO {
  const d = new Date()
  return paraISO(new Date(d.getFullYear(), d.getMonth() + 1, 0))
}

export const ofertaAtiva = (o: OfertaResponse) => o.validade === null || o.validade >= hojeISO()

export function validadeLabel(validade: DataISO | null): string {
  if (!validade) return 'sem prazo'
  if (validade === hojeISO()) return 'válido hoje'
  const [, mes, dia] = validade.split('-')
  return `válido até ${dia}/${mes}`
}

/** "postado há 3h", "há 20 min", "ontem"... A data do mock é horário de Brasília (UTC-3). */
export function tempoRelativo(data: DataHoraLocal): string {
  const quando = new Date(`${data}-03:00`).getTime()
  if (Number.isNaN(quando)) return ''
  const min = Math.max(0, Math.floor((Date.now() - quando) / 60_000))
  if (min < 1) return 'agora há pouco'
  if (min < 60) return `há ${min} min`
  const horas = Math.floor(min / 60)
  if (horas < 24) return `há ${horas}h`
  const dias = Math.floor(horas / 24)
  return dias === 1 ? 'ontem' : `há ${dias} dias`
}
