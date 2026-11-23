import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import Button from '@/components/ui/Button'
import { MensagemForm } from '@/components/ui/Estados'
import { Input } from '@/components/ui/Field'
import { useAuth } from '@/hooks/useAuth'
import { getProblem, type ProblemDetail } from '@/lib/problem'
import { PATHS } from '@/routes/paths'
import { cadastrarUsuario } from '@/services/usuarios.service'
import { mascararCep, somenteDigitos } from '@/utils/format'

// Figma: Consumidor 1b — Cadastro
export default function CadastroPage() {
  const { entrar } = useAuth()
  const navigate = useNavigate()
  const state = useLocation().state as { from?: string } | null

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [cep, setCep] = useState('')
  const [numero, setNumero] = useState('')
  const [problema, setProblema] = useState<ProblemDetail | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function enviar(e: FormEvent) {
    e.preventDefault()
    setEnviando(true)
    setProblema(null)
    try {
      await cadastrarUsuario({ nome: nome.trim(), email: email.trim(), senha, cep: somenteDigitos(cep), numero: numero.trim() })
      // Conta criada: já entra com os mesmos dados.
      await entrar({ email: email.trim(), senha })
      navigate(state?.from ?? PATHS.feed, { replace: true })
    } catch (erro) {
      setProblema(getProblem(erro))
      setEnviando(false)
    }
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-4" noValidate>
      <h1 className="mb-2 font-display text-[26px] font-black text-texto">Criar sua conta</h1>

      <Input
        label="Nome completo"
        autoComplete="name"
        placeholder="Como podemos te chamar"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        erro={problema?.erros?.nome}
      />
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
        autoComplete="new-password"
        placeholder="Mínimo 8 caracteres"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        erro={problema?.erros?.senha}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="CEP"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="00000-000"
          value={cep}
          onChange={(e) => setCep(mascararCep(e.target.value))}
          erro={problema?.erros?.cep}
        />
        <Input
          label="Número"
          placeholder="123"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          erro={problema?.erros?.numero}
        />
      </div>
      <p className="-mt-2 font-corpo text-[11px] text-texto-secundario">
        Usamos isso pra te mostrar o que tem na sua rua — nunca é público no seu perfil.
      </p>

      {problema && !problema.erros && <MensagemForm>{problema.detail}</MensagemForm>}

      <Button type="submit" bloco carregando={enviando} className="mt-2 h-[43px]">
        Criar conta
      </Button>

      <p className="font-corpo text-xs">
        <Link to={PATHS.login} state={state} className="font-semibold text-primaria hover:underline">
          Já tenho conta — Entrar
        </Link>
      </p>
    </form>
  )
}
