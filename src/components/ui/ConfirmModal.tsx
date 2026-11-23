import { useState } from 'react'
import { getProblem } from '@/lib/problem'
import Button from './Button'
import Modal from './Modal'

interface Props {
  titulo: string
  texto: string
  rotuloConfirmar: string
  onConfirm: () => Promise<void>
  onClose: () => void
}

/** Confirmação destrutiva (Figma: "Encerrar promoção"): Cancelar + botão vermelho. */
export default function ConfirmModal({ titulo, texto, rotuloConfirmar, onConfirm, onClose }: Props) {
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function confirmar() {
    setCarregando(true)
    setErro(null)
    try {
      await onConfirm()
    } catch (e) {
      setErro(getProblem(e).detail)
      setCarregando(false)
    }
  }

  return (
    <Modal onClose={onClose} largura={333} titulo={titulo}>
      <h2 className="font-rotulo text-lg font-extrabold text-texto">{titulo}</h2>
      <p className="mt-3 font-corpo text-[13px] leading-snug text-texto-secundario">{texto}</p>
      {erro && (
        <p role="alert" className="mt-3 font-corpo text-xs text-perigo">
          {erro}
        </p>
      )}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button variante="secundario" onClick={onClose} disabled={carregando}>
          Cancelar
        </Button>
        <Button variante="perigo" onClick={confirmar} carregando={carregando}>
          {rotuloConfirmar}
        </Button>
      </div>
    </Modal>
  )
}
