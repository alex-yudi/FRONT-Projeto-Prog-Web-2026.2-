import { minutosAtras } from '../helpers'
import type { ReivindicacaoRow } from '../types'

/** Uma reivindicação pendente (Ana → Costura da Dona Ana), como no seed do backend. */
export function seedReivindicacoes(): ReivindicacaoRow[] {
  return [
    {
      id: 1,
      negocioId: 2,
      usuarioId: 6,
      justificativa: 'Sou a Ana, dona da costura. Posso mandar foto do alvará.',
      status: 'PENDENTE',
      criadoEm: minutosAtras(3 * 60),
      decididaEm: null,
      decididaPorId: null,
    },
  ]
}
