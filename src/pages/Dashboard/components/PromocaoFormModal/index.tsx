// Figma: 3:108 — Criar Promocao (Modal) · 62:32 — Editar Promoção
import { useState, type FormEvent } from 'react'
import { Campo, Input, Textarea } from '@/components/ui/Campo'
import { getProblem } from '@/lib/problem'
import { atualizarOferta, criarOferta } from '@/services/ofertas.service'
import type { OfertaResponse } from '@/types'

type Validade = 'hoje' | 'semana' | 'mes'

/** O mock exige descrição; o Figma diz "Detalhes (opcional)". */
const SEM_DETALHES = 'Sem detalhes'

// Larguras dos chips iguais às do Figma.
const OPCOES: { valor: Validade; rotulo: string; largura: string }[] = [
  { valor: 'hoje', rotulo: 'Hoje', largura: 'w-[90px]' },
  { valor: 'semana', rotulo: 'Essa semana', largura: 'w-[150px]' },
  { valor: 'mes', rotulo: 'Esse mês', largura: 'w-[130px]' },
]

/** Data local no formato yyyy-MM-dd. */
function formatarData(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Hoje = hoje; Essa semana = próximo domingo; Esse mês = último dia do mês. */
function calcularValidade(opcao: Validade) {
  const hoje = new Date()
  if (opcao === 'semana') hoje.setDate(hoje.getDate() + ((7 - hoje.getDay()) % 7))
  if (opcao === 'mes') return formatarData(new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0))
  return formatarData(hoje)
}

interface Props {
  negocioId: number
  /** Sem oferta = "Nova promoção"; com oferta = "Editar promoção". */
  oferta?: OfertaResponse
  onClose: () => void
  onSaved: () => void
}

export default function PromocaoFormModal({ negocioId, oferta, onClose, onSaved }: Props) {
  const [nome, setNome] = useState(oferta?.nome ?? '')
  const [preco, setPreco] = useState(oferta ? oferta.preco.toFixed(2).replace('.', ',') : '')
  const [validade, setValidade] = useState<Validade | null>(oferta ? null : 'hoje')
  const [detalhes, setDetalhes] = useState(oferta?.descricao === SEM_DETALHES ? '' : (oferta?.descricao ?? ''))
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar(e: FormEvent) {
    e.preventDefault()
    // Aceita "3,20", "3.20" e "R$ 3,20". Vazio não pode virar 0 (promoção grátis sem querer).
    const precoLimpo = preco.replace(/[^\d,.]/g, '').replace(',', '.')
    if (!precoLimpo) return setErro('O preço é obrigatório!')
    const dados = {
      nome,
      preco: Number(precoLimpo),
      descricao: detalhes.trim() || SEM_DETALHES,
      validade: validade ? calcularValidade(validade) : (oferta?.validade ?? null),
    }
    setEnviando(true)
    try {
      if (oferta) await atualizarOferta(negocioId, oferta.id, dados)
      else await criarOferta(negocioId, dados)
      onSaved()
    } catch (err) {
      const problema = getProblem(err)
      setErro(Object.values(problema.erros ?? {})[0] ?? problema.detail)
      setEnviando(false)
    }
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-overlay p-4">
      <form onSubmit={enviar} className="min-h-[660px] w-[560px] max-w-full rounded-2xl bg-fundo px-10 pt-9 pb-10 font-rotulo">
        <h2 className="text-2xl leading-8 font-extrabold">{oferta ? 'Editar promoção' : 'Nova promoção'}</h2>

        {erro && <p className="mt-4 rounded-input bg-alerta-fundo p-3 text-sm text-perigo">{erro}</p>}

        <Campo rotulo="Produto ou serviço" className="mt-6">
          <Input placeholder="Ex: Alface crespa" value={nome} onChange={(e) => setNome(e.target.value)} />
        </Campo>

        <Campo rotulo="Preço promocional" className="mt-4">
          <Input placeholder="R$ 3,20" inputMode="decimal" value={preco} onChange={(e) => setPreco(e.target.value)} />
        </Campo>

        <Campo rotulo="Válido por" className="mt-4">
          <div className="flex gap-3">
            {OPCOES.map((o) => (
              <button
                key={o.valor}
                type="button"
                onClick={() => setValidade(o.valor)}
                className={`h-9 ${o.largura} cursor-pointer rounded-pilula px-4 text-left text-[13px] font-semibold transition ${
                  validade === o.valor ? 'bg-primaria text-white' : 'border-[1.5px] border-borda bg-superficie hover:border-primaria'
                }`}
              >
                {o.rotulo}
              </button>
            ))}
          </div>
        </Campo>

        <Campo rotulo="Detalhes (opcional)" className="mt-[26px]">
          <Textarea
            placeholder="Ex: leve 3 pague 2, válido enquanto durar o estoque"
            value={detalhes}
            onChange={(e) => setDetalhes(e.target.value)}
          />
        </Campo>

        <button
          type="submit"
          disabled={enviando}
          className="mt-7 h-[52px] w-full cursor-pointer rounded-card bg-primaria font-semibold text-white transition hover:brightness-110 active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
        >
          {oferta ? 'Salvar alterações' : 'Publicar promoção'}
        </button>
        <button type="button" onClick={onClose} className="mt-[18px] w-full cursor-pointer text-sm leading-5 text-texto-secundario transition hover:text-texto">
          Cancelar
        </button>
      </form>
    </div>
  )
}
