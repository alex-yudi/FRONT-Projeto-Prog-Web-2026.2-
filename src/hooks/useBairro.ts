import { useContext } from 'react'
import { BairroContext, type BairroValue } from '@/contexts/BairroContext'

export function useBairro(): BairroValue {
  const contexto = useContext(BairroContext)
  if (!contexto) throw new Error('useBairro precisa estar dentro de <BairroProvider>.')
  return contexto
}
