import { decodeToken, type TokenPayload } from '@/lib/token'
import type { Role } from '@/types'

/** `exp` existe só para o token ter o mesmo formato do backend; o mock não confere. */
const EXPIRACAO_SEGUNDOS = 15 * 60

function base64UrlEncode(value: string): string {
  const bytes = new TextEncoder().encode(value)
  let bin = ''
  bytes.forEach((b) => (bin += String.fromCharCode(b)))
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** Gera um JWT falso (assinatura "mock"), com o mesmo payload do backend: sub = e-mail, role, exp. */
export function criarToken(email: string, role: Role): string {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const payload: TokenPayload = {
    sub: email,
    role,
    exp: Math.floor(Date.now() / 1000) + EXPIRACAO_SEGUNDOS,
  }
  return `${header}.${base64UrlEncode(JSON.stringify(payload))}.mock`
}

/** Lê o payload do token salvo (null se não houver). */
export function lerToken(token: string | null): TokenPayload | null {
  if (!token) return null
  return decodeToken(token)
}
