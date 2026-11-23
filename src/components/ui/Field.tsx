import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'

const campo =
  'w-full rounded-input border bg-superficie px-3 font-rotulo text-sm text-texto placeholder:text-texto-suave disabled:bg-fundo-claro disabled:text-texto-suave'
const borda = (erro?: string) => (erro ? 'border-perigo' : 'border-borda')

interface Comum {
  label: string
  erro?: string
  ajuda?: ReactNode
}

function Rotulo({ id, label, erro, ajuda, children }: Comum & { id: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-rotulo text-xs font-semibold text-texto">
        {label}
      </label>
      {children}
      {erro ? (
        <p role="alert" className="font-corpo text-xs text-perigo">
          {erro}
        </p>
      ) : ajuda ? (
        <p className="font-corpo text-xs text-texto-secundario">{ajuda}</p>
      ) : null}
    </div>
  )
}

export function Input({ label, erro, ajuda, className = '', ...resto }: Comum & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <Rotulo id={id} label={label} erro={erro} ajuda={ajuda}>
      <input id={id} className={`${campo} ${borda(erro)} h-9 ${className}`} aria-invalid={!!erro} {...resto} />
    </Rotulo>
  )
}

export function Textarea({
  label,
  erro,
  ajuda,
  className = '',
  ...resto
}: Comum & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()
  return (
    <Rotulo id={id} label={label} erro={erro} ajuda={ajuda}>
      <textarea
        id={id}
        className={`${campo} ${borda(erro)} min-h-[72px] resize-y py-2 ${className}`}
        aria-invalid={!!erro}
        {...resto}
      />
    </Rotulo>
  )
}

export function Select({
  label,
  erro,
  ajuda,
  className = '',
  children,
  ...resto
}: Comum & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId()
  return (
    <Rotulo id={id} label={label} erro={erro} ajuda={ajuda}>
      <select id={id} className={`${campo} ${borda(erro)} h-9 ${className}`} aria-invalid={!!erro} {...resto}>
        {children}
      </select>
    </Rotulo>
  )
}
