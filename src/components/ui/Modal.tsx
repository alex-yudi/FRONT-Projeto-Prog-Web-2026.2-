import { useEffect, type ReactNode } from 'react'

interface Props {
  onClose: () => void
  /** Largura máxima do cartão em px (Figma: 466 nos formulários, 333 na confirmação). */
  largura?: number
  titulo: string
  children: ReactNode
}

/** Cartão centralizado sobre fundo escuro. Fecha com Esc ou clicando fora. */
export default function Modal({ onClose, largura = 466, titulo, children }: Props) {
  useEffect(() => {
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', aoTeclar)
    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', aoTeclar)
      document.body.style.overflow = overflowAnterior
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-overlay p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        style={{ maxWidth: largura }}
        className="w-full rounded-[16px] bg-fundo p-6 shadow-card sm:p-8"
      >
        {children}
      </div>
    </div>
  )
}
