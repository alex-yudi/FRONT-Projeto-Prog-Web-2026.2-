// Figma: 29:133 — Dono 6 — Encerrar Promocao (Modal)
import { useState } from 'react'
import { excluirOferta } from '@/services/ofertas.service'
import type { OfertaResponse } from '@/types'

interface Props {
  negocioId: number
  oferta: OfertaResponse
  onClose: () => void
  onDone: () => void
}

export default function EncerrarPromocaoModal({ negocioId, oferta, onClose, onDone }: Props) {
  const [enviando, setEnviando] = useState(false)

  async function encerrar() {
    setEnviando(true)
    await excluirOferta(negocioId, oferta.id)
    onDone()
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-overlay p-4">
      <div className="w-[400px] max-w-full rounded-[14px] bg-fundo px-8 pt-7 pb-6 font-rotulo">
        <h2 className="text-[19px] leading-6 font-extrabold">Encerrar "{oferta.nome}"?</h2>
        <p className="mt-3 text-sm leading-[17px] text-texto-secundario">
          A promoção some do seu perfil e do feed dos vizinhos imediatamente. Isso não pode ser desfeito.
        </p>
        <div className="mt-[37px] flex gap-4">
          <button onClick={onClose} className="h-11 w-40 cursor-pointer rounded-input border-[1.5px] border-borda bg-superficie text-sm font-semibold transition hover:border-texto-suave hover:bg-fundo-claro">
            Cancelar
          </button>
          <button
            onClick={encerrar}
            disabled={enviando}
            className="h-11 w-40 cursor-pointer rounded-input bg-perigo text-sm font-semibold text-white transition hover:brightness-110 active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
          >
            Encerrar
          </button>
        </div>
      </div>
    </div>
  )
}
