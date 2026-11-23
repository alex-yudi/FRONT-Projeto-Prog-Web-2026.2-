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
      <NegocioForm inicial={VAZIO} textoBotao="Cadastrar negócio" onSubmit={cadastrar} />
    </div>
  )
}
