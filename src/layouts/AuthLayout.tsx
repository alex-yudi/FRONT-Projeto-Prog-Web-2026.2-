import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { PATHS } from '@/routes/paths'
// Layout de Login e Cadastro (sem Topbar; logo + slogan à esquerda no Figma).
// TODO: implementar na etapa do Login.

export default function AuthLayout() {
  const { sessao } = useAuth()
  const from = (useLocation().state as { from?: string } | null)?.from
  // Já logado (ou acabou de logar): volta para onde a pessoa estava indo.
  if (sessao) return <Navigate to={from ?? PATHS.feed} replace />

  return (
    <div className="grid min-h-screen md:grid-cols-[5fr_7fr]">
      <aside className="flex flex-col justify-center bg-primaria px-8 py-10 text-fundo md:px-[54px]">
        <p className="font-display text-5xl font-black">bairro.</p>
        <p className="mt-4 max-w-[12rem] font-corpo text-lg leading-tight">A rede de informação do seu bairro.</p>
      </aside>
      <main className="px-6 py-10 md:px-0 md:pl-[100px] md:pt-16">
        <div className="w-full max-w-[466px]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

