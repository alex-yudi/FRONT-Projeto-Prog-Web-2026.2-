import { mockApi } from '@/mocks/server'
import type { OfertaRequest, OfertaResponse } from '@/types'

const base = (negocioId: number) => `/negocios/${negocioId}/ofertas`

/** GET — sem paginação; inclui as vencidas (filtre por `validade` para "ativas"). */
export const getOfertas = (negocioId: number) => mockApi.get<OfertaResponse[]>(base(negocioId))

export const getOferta = (negocioId: number, ofertaId: number) =>
  mockApi.get<OfertaResponse>(`${base(negocioId)}/${ofertaId}`)

export const criarOferta = (negocioId: number, dados: OfertaRequest) =>
  mockApi.post<OfertaResponse>(base(negocioId), dados)

export const atualizarOferta = (negocioId: number, ofertaId: number, dados: OfertaRequest) =>
  mockApi.put<OfertaResponse>(`${base(negocioId)}/${ofertaId}`, dados)

/** DELETE — usado no "Encerrar promoção". */
export const excluirOferta = (negocioId: number, ofertaId: number) =>
  mockApi.delete(`${base(negocioId)}/${ofertaId}`)
