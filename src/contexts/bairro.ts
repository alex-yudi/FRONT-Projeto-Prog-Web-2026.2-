import { createContext, useContext } from 'react'

export interface BairroContextValue {
  bairro: string
  setBairro: (bairro: string) => void
}

export const BairroContext = createContext<BairroContextValue>({ bairro: 'Centro', setBairro: () => {} })

export const useBairro = () => useContext(BairroContext)
