// Figma: 40:196 — Consumidor 1 — Login
// TODO: implementar a tela.
import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import Button from '@/components/ui/Button'
import { MensagemForm } from '@/components/ui/Estados'
import { Input } from '@/components/ui/Field'
import { useAuth } from '@/hooks/useAuth'
import { getProblem, type ProblemDetail } from '@/lib/problem'
import { PATHS } from '@/routes/paths'

export default function LoginPage() {
  const { entrar } = useAuth()
  const navigate = useNavigate()
  const local = useLocation()
  const state = local.state as { from?: string; aviso?: string } | null

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [problema, setProblema] = useState<ProblemDetail | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [esqueci, setEsqueci] = useState(false)

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setEnviando(true)
    setProblema(null)
    try {
      await entrar({ email: email.trim(), senha })
      navigate(state?.from ?? PATHS.feed, { replace: true })
    } catch (erro) {
      setProblema(getProblem(erro))
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-4" noValidate>
      <h1 className="mb-2 font-display text-[26px] font-black text-texto">Entrar na sua conta</h1>

      {state?.aviso && <MensagemForm tipo="sucesso">{state.aviso}</MensagemForm>}
      {state?.from && !state.aviso && <MensagemForm tipo="sucesso">Entre para continuar.</MensagemForm>}

      <Input
        label="E-mail"
        type="email"
        autoComplete="email"
        placeholder="voce@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        erro={problema?.erros?.email}
      />
      <Input
        label="Senha"
        type="password"
        autoComplete="current-password"
        placeholder="Mínimo 8 caracteres"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        erro={problema?.erros?.senha}
      />

      <div>
        <button
          type="button"
          onClick={() => setEsqueci(true)}
          className="font-corpo text-xs text-texto-secundario hover:underline"
        >
          Esqueci minha senha
        </button>
        {esqueci && (
          <p role="status" className="mt-1 font-corpo text-xs text-texto-secundario">
            A recuperação de senha ainda não está disponível.
          </p>
        )}
      </div>

      {problema && !problema.erros && <MensagemForm>{problema.detail}</MensagemForm>}

      <Button type="submit" bloco carregando={enviando} className="h-[43px]">
        Entrar
      </Button>

      <p className="font-corpo text-xs text-texto-secundario">
        Não tem conta?{' '}
        <Link to={PATHS.cadastro} state={state} className="font-semibold text-primaria hover:underline">
          Criar conta
        </Link>
      </p>
    </form>
  )
}
