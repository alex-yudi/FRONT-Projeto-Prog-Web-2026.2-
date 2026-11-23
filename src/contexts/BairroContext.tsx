import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getBairros } from '@/services/bairros.service'
import type { BairroResponse } from '@/types'

export interface BairroValue {
  /** Todos os bairros disponíveis (seletor da Topbar). */
  bairros: BairroResponse[]
  /** Nome do bairro selecionado (padrão: Centro). */
  nome: string
  /** Dados do bairro selecionado, quando a lista já carregou. */
  atual: BairroResponse | null
  selecionar: (nome: string) => void
}

export const BairroContext = createContext<BairroValue | null>(null)

const CHAVE = 'bairro.selecionado'
const PADRAO = 'Centro'

function lerSalvo(): string {
  try {
    return window.localStorage.getItem(CHAVE) ?? PADRAO
  } catch {
    return PADRAO
  }
}

export function BairroProvider({ children }: { children: ReactNode }) {
  const [bairros, setBairros] = useState<BairroResponse[]>([])
  const [nome, setNome] = useState<string>(lerSalvo)

  useEffect(() => {
    getBairros().then(setBairros, () => setBairros([]))
  }, [])

  const selecionar = useCallback((novo: string) => {
    setNome(novo)
    try {
      window.localStorage.setItem(CHAVE, novo)
    } catch {
      // sem localStorage: a escolha vale só nesta sessão
    }
  }, [])

  const valor = useMemo(
    () => ({ bairros, nome, atual: bairros.find((b) => b.nome === nome) ?? null, selecionar }),
    [bairros, nome, selecionar],
  )
  return <BairroContext.Provider value={valor}>{children}</BairroContext.Provider>
}
