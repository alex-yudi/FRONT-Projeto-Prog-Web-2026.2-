// Figma: 4:7 — Topbar
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useBairro } from '@/contexts/bairro'
import { PATHS } from '@/routes/paths'
import { getSessao, logout } from '@/services/auth.service'
import { getBairros } from '@/services/bairros.service'
import type { BairroResponse } from '@/types'

const MENU = [
  { rotulo: 'Meu negócio', para: PATHS.painel },
  { rotulo: 'Minha conta', para: PATHS.minhaConta },
  { rotulo: 'Meus avisos', para: PATHS.meusAvisos },
]

export default function Topbar() {
  const navigate = useNavigate()
  const { bairro, setBairro } = useBairro()
  const [bairros, setBairros] = useState<BairroResponse[]>([])
  const [aberto, setAberto] = useState(false)
  const logado = getSessao() !== null

  useEffect(() => {
    getBairros().then(setBairros)
  }, [])

  async function sair() {
    setAberto(false)
    await logout()
    navigate(PATHS.login)
  }

  const avatar = (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#1d1b20" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  )
  const classeAvatar =
    'flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-destaque transition hover:brightness-95 active:scale-95'

  return (
    <header className="relative flex h-[76px] items-center justify-between bg-primaria px-10 text-fundo">
      <Link to={PATHS.feed} className="font-display text-[26px] font-black transition hover:opacity-90">
        bairro.
      </Link>

      <label className="absolute left-1/2 flex -translate-x-1/2 cursor-pointer items-center gap-1 font-corpo transition hover:opacity-90">
        📍
        <select
          value={bairro}
          onChange={(e) => setBairro(e.target.value)}
          className="field-sizing-content cursor-pointer appearance-none bg-transparent outline-none"
        >
          {bairros.map((b) => (
            <option key={b.nome} className="text-texto">
              {b.nome}
            </option>
          ))}
        </select>
        <span className="text-xs">▾</span>
      </label>

      {logado ? (
        <button onClick={() => setAberto(!aberto)} className={classeAvatar} aria-label="Abrir menu da conta">
          {avatar}
        </button>
      ) : (
        <Link to={PATHS.login} className={classeAvatar} aria-label="Entrar">
          {avatar}
        </Link>
      )}

      {aberto && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setAberto(false)} />
          <nav className="absolute top-[68px] right-10 z-20 w-56 overflow-hidden rounded-card bg-superficie py-2 font-rotulo text-sm text-texto shadow-lg">
            {MENU.map((item) => (
              <Link
                key={item.para}
                to={item.para}
                onClick={() => setAberto(false)}
                className="block px-4 py-2.5 transition hover:bg-fundo-claro"
              >
                {item.rotulo}
              </Link>
            ))}
            <button onClick={sair} className="block w-full cursor-pointer px-4 py-2.5 text-left text-perigo transition hover:bg-fundo-claro">
              Sair
            </button>
          </nav>
        </>
      )}
    </header>
  )
}
