import { useState, type FormEvent } from 'react'
import { getProblem } from '@/lib/problem'
import { criarAviso } from '@/services/avisos.service'
import type { CategoriaAviso } from '@/types'

const CATEGORIAS: { valor: CategoriaAviso; rotulo: string; largura: string }[] = [
  { valor: 'PRECO', rotulo: 'Preço / Promoção', largura: 'w-[160px]' },
  { valor: 'ESTOQUE', rotulo: 'Estoque', largura: 'w-[88px]' },
  { valor: 'ATENDIMENTO', rotulo: 'Atendimento', largura: 'w-[120px]' },
]

interface Props {
  negocioId: number
  negocioNome: string
  onClose: () => void
  onSaved: () => void
}

export default function PostarAvisoModal({ negocioId, negocioNome, onClose, onSaved }: Props) {
  const [categoria, setCategoria] = useState<CategoriaAviso>('PRECO')
  const [texto, setTexto] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setEnviando(true)
    try {
      await criarAviso(negocioId, { categoria, texto })
      onSaved()
    } catch (err) {
      const problema = getProblem(err)
      setErro(problema.erros?.texto ?? problema.detail)
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-overlay p-4">
      <form onSubmit={enviar} className="min-h-[520px] w-[560px] max-w-full rounded-2xl bg-fundo px-10 pt-9 pb-4 font-corpo">
        <p className="text-[13px] leading-[18px] text-texto-secundario">VOCÊ ESTÁ EM</p>
        <h2 className="mt-1 font-display text-2xl leading-7 font-black">📍 {negocioNome}</h2>

        <p className="mt-[30px] text-[13px] leading-4 font-semibold">O que você quer avisar aos vizinhos?</p>
        <div className="mt-4 flex gap-3">
          {CATEGORIAS.map((c) => (
            <button
              key={c.valor}
              type="button"
              onClick={() => setCategoria(c.valor)}
              className={`h-9 ${c.largura} cursor-pointer rounded-pilula px-4 text-left text-[13px] font-semibold transition ${categoria === c.valor ? 'bg-primaria text-fundo' : 'border border-borda bg-superficie hover:border-primaria'
                }`}
            >
              {c.rotulo}
            </button>
          ))}
        </div>

        <textarea
          className="mt-5 block h-[140px] w-full rounded-input border border-borda bg-superficie px-4 py-3.5 text-[15px] outline-primaria"
          placeholder="Ex: carne moída está sem promoção até amanhã..."
          value={texto}
          onChange={(e) => {
            setTexto(e.target.value)
            setErro('')
          }}
        />
        {erro && <p className="mt-2 text-sm text-perigo">{erro}</p>}

        <p className="mt-3.5 text-[13px] leading-[18px] text-texto-secundario">
          Seu post fica visível com seu nome de usuário e pode ser confirmado ou contestado por outros vizinhos.
        </p>

        <button
          type="submit"
          disabled={enviando}
          className="mt-[26px] h-[52px] w-full cursor-pointer rounded-card bg-primaria font-semibold text-fundo transition hover:brightness-110 active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
        >
          Publicar aviso
        </button>
        <button type="button" onClick={onClose} className="mt-3 w-full cursor-pointer text-sm leading-[17px] text-texto-secundario transition hover:text-texto">
          Cancelar
        </button>
      </form>
    </div>
  )
}
