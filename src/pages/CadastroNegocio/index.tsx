// Figma: 3:42 — Dono 1 — Cadastro de Negocio
import { useNavigate } from 'react-router'
import NegocioForm from '@/components/negocio/NegocioForm'
import { PATHS } from '@/routes/paths'
import { criarNegocio } from '@/services/negocios.service'
import type { NegocioRequest } from '@/types'

const VAZIO: NegocioRequest = { nome: '', categoria: 'HORTIFRUTI', cep: '', numero: '', bairro: '', descricao: '' }

export default function CadastroNegocioPage() {
  const navigate = useNavigate()

  async function cadastrar(dados: NegocioRequest) {
    await criarNegocio(dados)
    navigate(PATHS.painel)
  }

  return (
    <div className="mx-auto w-full max-w-[592px] px-4 py-10 font-rotulo">
      <h1 className="text-[28px] leading-[34px] font-extrabold">Cadastre seu negócio</h1>
      <p className="mt-1.5 text-[15px] leading-[18px] text-texto-secundario">
        Vendinha, oficina, salão, serviço — qualquer coisa que você ofereça no bairro.
      </p>
<<<<<<< Updated upstream
      <NegocioForm inicial={VAZIO} textoBotao="Cadastrar negócio" onSubmit={cadastrar} />
    </div>
  )
=======

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
>>>>>>> Stashed changes
}
