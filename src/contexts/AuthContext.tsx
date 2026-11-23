import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { clearToken, type TokenPayload } from '@/lib/token'
import { getSessao, login, logout } from '@/services/auth.service'
import { getMe } from '@/services/usuarios.service'
import type { LoginRequest, UsuarioResponse } from '@/types'

export interface AuthValue {
  /** Dados do token (e-mail, role, exp); null = ninguém logado. */
  sessao: TokenPayload | null
  /** Perfil completo (GET /usuarios/me); null enquanto carrega ou se deslogado. */
  usuario: UsuarioResponse | null
  entrar: (dados: LoginRequest) => Promise<void>
  sair: () => Promise<void>
  /** Rebusca o perfil (depois de editar a conta). */
  recarregarUsuario: () => Promise<void>
}

export const AuthContext = createContext<AuthValue | null>(null)

function sessaoInicial(): TokenPayload | null {
  const sessao = getSessao()
  if (sessao && sessao.exp * 1000 < Date.now()) {
    clearToken()
    return null
  }
  return sessao
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<TokenPayload | null>(sessaoInicial)
  const [usuario, setUsuario] = useState<UsuarioResponse | null>(null)

  const recarregarUsuario = useCallback(async () => {
    try {
      setUsuario(await getMe())
    } catch {
      // Token que o servidor não reconhece mais (e-mail trocado, conta excluída, banco resetado).
      clearToken()
      setSessao(null)
      setUsuario(null)
    }
  }, [])

  useEffect(() => {
    if (sessao) void recarregarUsuario()
    else setUsuario(null)
  }, [sessao, recarregarUsuario])

  const entrar = useCallback(async (dados: LoginRequest) => {
    setSessao(await login(dados))
  }, [])

  const sair = useCallback(async () => {
    await logout()
    setSessao(null)
    setUsuario(null)
  }, [])

  const valor = useMemo(
    () => ({ sessao, usuario, entrar, sair, recarregarUsuario }),
    [sessao, usuario, entrar, sair, recarregarUsuario],
  )
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
