/** Formato de erro da API (Spring ProblemDetail), reproduzido pelos mocks. */
export interface ProblemDetail {
  type: string
  title: string
  status: number
  detail: string
  instance: string
  timestamp: string
  /** Só em erro de validação (400): { campo: mensagem }. */
  erros?: Record<string, string>
}

/** Erro rejeitado pelos services quando a pseudo-requisição falha. */
export class ApiError extends Error {
  problem: ProblemDetail

  constructor(problem: ProblemDetail) {
    super(problem.detail)
    this.name = 'ApiError'
    this.problem = problem
  }
}

/**
 * Extrai o ProblemDetail de um erro vindo de um service.
 * Uso: `catch (err) { const { status, detail, erros } = getProblem(err) }`
 */
export function getProblem(error: unknown): ProblemDetail {
  if (error instanceof ApiError) return error.problem
  return {
    type: 'about:blank',
    title: 'Erro inesperado',
    status: 0,
    detail: 'Algo deu errado. Tente novamente.',
    instance: '',
    timestamp: new Date().toISOString(),
  }
}
