import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { useBairro } from '@/hooks/useBairro'
import { PATHS } from '@/routes/paths'

/** Fecha o menu ao clicar fora ou apertar Esc. */
function useFecharFora(aberto: boolean, fechar: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!aberto) return
    const aoClicar = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) fechar()
    }
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') fechar()
    }
    document.addEventListener('mousedown', aoClicar)
    document.addEventListener('keydown', aoTeclar)
    return () => {
      document.removeEventListener('mousedown', aoClicar)
      document.removeEventListener('keydown', aoTeclar)
    }
  }, [aberto, fechar])
  return ref
}

function Menu({ children }: { children: ReactNode }) {
  return (
    <ul className="absolute top-full z-40 mt-2 min-w-48 overflow-hidden rounded-card border border-borda bg-superficie py-1 shadow-card">
      {children}
    </ul>
  )
}

const itemMenu =
  'block w-full px-4 py-2 text-left font-rotulo text-sm text-texto hover:bg-fundo-claro focus-visible:bg-fundo-claro'

function SeletorBairro() {
  const { bairros, nome, selecionar } = useBairro()
  const [aberto, setAberto] = useState(false)
  const ref = useFecharFora(aberto, () => setAberto(false))

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={aberto}
        onClick={() => setAberto((a) => !a)}
        className="flex items-center gap-1.5 rounded-input px-2 py-1 font-rotulo text-sm text-white hover:bg-white/10"
      >
        <span aria-hidden="true">📍</span>
        {nome}
        <span aria-hidden="true" className="text-[9px]">
          ▾
        </span>
      </button>
      {aberto && (
        <div className="absolute left-1/2 -translate-x-1/2">
          <Menu>
            {bairros.map((b) => (
              <li key={b.nome} role="option" aria-selected={b.nome === nome}>
                <button
                  type="button"
                  className={`${itemMenu} ${b.nome === nome ? 'font-bold text-primaria' : ''}`}
                  onClick={() => {
                    selecionar(b.nome)
                    setAberto(false)
                  }}
                >
                  {b.nome}
                </button>
              </li>
            ))}
          </Menu>
        </div>
      )}
    </div>
  )
}

function IconePessoa() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
    </svg>
  )
}

function MenuConta() {
  const { sessao, usuario, sair } = useAuth()
  const navigate = useNavigate()
  const [aberto, setAberto] = useState(false)
  const ref = useFecharFora(aberto, () => setAberto(false))

  if (!sessao) {
    return (
      <Link
        to={PATHS.login}
        className="rounded-input bg-destaque px-4 py-2 font-rotulo text-sm font-semibold text-texto hover:brightness-95"
      >
        Entrar
      </Link>
    )
  }

  async function aoSair() {
    setAberto(false)
    await sair()
    navigate(PATHS.login)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Menu da conta"
        aria-haspopup="menu"
        aria-expanded={aberto}
        onClick={() => setAberto((a) => !a)}
        className="flex size-[34px] items-center justify-center rounded-full bg-destaque text-texto"
      >
        <IconePessoa />
      </button>
      {aberto && (
        <div className="absolute right-0">
          <Menu>
            <li className="border-b border-borda-suave px-4 py-2">
              <p className="font-rotulo text-sm font-bold text-texto">{usuario?.nome ?? 'Minha conta'}</p>
              <p className="font-corpo text-xs text-texto-secundario">{sessao.sub}</p>
            </li>
            <li>
              <Link to={PATHS.minhaConta} className={itemMenu} onClick={() => setAberto(false)}>
                Minha conta
              </Link>
            </li>
            <li>
              <Link to={PATHS.meusAvisos} className={itemMenu} onClick={() => setAberto(false)}>
                Meus avisos
              </Link>
            </li>
            <li>
              <Link to={PATHS.painel} className={itemMenu} onClick={() => setAberto(false)}>
                Painel do meu negócio
              </Link>
            </li>
            <li>
              <button type="button" className={`${itemMenu} text-perigo`} onClick={aoSair}>
                Sair
              </button>
            </li>
          </Menu>
        </div>
      )}
    </div>
  )
}

/** Barra verde do topo (Figma: componente Topbar 4:7): logo, bairro e conta. */
export default function Topbar() {
  return (
    <header className="relative z-30 grid h-16 grid-cols-[1fr_auto_1fr] items-center bg-primaria px-4 sm:px-8">
      <Link to={PATHS.feed} className="justify-self-start font-display text-2xl font-black text-white">
        bairro.
      </Link>
      <SeletorBairro />
      <div className="flex items-center gap-3 justify-self-end">
        <Link to={PATHS.busca} className="rounded-input px-2 py-1 font-rotulo text-sm text-white hover:bg-white/10">
          <span aria-hidden="true">🔍 </span>
          <span className="hidden sm:inline">Buscar</span>
        </Link>
        <MenuConta />
      </div>
    </header>
  )
}
