import type { ProblemDetail } from '@/lib/problem'

/** Resposta de um handler de mock. */
export interface MockResult {
  status: number
  data?: unknown
}

export const ok = (data: unknown): MockResult => ({ status: 200, data })
export const created = (data: unknown): MockResult => ({ status: 201, data })
export const noContent = (): MockResult => ({ status: 204 })

const TITULOS: Record<number, string> = {
  400: 'Erro de validação de dados de entrada',
  403: 'Acesso negado',
  404: 'Recurso não encontrado',
  409: 'Conflito',
  422: 'Regra de negócio violada',
  500: 'Erro interno',
}

/** Erro lançado pelos handlers; o servidor mock converte em ProblemDetail. */
export class MockHttpError extends Error {
  status: number
  erros?: Record<string, string>
  title?: string

  constructor(status: number, detail: string, erros?: Record<string, string>, title?: string) {
    super(detail)
    this.status = status
    this.erros = erros
    this.title = title
  }
}

export function problem(error: MockHttpError, instance: string): ProblemDetail {
  return {
    type: 'about:blank',
    title: error.title ?? TITULOS[error.status] ?? 'Erro',
    status: error.status,
    detail: error.message,
    instance,
    timestamp: new Date().toISOString(),
    ...(error.erros ? { erros: error.erros } : {}),
  }
}

export const naoEncontrado = (detail: string) => new MockHttpError(404, detail)
export const conflito = (detail: string) => new MockHttpError(409, detail)
export const regraViolada = (detail: string) => new MockHttpError(422, detail)

/** Lê um parâmetro de caminho numérico (":id"); 404 se não for número. */
export function idParam(value: string | undefined, recurso: string): number {
  const id = Number(value)
  if (!Number.isInteger(id)) throw naoEncontrado(`${recurso} não encontrado.`)
  return id
}

// ---------------------------------------------------------------------------
// Paginação: igual à API, devolve só o array, ordem id DESC, size máx. 50.
// ---------------------------------------------------------------------------
export function paginate<T extends { id: number }>(items: T[], query: URLSearchParams): T[] {
  const page = Math.max(0, Number(query.get('page') ?? 0) || 0)
  const size = Math.min(50, Math.max(1, Number(query.get('size') ?? 20) || 20))
  return [...items].sort((a, b) => b.id - a.id).slice(page * size, page * size + size)
}

// ---------------------------------------------------------------------------
// Validação no estilo Bean Validation (mensagens iguais às do backend).
// ---------------------------------------------------------------------------
type Regra = (valor: unknown) => string | null

export const regras = {
  obrigatorio:
    (msg: string): Regra =>
    (v) =>
      v === undefined || v === null || (typeof v === 'string' && v.trim() === '') ? msg : null,
  max:
    (n: number, msg: string): Regra =>
    (v) =>
      typeof v === 'string' && v.length > n ? msg : null,
  tamanho:
    (min: number, max: number, msg: string): Regra =>
    (v) =>
      typeof v === 'string' && (v.length < min || v.length > max) ? msg : null,
  padrao:
    (re: RegExp, msg: string): Regra =>
    (v) =>
      typeof v === 'string' && v !== '' && !re.test(v) ? msg : null,
  email: (msg: string): Regra => (v) =>
    typeof v === 'string' && v !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? msg : null,
  naoNegativo:
    (msg: string): Regra =>
    (v) =>
      typeof v === 'number' && v < 0 ? msg : null,
  umDe:
    (valores: readonly string[], msg: string): Regra =>
    (v) =>
      v !== undefined && v !== null && !valores.includes(String(v)) ? msg : null,
}

export const CEP = /^\d{8}$/

/** Valida o corpo; lança 400 com `erros: { campo: mensagem }` se algo falhar. */
export function validar(body: unknown, schema: Record<string, Regra[]>): Record<string, unknown> {
  if (typeof body !== 'object' || body === null) {
    throw new MockHttpError(
      400,
      'O corpo da requisição está malformado ou contém um valor inválido.',
      undefined,
      'Corpo da requisição inválido',
    )
  }
  const dados = body as Record<string, unknown>
  const erros: Record<string, string> = {}
  for (const [campo, lista] of Object.entries(schema)) {
    for (const regra of lista) {
      const msg = regra(dados[campo])
      if (msg) {
        erros[campo] = msg
        break
      }
    }
  }
  if (Object.keys(erros).length > 0) {
    throw new MockHttpError(400, 'Um ou mais campos estão inválidos. Corrija e tente novamente.', erros)
  }
  return dados
}

// ---------------------------------------------------------------------------
// Datas: LocalDateTime sem fuso, no horário de Brasília (como o backend).
// ---------------------------------------------------------------------------
function formatarLocal(date: Date): string {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Fortaleza',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)
  const p = Object.fromEntries(partes.map((x) => [x.type, x.value]))
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}`
}

export const agoraLocal = () => formatarLocal(new Date())

/** Data/hora local de "N minutos atrás" — usada no seed para o "postado há 3h". */
export const minutosAtras = (min: number) => formatarLocal(new Date(Date.now() - min * 60_000))

/** Data yyyy-MM-dd daqui a N dias. */
export const diasAFrente = (dias: number) =>
  formatarLocal(new Date(Date.now() + dias * 86_400_000)).slice(0, 10)

/** Próximo domingo (hoje, se hoje for domingo), em yyyy-MM-dd — "válido até domingo". */
export function proximoDomingo(): string {
  const hoje = new Date(agoraLocal())
  return diasAFrente((7 - hoje.getDay()) % 7)
}
