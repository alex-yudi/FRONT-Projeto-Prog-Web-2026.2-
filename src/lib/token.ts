import type { Role } from '@/types'

const TOKEN_KEY = 'bairro.token'

export interface TokenPayload {
  /** E-mail do usuário. */
  sub: string
  role: Role
  /** Expiração em segundos (epoch). */
  exp: number
}

function storage(): Storage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function getToken(): string | null {
  return storage()?.getItem(TOKEN_KEY) ?? null
}

export function setToken(token: string): void {
  storage()?.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  storage()?.removeItem(TOKEN_KEY)
}

function base64UrlDecode(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

/** Lê o payload do JWT sem validar a assinatura (só para uso no cliente). */
export function decodeToken(token: string): TokenPayload | null {
  try {
    const [, payload] = token.split('.')
    return JSON.parse(base64UrlDecode(payload)) as TokenPayload
  } catch {
    return null
  }
}
