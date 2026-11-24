import { useState, type FormEvent } from 'react'
import Button from '@/components/ui/Button'
import ChipGroup from '@/components/ui/ChipGroup'
import { MensagemForm } from '@/components/ui/Estados'
import { Select, Textarea } from '@/components/ui/Field'
import Modal from '@/components/ui/Modal'
import { useAsync } from '@/hooks/useAsync'
import { getProblem, type ProblemDetail } from '@/lib/problem'
import { atualizarAviso, criarAviso } from '@/services/avisos.service'
import { getNegocios } from '@/services/negocios.service'
import type { AvisoResponse, CategoriaAviso } from '@/types'
import { CATEGORIAS_AVISO } from '@/utils/format'

interface Props {
  /** Negócio que vai receber o aviso. Sem ele (e sem `aviso`), a pessoa escolhe de uma lista. */
  negocio?: { id: number; nome: string } | null
  /** Se informado, o modal edita este aviso em vez de criar um novo. */
  aviso?: AvisoResponse | null
  onClose: () => void
  /** Chamado depois de salvar, para a tela recarregar a lista. */
  onSaved: () => void
}

// Figma: Consumidor 5 — Postar Informação (modal) e "Editar informação".
export default function AvisoFormModal({ negocio, aviso, onClose, onSaved }: Props) {
  const editando = !!aviso
  const precisaEscolher = !editando && !negocio
  const [categoria, setCategoria] = useState<CategoriaAviso>(aviso?.categoria ?? 'PRECO')
  const [texto, setTexto] = useState(aviso?.texto ?? '')
  const [negocioId, setNegocioId] = useState<string>(negocio ? String(negocio.id) : '')
  const [problema, setProblema] = useState<ProblemDetail | null>(null)
  const [enviando, setEnviando] = useState(false)

  const lista = useAsync(() => (precisaEscolher ? getNegocios({ size: 50 }) : Promise.resolve([])), [precisaEscolher])

  const nomeNegocio = aviso
    ? (aviso.negocioNome ?? 'este negócio')
    : (negocio?.nome ?? lista.data?.find((n) => String(n.id) === negocioId)?.nome)

  async function enviar(e: FormEvent) {
    e.preventDefault()
    const id = aviso ? aviso.negocioId : Number(negocioId)
    if (!id) {
      setProblema({ ...getProblem(null), detail: 'Escolha o negócio sobre o qual quer avisar.' })
      return
    }
    setEnviando(true)
    setProblema(null)
    try {
      if (aviso) await atualizarAviso(id, aviso.id, { categoria, texto })
      else await criarAviso(id, { categoria, texto })
      onSaved()
    } catch (erro) {
      setProblema(getProblem(erro))
      setEnviando(false)
    }
  }

  return (
    <Modal onClose={onClose} titulo={editando ? 'Editar aviso' : 'Postar aviso'}>
      <form onSubmit={enviar} className="flex flex-col gap-4" noValidate>
        <div>
          <p className="font-corpo text-[11px] uppercase tracking-wide text-texto-secundario">Você está em</p>
          {precisaEscolher ? (
            <Select
              label="Escolha o negócio"
              value={negocioId}
              onChange={(e) => setNegocioId(e.target.value)}
              disabled={lista.carregando}
            >
              <option value="">{lista.carregando ? 'Carregando…' : 'Selecione…'}</option>
              {lista.data?.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.nome} — {n.bairro}
                </option>
              ))}
            </Select>
          ) : (
            <h2 className="font-display text-2xl font-black text-texto">
              <span aria-hidden="true">📍 </span>
              {nomeNegocio}
            </h2>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="font-rotulo text-xs font-bold text-texto">O que você quer avisar aos vizinhos?</p>
          <ChipGroup
            rotulo="Categoria do aviso"
            opcoes={CATEGORIAS_AVISO}
            valor={categoria}
            onChange={setCategoria}
          />
          {problema?.erros?.categoria && <p className="text-xs text-perigo">{problema.erros.categoria}</p>}
        </div>

        <Textarea
          label="Aviso"
          className="min-h-[116px] font-corpo"
          placeholder="Ex: carne moída está em promoção até amanhã…"
          maxLength={500}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          erro={problema?.erros?.texto}
          ajuda="Seu post fica visível com seu nome de usuário e pode ser confirmado ou contestado por outros vizinhos."
        />

        {problema && !problema.erros && <MensagemForm>{problema.detail}</MensagemForm>}

        <div className="flex flex-col items-center gap-3">
          <Button type="submit" bloco carregando={enviando}>
            {editando ? 'Salvar alterações' : 'Publicar aviso'}
          </Button>
          <button type="button" onClick={onClose} className="font-corpo text-[13px] text-texto-secundario">
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  )
}
