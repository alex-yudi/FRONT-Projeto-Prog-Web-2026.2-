import { useEffect, useState, type FormEvent } from 'react'
import { Campo, Input, Select, Textarea } from '@/components/ui/Campo'
import { getProblem } from '@/lib/problem'
import { getBairros } from '@/services/bairros.service'
import type { BairroResponse, CategoriaNegocio, NegocioRequest } from '@/types'

const CATEGORIAS: { valor: CategoriaNegocio; rotulo: string; largura: string }[] = [
  { valor: 'HORTIFRUTI', rotulo: 'Hortifruti', largura: 'w-[112px]' },
  { valor: 'MERCADO', rotulo: 'Mercado', largura: 'w-[100px]' },
  { valor: 'SERVICOS', rotulo: 'Serviços', largura: 'w-[96px]' },
  { valor: 'PADARIA', rotulo: 'Padaria', largura: 'w-[96px]' },
  { valor: 'OUTRO', rotulo: 'Outro', largura: 'w-[80px]' },
]

interface Props {
  inicial: NegocioRequest
  textoBotao: string
  onSubmit: (dados: NegocioRequest) => Promise<void>
}

export default function NegocioForm({ inicial, textoBotao, onSubmit }: Props) {
  const [bairros, setBairros] = useState<BairroResponse[]>([])
  const [form, setForm] = useState(inicial)
  const [erros, setErros] = useState<Record<string, string>>({})
  const [erroGeral, setErroGeral] = useState('')

  useEffect(() => {
    getBairros().then((lista) => {
      setBairros(lista)
      setForm((f) => (f.bairro ? f : { ...f, bairro: lista[0]?.nome ?? '' }))
    })
  }, [])

  function alterar(campo: keyof NegocioRequest, valor: string) {
    setForm({ ...form, [campo]: valor })
    const { [campo]: _corrigido, ...restantes } = erros
    setErros(restantes)
    if (Object.keys(restantes).length === 0) setErroGeral('')
  }

  async function enviar(e: FormEvent) {
    e.preventDefault()
    try {
      await onSubmit({ ...form, cep: form.cep.replace(/\D/g, '') })
    } catch (err) {
      const problema = getProblem(err)
      setErros(problema.erros ?? {})
      setErroGeral(problema.detail)
    }
  }

  return (
    <form onSubmit={enviar}>
      {erroGeral && <p className="mt-4 rounded-input bg-alerta-fundo p-3 text-sm text-perigo">{erroGeral}</p>}

      <div className="mt-[46px] flex h-[120px] items-center justify-center rounded-card border-[1.5px] border-borda bg-superficie text-[15px] text-texto-suave">
        📷 Adicionar foto do negócio
      </div>

      <Campo rotulo="Nome do negócio" erro={erros.nome} className="mt-7">
        <Input placeholder="Ex: Quitanda do Zé" value={form.nome} onChange={(e) => alterar('nome', e.target.value)} />
      </Campo>

      <Campo rotulo="Categoria" className="mt-4">
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
      </Campo>

      <div className="mt-[26px] grid grid-cols-2 gap-10">
        <Campo rotulo="CEP" erro={erros.cep}>
          <Input placeholder="00000-000" value={form.cep} onChange={(e) => alterar('cep', e.target.value)} />
        </Campo>
        <Campo rotulo="Número" erro={erros.numero}>
          <Input placeholder="123" value={form.numero} onChange={(e) => alterar('numero', e.target.value)} />
        </Campo>
      </div>

      <Campo rotulo="Bairro" erro={erros.bairro} className="mt-4">
        <Select value={form.bairro} onChange={(e) => alterar('bairro', e.target.value)}>
          {bairros.map((b) => (
            <option key={b.nome}>{b.nome}</option>
          ))}
        </Select>
      </Campo>

      <Campo rotulo="Descrição curta" erro={erros.descricao} className="mt-4">
        <Textarea
          placeholder="Ex: hortifruti de bairro com produtos fresquinhos todo dia, direto da feira."
          value={form.descricao}
          onChange={(e) => alterar('descricao', e.target.value)}
        />
      </Campo>

      <button
        type="submit"
        className="mt-7 h-[52px] w-full cursor-pointer rounded-card bg-primaria font-semibold text-white transition hover:brightness-110 active:scale-[0.99]"
      >
        {textoBotao}
      </button>
    </form>
  )
}
