import type { ComponentProps, ReactNode } from 'react'

const base = 'w-full rounded-input border-[1.5px] border-borda bg-superficie outline-primaria'

interface CampoProps {
  rotulo: string
  erro?: string
  className?: string
  children: ReactNode
}

export function Campo({ rotulo, erro, className = '', children }: CampoProps) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-[13px] leading-4 font-semibold">{rotulo}</label>
      {children}
      {erro && <p className="mt-1 text-xs text-perigo">{erro}</p>}
    </div>
  )
}

export function Input(props: ComponentProps<'input'>) {
  return <input {...props} className={`${base} h-11 px-3.5 text-[15px]`} />
}

export function Select(props: ComponentProps<'select'>) {
  return <select {...props} className={`${base} h-11 px-3.5 text-[15px]`} />
}

export function Textarea(props: ComponentProps<'textarea'>) {
  return <textarea {...props} className={`${base} block h-[88px] px-3.5 py-3 text-sm`} />
}
