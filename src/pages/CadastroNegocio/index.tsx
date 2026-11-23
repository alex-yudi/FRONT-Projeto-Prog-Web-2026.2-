// Figma: 3:42 — Dono 1 — Cadastro de Negocio
import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { getProblem } from '@/lib/problem'
import { PATHS } from '@/routes/paths'
import { getBairros } from '@/services/bairros.service'
import { criarNegocio } from '@/services/negocios.service'
import type { BairroResponse, CategoriaNegocio, NegocioRequest } from '@/types'

// Larguras proporcionais às do Figma, reduzidas para os 5 chips caberem em 560 px.
const CATEGORIAS: { valor: CategoriaNegocio; rotulo: string; largura: string }[] = [
  { valor: 'HORTIFRUTI', rotulo: 'Hortifruti', largura: 'w-[112px]' },
  { valor: 'MERCADO', rotulo: 'Mercado', largura: 'w-[100px]' },
  { valor: 'SERVICOS', rotulo: 'Serviços', largura: 'w-[96px]' },
  { valor: 'PADARIA', rotulo: 'Padaria', largura: 'w-[96px]' },
  { valor: 'OUTRO', rotulo: 'Outro', largura: 'w-[80px]' },
]

const input = 'w-full h-11 px-3.5 rounded-input border-[1.5px] border-borda bg-superficie text-[15px] outline-primaria'
const textarea = 'block w-full h-[88px] px-3.5 py-3 rounded-input border-[1.5px] border-borda bg-superficie text-sm outline-primaria'
const rotulo = 'block mb-1.5 text-[13px] leading-4 font-semibold'

export default function CadastroNegocioPage() {
  const navigate = useNavigate()
  const [bairros, setBairros] = useState<BairroResponse[]>([])
  const [form, setForm] = useState<NegocioRequest>({
    nome: '',
    categoria: 'HORTIFRUTI',
    cep: '',
    numero: '',
    bairro: '',
    descricao: '',
  })
  const [erros, setErros] = useState<Record<string, string>>({})
  const [erroGeral, setErroGeral] = useState('')

  useEffect(() => {
    getBairros().then((lista) => {
      setBairros(lista)
      setForm((f) => ({ ...f, bairro: lista[0]?.nome ?? '' }))
    })
  }, [])

  const alterar = (campo: keyof NegocioRequest, valor: string) => setForm({ ...form, [campo]: valor })

  async function enviar(e: FormEvent) {
    e.preventDefault()
    try {
      await criarNegocio({ ...form, cep: form.cep.replace(/\D/g, '') })
      navigate(PATHS.painel)
    } catch (err) {
      const problema = getProblem(err)
      setErros(problema.erros ?? {})
      setErroGeral(problema.detail)
    }
  }

  return (
    <form onSubmit={enviar} className="mx-auto w-full max-w-[592px] px-4 py-10 font-rotulo">
      <h1 className="text-[28px] leading-[34px] font-extrabold">Cadastre seu negócio</h1>
      <p className="mt-1.5 text-[15px] leading-[18px] text-texto-secundario">
        Vendinha, oficina, salão, serviço — qualquer coisa que você ofereça no bairro.
      </p>

      {erroGeral && <p className="mt-4 rounded-input bg-alerta-fundo p-3 text-sm text-perigo">{erroGeral}</p>}

      <div className="mt-[46px] flex h-[120px] items-center justify-center rounded-card border-[1.5px] border-borda bg-superficie text-[15px] text-texto-suave">
        📷 Adicionar foto do negócio
      </div>

      <label className={`${rotulo} mt-7`}>Nome do negócio</label>
      <input className={input} placeholder="Ex: Quitanda do Zé" value={form.nome} onChange={(e) => alterar('nome', e.target.value)} />
      <Erro texto={erros.nome} />

      <span className={`${rotulo} mt-4`}>Categoria</span>
      <div className="flex flex-wrap gap-3">
        {CATEGORIAS.map((c) => (
          <button
            key={c.valor}
            type="button"
            onClick={() => alterar('categoria', c.valor)}
            className={`h-9 ${c.largura} cursor-pointer rounded-pilula px-4 text-left text-[13px] font-semibold transition ${
              form.categoria === c.valor ? 'bg-primaria text-white' : 'border-[1.5px] border-borda bg-superficie hover:border-primaria'
            }`}
          >
            {c.rotulo}
          </button>
        ))}
      </div>

      <div className="mt-[26px] grid grid-cols-2 gap-10">
        <div>
          <label className={rotulo}>CEP</label>
          <input className={input} placeholder="00000-000" value={form.cep} onChange={(e) => alterar('cep', e.target.value)} />
          <Erro texto={erros.cep} />
        </div>
        <div>
          <label className={rotulo}>Número</label>
          <input className={input} placeholder="123" value={form.numero} onChange={(e) => alterar('numero', e.target.value)} />
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
        placeholder="Ex: hortifruti de bairro com produtos fresquinhos todo dia, direto da feira."
        value={form.descricao}
        onChange={(e) => alterar('descricao', e.target.value)}
      />
      <Erro texto={erros.descricao} />

      <button type="submit" className="mt-7 h-[52px] w-full rounded-card bg-primaria font-semibold text-white cursor-pointer transition hover:brightness-110 active:scale-[0.99]">
        Cadastrar negócio
      </button>
    </form>
  )
}

function Erro({ texto }: { texto?: string }) {
  return texto ? <p className="mt-1 text-xs text-perigo">{texto}</p> : null
}
