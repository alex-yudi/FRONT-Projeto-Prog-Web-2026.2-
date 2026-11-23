import { useCallback, useEffect, useRef, useState, type DependencyList } from 'react'
import { getProblem, type ProblemDetail } from '@/lib/problem'

interface Estado<T> {
  data: T | null
  carregando: boolean
  erro: ProblemDetail | null
}

/**
 * Executa uma chamada assíncrona (normalmente um service) e acompanha o estado.
 * - Roda de novo quando `deps` muda (os dados antigos são descartados).
 * - `recarregar()` busca de novo mantendo os dados atuais na tela até a resposta chegar.
 */
export function useAsync<T>(fn: () => Promise<T>, deps: DependencyList) {
  const [estado, setEstado] = useState<Estado<T>>({ data: null, carregando: true, erro: null })
  const [tick, setTick] = useState(0)
  const chaveAnterior = useRef('')

  useEffect(() => {
    let cancelado = false
    const chave = JSON.stringify(deps)
    const mudou = chave !== chaveAnterior.current
    chaveAnterior.current = chave

    setEstado((atual) => ({ data: mudou ? null : atual.data, carregando: true, erro: null }))
    fn().then(
      (data) => {
        if (!cancelado) setEstado({ data, carregando: false, erro: null })
      },
      (erro: unknown) => {
        if (!cancelado) setEstado((atual) => ({ data: atual.data, carregando: false, erro: getProblem(erro) }))
      },
    )
    return () => {
      cancelado = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick])

  const recarregar = useCallback(() => setTick((t) => t + 1), [])
  return { ...estado, recarregar }
}
