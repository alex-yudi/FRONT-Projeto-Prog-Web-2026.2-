import { useState, type ReactNode } from 'react'
import { BairroContext } from './bairro'

const CHAVE = 'bairro.selecionado'

function lerSalvo() {
  try {
    return localStorage.getItem(CHAVE) ?? 'Centro'
  } catch {
    return 'Centro'
  }
}

export default function BairroProvider({ children }: { children: ReactNode }) {
  const [bairro, setBairroState] = useState(lerSalvo)

  function setBairro(novo: string) {
    setBairroState(novo)
    try {
      localStorage.setItem(CHAVE, novo)
    } catch {
      return
    }
  }

  return <BairroContext.Provider value={{ bairro, setBairro }}>{children}</BairroContext.Provider>
}
