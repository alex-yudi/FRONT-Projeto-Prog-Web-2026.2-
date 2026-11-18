import { mockApi } from '@/mocks/server'
import { clearToken, decodeToken, getToken, setToken, type TokenPayload } from '@/lib/token'
import type { LoginRequest, LoginResponse } from '@/types'

/** POST /auth/login — guarda o token e devolve o payload (e-mail, role, exp). */
export async function login(dados: LoginRequest): Promise<TokenPayload | null> {
  const { token } = await mockApi.post<LoginResponse>('/auth/login', dados)
  setToken(token)
  return decodeToken(token)
}

/** POST /auth/logout — o servidor não faz nada; o cliente descarta o token. */
export async function logout(): Promise<void> {
  try {
    await mockApi.post<void>('/auth/logout')
  } finally {
    clearToken()
  }
}

/** Sessão atual a partir do token salvo; null se ninguém fez login. */
export function getSessao(): TokenPayload | null {
  const token = getToken()
  return token ? decodeToken(token) : null
}
