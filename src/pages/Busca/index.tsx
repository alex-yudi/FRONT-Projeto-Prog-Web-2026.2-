import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import Mapa, { type Pino } from '@/components/negocio/Mapa'
import ChipGroup from '@/components/ui/ChipGroup'
import { Carregando, ErroBox, Vazio } from '@/components/ui/Estados'
import { useAsync } from '@/hooks/useAsync'
import { useBairro } from '@/hooks/useBairro'
import { PATHS } from '@/routes/paths'
import { getAvisos } from '@/services/avisos.service'
import { getNegocios } from '@/services/negocios.service'
import { getOfertas } from '@/services/ofertas.service'
import type { AvisoResponse, CategoriaNegocio, NegocioResponse, OfertaResponse } from '@/types'
import {
  CATEGORIAS_NEGOCIO,
  emojiCategoriaNegocio,
  formatarDistancia,
  labelCategoriaNegocio,
  ofertaAtiva,
} from '@/utils/format'

// Figma: Consumidor 3 — Busca

type Filtro = 'TODOS' | CategoriaNegocio

const FILTROS: { valor: Filtro; label: string }[] = [
  { valor: 'TODOS', label: 'Todos' },
  ...CATEGORIAS_NEGOCIO.map((c) => ({ valor: c.valor, label: c.label })),
]

interface Linha {
  negocio: NegocioResponse
  ofertas: OfertaResponse[]
  avisos: AvisoResponse[]
}

async function carregarLinhas(bairro: string): Promise<Linha[]> {
  const negocios = await getNegocios({ bairro, size: 50 })
  return Promise.all(
    negocios.map(async (negocio) => {
      const [ofertas, avisos] = await Promise.all([getOfertas(negocio.id), getAvisos(negocio.id, { size: 50 })])
      return { negocio, ofertas: ofertas.filter(ofertaAtiva), avisos }
    }),
  )
}

/** Compara sem diferenciar maiúsculas nem acentos ("pao" acha "Pão"). */
const normalizar = (texto: string) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

function combina(linha: Linha, termo: string): boolean {
  if (!termo) return true
  const { negocio, ofertas } = linha
  const alvo = [negocio.nome, negocio.descricao, ...(negocio.catalogo ?? []), ...ofertas.map((o) => o.nome)]
  return alvo.some((t) => normalizar(t).includes(termo))
}

function Destaque({ linha }: { linha: Linha }) {
  const { negocio, ofertas, avisos } = linha
  if (ofertas.length > 0) {
    return (
      <p className="font-corpo text-xs text-primaria">
        {emojiCategoriaNegocio(negocio.categoria)} {ofertas[0].nome}
      </p>
    )
  }
  if (avisos.length > 0) {
    return (
      <p className="font-corpo text-xs text-primaria">
        {avisos.length} {avisos.length === 1 ? 'aviso' : 'avisos'} da comunidade
      </p>
    )
  }
  if (negocio.donoId === null) return <p className="font-corpo text-xs text-texto-secundario">○ Perfil não reivindicado</p>
  return null
}

export default function BuscaPage() {
  const { nome } = useBairro()
  const { data, carregando, erro, recarregar } = useAsync(() => carregarLinhas(nome), [nome])
  const [texto, setTexto] = useState('')
  const [termo, setTermo] = useState('')
  const [filtro, setFiltro] = useState<Filtro>('TODOS')

  // Espera a pessoa parar de digitar um instante antes de filtrar.
  useEffect(() => {
    const t = setTimeout(() => setTermo(normalizar(texto.trim())), 200)
    return () => clearTimeout(t)
  }, [texto])

  const resultados = useMemo(
    () =>
      (data ?? [])
        .filter((l) => (filtro === 'TODOS' || l.negocio.categoria === filtro) && combina(l, termo))
        .sort((a, b) => (a.negocio.distanciaMetros ?? 0) - (b.negocio.distanciaMetros ?? 0)),
    [data, filtro, termo],
  )

  const pinos = useMemo<Pino[]>(
    () =>
      resultados.flatMap((l) =>
        l.negocio.mapa
          ? [
              {
                id: l.negocio.id,
                nome: l.negocio.nome,
                x: l.negocio.mapa.x,
                y: l.negocio.mapa.y,
                tipo: l.ofertas.length > 0 ? 'promo' : l.avisos.length > 0 ? 'aviso' : 'neutro',
              } satisfies Pino,
            ]
          : [],
      ),
    [resultados],
  )

  return (
    <>
      <section className="bg-fundo px-6 py-6 sm:px-[54px]">
        <div className="flex items-center gap-2 rounded-card border border-borda bg-superficie px-4 shadow-card">
          <span aria-hidden="true">🔍</span>
          <input
            type="search"
            aria-label="Buscar por produto, serviço ou negócio"
            placeholder="Buscar por produto, serviço ou negócio..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="h-11 flex-1 bg-transparent font-rotulo text-sm text-texto placeholder:text-texto-suave focus:outline-none"
          />
        </div>
        <div className="mt-4">
          <ChipGroup rotulo="Categoria" opcoes={FILTROS} valor={filtro} onChange={setFiltro} compacto />
        </div>
      </section>

      <div className="grid flex-1 lg:grid-cols-[3fr_2fr]">
        <Mapa pinos={pinos} className="min-h-[260px] lg:min-h-[calc(100vh-14rem)]" />

        <section className="bg-fundo-claro px-6 py-6" aria-live="polite">
          {carregando && !data && <Carregando />}
          {erro && !data && <ErroBox erro={erro} onRetry={recarregar} />}
          {data && (
            <>
              <h1 className="font-rotulo text-lg font-extrabold text-texto">
                {resultados.length} {resultados.length === 1 ? 'resultado' : 'resultados'}
              </h1>
              <ul className="mt-4 flex flex-col gap-3">
                {resultados.map((l) => (
                  <li key={l.negocio.id}>
                    <Link
                      to={PATHS.negocio(l.negocio.id)}
                      className="flex items-center gap-4 rounded-card bg-superficie p-4 shadow-card transition hover:brightness-[.98]"
                    >
                      <span
                        aria-hidden="true"
                        className="flex size-[46px] shrink-0 items-center justify-center rounded-full bg-destaque text-lg"
                      >
                        {emojiCategoriaNegocio(l.negocio.categoria)}
                      </span>
                      <span className="flex min-w-0 flex-col gap-1">
                        <span className="font-rotulo text-[15px] font-bold text-texto">{l.negocio.nome}</span>
                        <span className="font-corpo text-xs text-texto-secundario">
                          {labelCategoriaNegocio(l.negocio.categoria)}
                          {formatarDistancia(l.negocio.distanciaMetros) &&
                            ` · ${formatarDistancia(l.negocio.distanciaMetros)}`}
                        </span>
                        <Destaque linha={l} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              {resultados.length === 0 && (
                <div className="mt-4">
                  <Vazio>Nada encontrado em {nome}. Tente outro termo ou outra categoria.</Vazio>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </>
  )
}
