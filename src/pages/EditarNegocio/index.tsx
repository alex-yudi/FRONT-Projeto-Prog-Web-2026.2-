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
<<<<<<< Updated upstream
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
=======
  const [bairros, setBairros] = useState<BairroResponse[]>([])
  const [form, setForm] = useState<NegocioRequest | null>(null)
  const [nomeAtual, setNomeAtual] = useState('')
  const [erros, setErros] = useState<Record<string, string>>({})
  const [erroGeral, setErroGeral] = useState('')

  useEffect(() => {
    getBairros().then(setBairros)
    getNegocio(id)
      .then(({ nome, categoria, cep, numero, bairro, descricao }) => {
        setForm({ nome, categoria, cep: cep.replace(/^(\d{5})(\d{3})$/, '$1-$2'), numero, bairro, descricao })
        setNomeAtual(nome)
      })
      .catch((err) => setErroGeral(getProblem(err).detail))
  }, [id])

  if (!form) {
    return <p className="mx-auto w-full max-w-[592px] px-4 py-10 font-rotulo text-texto-secundario">{erroGeral || 'Carregando...'}</p>
  }

  const alterar = (campo: keyof NegocioRequest, valor: string) => setForm({ ...form, [campo]: valor })

  async function salvar(e: FormEvent) {
    e.preventDefault()
    if (!form) return
    try {
      await atualizarNegocio(id, { ...form, cep: form.cep.replace(/\D/g, '') })
      navigate(PATHS.painel)
    } catch (err) {
      const problema = getProblem(err)
      setErros(problema.erros ?? {})
      setErroGeral(problema.detail)
    }
  }

  async function excluir() {
    if (!window.confirm(`Excluir "${nomeAtual}" permanentemente? Isso remove também promoções e avisos.`)) return
>>>>>>> Stashed changes
    await excluirNegocio(id)
    navigate(PATHS.feed)
  }

  return (
<<<<<<< Updated upstream
    <div className="mx-auto w-full max-w-[592px] px-4 py-10 font-rotulo">
      <h1 className="text-[28px] leading-[34px] font-extrabold">Editar negócio</h1>
      <p className="mt-1.5 text-[15px] leading-[18px] text-texto-secundario">Atualize as informações da {inicial.nome}.</p>

      <NegocioForm inicial={inicial} textoBotao="Salvar alterações" onSubmit={salvar} />
=======
    <form onSubmit={salvar} className="mx-auto w-full max-w-[592px] px-4 py-10 font-rotulo">
      <h1 className="text-[28px] leading-[34px] font-extrabold">Editar negócio</h1>
      <p className="mt-1.5 text-[15px] leading-[18px] text-texto-secundario">Atualize as informações da {nomeAtual}.</p>

      {erroGeral && <p className="mt-4 rounded-input bg-alerta-fundo p-3 text-sm text-perigo">{erroGeral}</p>}

      <div className="mt-[46px] flex h-[120px] items-center justify-center rounded-card border-[1.5px] border-borda bg-superficie text-[15px] text-texto-suave">
        📷 Adicionar foto do negócio
      </div>

      <label className={`${rotulo} mt-7`}>Nome do negócio</label>
      <input className={input} value={form.nome} onChange={(e) => alterar('nome', e.target.value)} />
      <Erro texto={erros.nome} />

      <span className={`${rotulo} mt-4`}>Categoria</span>
      <div className="flex flex-wrap gap-3">
        {CATEGORIAS.map((c) => (
          <button
            key={c.valor}
            type="button"
            onClick={() => alterar('categoria', c.valor)}
            className={`h-9 ${c.largura} cursor-pointer rounded-pilula px-4 text-left text-[13px] font-semibold transition ${form.categoria === c.valor ? 'bg-primaria text-white' : 'border-[1.5px] border-borda bg-superficie hover:border-primaria'
              }`}
          >
            {c.rotulo}
          </button>
        ))}
      </div>

      <div className="mt-[26px] grid grid-cols-2 gap-10">
        <div>
          <label className={rotulo}>CEP</label>
          <input className={input} value={form.cep} onChange={(e) => alterar('cep', e.target.value)} />
          <Erro texto={erros.cep} />
        </div>
        <div>
          <label className={rotulo}>Número</label>
          <input className={input} value={form.numero} onChange={(e) => alterar('numero', e.target.value)} />
          <Erro texto={erros.numero} />
        </div>
      </div>

      <label className={`${rotulo} mt-4`}>Bairro</label>
      <select className={input} value={form.bairro} onChange={(e) => alterar('bairro', e.target.value)}>
        {bairros.map((b) => (
          <option key={b.nome}>{b.nome}</option>
        ))}
      </select>

      <label className={`${rotulo} mt-4`}>Descrição curta</label>
      <textarea
        className={textarea}
        value={form.descricao}
        onChange={(e) => alterar('descricao', e.target.value)}
      />
      <Erro texto={erros.descricao} />

      <button type="submit" className="mt-7 h-[52px] w-full rounded-card bg-primaria font-semibold text-white cursor-pointer transition hover:brightness-110 active:scale-[0.99]">
        Salvar alterações
      </button>
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
          <button type="button" onClick={excluir} className="cursor-pointer text-sm font-semibold text-perigo underline-offset-2 hover:underline">
=======
          <button type="button" onClick={excluir} className="text-sm font-semibold text-perigo cursor-pointer underline-offset-2 hover:underline">
>>>>>>> Stashed changes
            Excluir negócio permanentemente
          </button>
        </div>
      </section>
<<<<<<< Updated upstream
    </div>
  )
=======
    </form>
  )
}

function Erro({ texto }: { texto?: string }) {
  return texto ? <p className="mt-1 text-xs text-perigo">{texto}</p> : null
>>>>>>> Stashed changes
}
