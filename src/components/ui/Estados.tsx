import type { ReactNode } from 'react'
import type { ProblemDetail } from '@/lib/problem'
import Button from './Button'

export function Carregando({ texto = 'Carregando…' }: { texto?: string }) {
  return (
    <p role="status" className="py-8 text-center font-corpo text-sm text-texto-secundario">
      {texto}
    </p>
  )
}

export function ErroBox({ erro, onRetry }: { erro: ProblemDetail; onRetry?: () => void }) {
  return (
    <div role="alert" className="rounded-card border border-perigo bg-alerta-fundo p-4 text-center">
      <p className="font-corpo text-sm text-perigo">{erro.detail}</p>
      {onRetry && (
        <Button variante="contornoPerigo" pequeno className="mt-3" onClick={onRetry}>
          Tentar de novo
        </Button>
      )}
    </div>
  )
}

export function Vazio({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-card border border-dashed border-borda bg-fundo-claro p-6 text-center font-corpo text-sm text-texto-secundario">
      {children}
    </div>
  )
}

/** Mensagem de erro de formulário (corpo geral, quando não há erro por campo). */
export function MensagemForm({ children, tipo = 'erro' }: { children: ReactNode; tipo?: 'erro' | 'sucesso' }) {
  return (
    <p
      role={tipo === 'erro' ? 'alert' : 'status'}
      className={`rounded-input px-3 py-2 font-corpo text-sm ${
        tipo === 'erro' ? 'bg-alerta-fundo text-perigo' : 'bg-primaria/10 text-primaria'
      }`}
    >
      {children}
    </p>
  )
}
