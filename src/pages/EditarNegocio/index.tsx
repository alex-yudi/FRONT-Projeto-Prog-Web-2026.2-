// Figma: 29:26 — Dono 4 — Editar Negocio
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import NegocioForm from '@/components/negocio/NegocioForm'
import { getProblem } from '@/lib/problem'
import { PATHS } from '@/routes/paths'
import { atualizarNegocio, excluirNegocio, getNegocio } from '@/services/negocios.service'
import type { NegocioRequest } from '@/types'

export default function EditarNegocioPage() {
  const id = Number(useParams().id)
  const navigate = useNavigate()
  const [inicial, setInicial] = useState<NegocioRequest | null>(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    getNegocio(id)
      .then(({ nome, categoria, cep, numero, bairro, descricao }) =>
        setInicial({ nome, categoria, cep: cep.replace(/^(\d{5})(\d{3})$/, '$1-$2'), numero, bairro, descricao }),
      )
      .catch((err) => setErro(getProblem(err).detail))
  }, [id])

  if (!inicial) {
    return <p className="mx-auto w-full max-w-[592px] px-4 py-10 font-rotulo text-texto-secundario">{erro || 'Carregando...'}</p>
  }

  async function salvar(dados: NegocioRequest) {
    await atualizarNegocio(id, dados)
    navigate(PATHS.painel)
  }

  async function excluir() {
    if (!window.confirm(`Excluir "${inicial?.nome}" permanentemente? Isso remove também promoções e avisos.`)) return
    await excluirNegocio(id)
    navigate(PATHS.feed)
  }

  return (
    <div className="mx-auto w-full max-w-[592px] px-4 py-10 font-rotulo">
      <h1 className="text-[28px] leading-[34px] font-extrabold">Editar negócio</h1>
      <p className="mt-1.5 text-[15px] leading-[18px] text-texto-secundario">Atualize as informações da {inicial.nome}.</p>

      <NegocioForm inicial={inicial} textoBotao="Salvar alterações" onSubmit={salvar} />

      <section className="mt-10 rounded-card border-[1.5px] border-perigo/40 bg-alerta-fundo px-6 pt-5 pb-3.5">
        <h2 className="leading-5 font-bold text-perigo">Zona de risco</h2>
        <p className="mt-2 text-[13px] leading-4 text-[#7f4c42]">
          Desativar temporariamente esconde seu negócio do mapa. Excluir remove tudo — inclusive avisos e histórico — e
          não pode ser desfeito.
        </p>
        <div className="mt-4 flex items-center gap-5">
          <button
            type="button"
            disabled
            title="Em breve"
            className="h-10 w-[210px] cursor-not-allowed rounded-input border-[1.5px] border-perigo bg-superficie text-sm font-semibold text-perigo"
          >
            Desativar negócio
          </button>
          <button type="button" onClick={excluir} className="cursor-pointer text-sm font-semibold text-perigo underline-offset-2 hover:underline">
            Excluir negócio permanentemente
          </button>
        </div>
      </section>
    </div>
  )
}
