import { mockApi } from '@/mocks/server'
import type { AvaliacaoResponse } from '@/types'

/**
 * PUT .../votos/me — cria ou troca o voto (idempotente).
 * `util` é sempre enviado: na API, um corpo sem ele vira util=false.
 */
export const votar = (negocioId: number, avisoId: number, util: boolean) =>
  mockApi.put<AvaliacaoResponse>(`/negocios/${negocioId}/avisos/${avisoId}/votos/me`, { util })
