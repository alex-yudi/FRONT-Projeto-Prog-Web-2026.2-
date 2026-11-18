import { mockApi } from '@/mocks/server'
import type {
  AvisoResponse,
  NegocioResponse,
  Paginacao,
  UsuarioAtualizacaoRequest,
  UsuarioRegistroRequest,
  UsuarioResponse,
} from '@/types'

/** POST /usuarios (público). O CEP vai sem hífen. */
export const cadastrarUsuario = (dados: UsuarioRegistroRequest) => mockApi.post<UsuarioResponse>('/usuarios', dados)

export const getMe = () => mockApi.get<UsuarioResponse>('/usuarios/me')

/** PUT /usuarios/me — sem senha. Se o e-mail mudar, o token atual deixa de valer: faça login de novo. */
export const atualizarMe = (dados: UsuarioAtualizacaoRequest) => mockApi.put<UsuarioResponse>('/usuarios/me', dados)

/** DELETE /usuarios/me — soft delete; desvincula os negócios do usuário. */
export const excluirMe = () => mockApi.delete('/usuarios/me')

export const getMeusAvisos = (params?: Paginacao) => mockApi.get<AvisoResponse[]>('/usuarios/me/avisos', params)

/** TODO backend: endpoint existe só no mock. */
export const getMeusNegocios = () => mockApi.get<NegocioResponse[]>('/usuarios/me/negocios')
