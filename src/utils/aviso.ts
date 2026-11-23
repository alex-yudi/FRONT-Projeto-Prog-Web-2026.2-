import type { AvisoResponse } from '@/types'

/** Quantos votos "útil" fazem a vizinhança confirmar um aviso (carimbo CONFIRMADO). */
export const VOTOS_PARA_CONFIRMAR = 10

export type StatusAviso = 'CONFIRMADO' | 'CONTESTADO' | 'AGUARDANDO' | 'EM_VOTACAO'

/**
 * - CONTESTADO: o dono do negócio contestou.
 * - CONFIRMADO: o dono confirmou ou a vizinhança já deu votos suficientes.
 * - AGUARDANDO: ninguém votou ainda.
 * - EM_VOTACAO: tem votos, mas ainda não chegou ao carimbo.
 */
export function statusAviso(a: AvisoResponse): StatusAviso {
  if (a.respostaDono === 'CONTESTADO') return 'CONTESTADO'
  if (a.respostaDono === 'CONFIRMADO' || a.votosUtil >= VOTOS_PARA_CONFIRMAR) return 'CONFIRMADO'
  if (a.votosUtil + a.votosNaoUtil === 0) return 'AGUARDANDO'
  return 'EM_VOTACAO'
}

/** Texto pequeno do carimbo: "por 12 vizinhos" ou "pelo dono". */
export function legendaCarimbo(a: AvisoResponse): string {
  if (a.votosUtil >= VOTOS_PARA_CONFIRMAR) return `por ${a.votosUtil} vizinhos`
  return 'pelo dono'
}
