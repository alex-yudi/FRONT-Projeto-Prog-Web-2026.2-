import type { MockResult } from './helpers'
import type { UsuarioRow } from './types'

export type Metodo = 'get' | 'post' | 'put' | 'patch' | 'delete'

export interface MockContext {
  params: Record<string, string>
  query: URLSearchParams
  body: unknown
  /** Usuário do token salvo; null se ninguém fez login. */
  usuario: UsuarioRow | null
}

export interface MockRoute {
  method: Metodo
  /** Caminho relativo a /api/v1, com parâmetros no formato ":id". */
  path: string
  handler: (ctx: MockContext) => MockResult
}

interface RotaCompilada extends MockRoute {
  regex: RegExp
  nomes: string[]
}

export function compilar(rotas: MockRoute[]): RotaCompilada[] {
  return rotas.map((rota) => {
    const nomes: string[] = []
    const padrao = rota.path.replace(/:([A-Za-z]+)/g, (_, nome: string) => {
      nomes.push(nome)
      return '([^/]+)'
    })
    return { ...rota, regex: new RegExp(`^${padrao}/?$`), nomes }
  })
}

export function encontrar(
  rotas: RotaCompilada[],
  method: string,
  path: string,
): { rota: RotaCompilada; params: Record<string, string> } | null {
  for (const rota of rotas) {
    if (rota.method !== method) continue
    const match = rota.regex.exec(path)
    if (!match) continue
    const params = Object.fromEntries(rota.nomes.map((nome, i) => [nome, decodeURIComponent(match[i + 1])]))
    return { rota, params }
  }
  return null
}
