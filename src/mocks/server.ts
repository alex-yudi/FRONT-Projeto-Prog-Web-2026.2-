import { ApiError } from '@/lib/problem'
import { getToken } from '@/lib/token'
import { db } from './db'
import { MockHttpError, problem, type MockResult } from './helpers'
import { lerToken } from './jwt'
import { rotas } from './handlers'
import { compilar, encontrar, type Metodo } from './router'

const rotasCompiladas = compilar(rotas)

type Params = object

function montarQuery(params?: Params): URLSearchParams {
  const query = new URLSearchParams()
  for (const [chave, valor] of Object.entries(params ?? {})) {
    if (valor !== undefined && valor !== null && valor !== '') query.set(chave, String(valor))
  }
  return query
}

/**
 * "Servidor" mockado: recebe método + caminho (relativo a /api/v1), como uma requisição HTTP,
 * e responde a partir de src/mocks/handlers.
 * Resolve com os dados da resposta, ou rejeita com ApiError contendo o ProblemDetail
 * (validação, não encontrado, conflito).
 */
export async function request<T>(method: Metodo, path: string, opcoes: { params?: Params; body?: unknown } = {}): Promise<T> {
  const instance = `/api/v1${path}`
  let resultado: MockResult
  try {
    const achado = encontrar(rotasCompiladas, method, path)
    if (!achado) throw new MockHttpError(404, `Nenhum endpoint mockado para ${method.toUpperCase()} ${instance}.`)

    // Quem está logado (pelo token salvo no login); null se ninguém.
    const payload = lerToken(getToken())
    const usuario = payload ? (db.usuarios.find((u) => u.ativo && u.email === payload.sub) ?? null) : null

    resultado = achado.rota.handler({
      params: achado.params,
      query: montarQuery(opcoes.params),
      // Cópia: a tela não compartilha objetos com o "banco".
      body: opcoes.body === undefined ? undefined : structuredClone(opcoes.body),
      usuario,
    })
  } catch (erro) {
    const httpErro = erro instanceof MockHttpError ? erro : new MockHttpError(500, String((erro as Error)?.message ?? erro))
    if (!(erro instanceof MockHttpError)) console.error('[mock]', erro)
    resultado = { status: httpErro.status, data: problem(httpErro, instance) }
  }

  if (resultado.status >= 400) throw new ApiError(resultado.data as ReturnType<typeof problem>)
  return (resultado.data === undefined ? undefined : structuredClone(resultado.data)) as T
}

/** Atalhos usados pelos services: `mockApi.get<NegocioResponse[]>('/negocios', { bairro })`. */
export const mockApi = {
  get: <T>(path: string, params?: Params) => request<T>('get', path, { params }),
  post: <T>(path: string, body?: unknown) => request<T>('post', path, { body }),
  put: <T>(path: string, body?: unknown) => request<T>('put', path, { body }),
  patch: <T>(path: string, body?: unknown) => request<T>('patch', path, { body }),
  delete: (path: string) => request<void>('delete', path),
}
