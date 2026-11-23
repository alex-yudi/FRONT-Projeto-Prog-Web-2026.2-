import type { ButtonHTMLAttributes } from 'react'
import { classeBotao, type VarianteBotao } from './buttonClass'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: VarianteBotao
  bloco?: boolean
  pequeno?: boolean
  carregando?: boolean
}

export default function Button({
  variante = 'primario',
  bloco,
  pequeno,
  carregando,
  disabled,
  className = '',
  type = 'button',
  children,
  ...resto
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled || carregando}
      className={`${classeBotao(variante, { bloco, pequeno })} ${className}`}
      {...resto}
    >
      {carregando ? 'Aguarde…' : children}
    </button>
  )
}
