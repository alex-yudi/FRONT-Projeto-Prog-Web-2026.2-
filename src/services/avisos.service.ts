import { mockApi } from '@/mocks/server'
import type { AvisoRequest, AvisoResponse, Paginacao, RespostaDono } from '@/types'

const base = (negocioId: number) => `/negocios/${negocioId}/avisos`

/** GET — paginado e público. Não existe GET de um aviso por id. */
export const getAvisos = (negocioId: number, params?: Paginacao) =>
  mockApi.get<AvisoResponse[]>(base(negocioId), params)

export const criarAviso = (negocioId: number, dados: AvisoRequest) =>
  mockApi.post<AvisoResponse>(base(negocioId), dados)

export const atualizarAviso = (negocioId: number, avisoId: number, dados: AvisoRequest) =>
  mockApi.put<AvisoResponse>(`${base(negocioId)}/${avisoId}`, dados)

export const excluirAviso = (negocioId: number, avisoId: number) => mockApi.delete(`${base(negocioId)}/${avisoId}`)

/** TODO backend: endpoint existe só no mock (Confirmar / Contestar do Dashboard). */
export const responderAviso = (negocioId: number, avisoId: number, resposta: RespostaDono) =>
  mockApi.put<AvisoResponse>(`${base(negocioId)}/${avisoId}/resposta-dono`, { resposta })
