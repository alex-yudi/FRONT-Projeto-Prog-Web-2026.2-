import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import Button from '@/components/ui/Button'
import ConfirmModal from '@/components/ui/ConfirmModal'
import { Carregando, MensagemForm } from '@/components/ui/Estados'
import { Input } from '@/components/ui/Field'
import PhotoPicker from '@/components/ui/PhotoPicker'
import { useAuth } from '@/hooks/useAuth'
import { getProblem, type ProblemDetail } from '@/lib/problem'
import { PATHS } from '@/routes/paths'
import { atualizarMe, excluirMe } from '@/services/usuarios.service'
import { mascararCep, somenteDigitos } from '@/utils/format'

// Figma: Consumidor 6 — Minha Conta
export default function MinhaContaPage() {
  const { usuario, sair, recarregarUsuario } = useAuth()
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [cep, setCep] = useState('')
  const [numero, setNumero] = useState('')
  const [problema, setProblema] = useState<ProblemDetail | null>(null)
  const [salvo, setSalvo] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [excluindo, setExcluindo] = useState(false)

  // Preenche o formulário quando o perfil chega (ou muda).
  useEffect(() => {
    if (!usuario) return
    setNome(usuario.nome)
    setEmail(usuario.email)
    setCep(mascararCep(usuario.cep))
    setNumero(usuario.numero)
  }, [usuario])

  if (!usuario) return <Carregando />

  async function salvar(e: FormEvent) {
    e.preventDefault()
    if (!usuario) return
    setEnviando(true)
    setProblema(null)
    setSalvo(false)
    try {
      await atualizarMe({ nome: nome.trim(), email: email.trim(), cep: somenteDigitos(cep), numero: numero.trim() })
      if (email.trim() !== usuario.email) {
        // Trocar o e-mail invalida o token atual: sai e pede login de novo.
        await sair()
        navigate(PATHS.login, { replace: true, state: { aviso: 'E-mail alterado. Entre de novo com o novo e-mail.' } })
        return
      }
      await recarregarUsuario()
      setSalvo(true)
    } catch (erro) {
      setProblema(getProblem(erro))
    } finally {
      setEnviando(false)
    }
  }

  async function aoSair() {
    await sair()
    navigate(PATHS.login)
  }

  return (
    <div className="mx-auto w-full max-w-[466px] px-4 py-12">
      <h1 className="font-rotulo text-[26px] font-extrabold text-texto">Minha conta</h1>
      <p className="mt-1 font-corpo text-[13px] text-texto-secundario">Atualize seus dados pessoais.</p>
      <p className="mt-3 flex flex-wrap gap-x-8 gap-y-1 font-rotulo text-xs font-bold text-primaria">
        <Link to={PATHS.meusAvisos} className="hover:underline">
          📋 Ver meus avisos
        </Link>
        <Link to={PATHS.novoNegocio} className="hover:underline">
          🏪 Cadastrar meu negócio
        </Link>
      </p>

      <form onSubmit={salvar} className="mt-5 flex flex-col gap-4" noValidate>
        <PhotoPicker rotulo="Adicionar foto de perfil" />
        <Input
          label="Nome completo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          erro={problema?.erros?.nome}
        />
        <Input
          label="E-mail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          erro={problema?.erros?.email}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="CEP"
            inputMode="numeric"
            value={cep}
            onChange={(e) => setCep(mascararCep(e.target.value))}
            erro={problema?.erros?.cep}
          />
          <Input
            label="Número"
            value={numero}
            onChange={(e) => setNumero(e.target.value)}
            erro={problema?.erros?.numero}
          />
        </div>
        {/* TODO backend: PUT /usuarios/me não recebe senha; quando receber, habilitar este campo. */}
        <Input
          label="Nova senha"
          type="password"
          disabled
          placeholder="Deixe em branco para manter a senha atual"
          ajuda="A troca de senha ainda não está disponível."
        />

        {problema && !problema.erros && <MensagemForm>{problema.detail}</MensagemForm>}
        {salvo && <MensagemForm tipo="sucesso">Alterações salvas.</MensagemForm>}

        <Button type="submit" bloco carregando={enviando}>
          Salvar alterações
        </Button>
      </form>

      <section className="mt-8 rounded-card border border-perigo/40 bg-alerta-fundo p-5">
        <h2 className="font-rotulo text-sm font-bold text-perigo">Zona de risco</h2>
        <p className="mt-2 font-corpo text-xs leading-snug text-[#7a2d1d]">
          Excluir sua conta remove seu perfil e desvincula negócios que você administra. Essa ação não pode ser desfeita.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Button variante="contornoPerigo" onClick={aoSair}>
            Sair da conta
          </Button>
          <button
            type="button"
            onClick={() => setExcluindo(true)}
            className="font-rotulo text-[13px] font-bold text-perigo hover:underline"
          >
            Excluir minha conta permanentemente
          </button>
        </div>
      </section>

      {excluindo && (
        <ConfirmModal
          titulo="Excluir sua conta?"
          texto="Seu perfil será removido e os negócios que você administra ficarão sem dono. Isso não pode ser desfeito."
          rotuloConfirmar="Excluir"
          onClose={() => setExcluindo(false)}
          onConfirm={async () => {
            await excluirMe()
            await sair()
            navigate(PATHS.login, { replace: true, state: { aviso: 'Conta excluída.' } })
          }}
        />
      )}
    </div>
  )
}
