import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import AvisoCard from '@/components/aviso/AvisoCard'
import AvisoFormModal from '@/components/modals/AvisoFormModal'
import Mapa, { type Pino } from '@/components/negocio/Mapa'
import Button from '@/components/ui/Button'
import { classeBotao } from '@/components/ui/buttonClass'
import { Carregando, ErroBox } from '@/components/ui/Estados'
import { useAsync } from '@/hooks/useAsync'
import { useAuth } from '@/hooks/useAuth'
import { useBairro } from '@/hooks/useBairro'
import { PATHS } from '@/routes/paths'
import { getAvisos } from '@/services/avisos.service'
import { getNegocios } from '@/services/negocios.service'
import { getOfertas } from '@/services/ofertas.service'
import { votar } from '@/services/votos.service'
import type { AvisoResponse, NegocioResponse, OfertaResponse } from '@/types'
import { emojiCategoriaNegocio, formatarDistancia, hojeISO, ofertaAtiva } from '@/utils/format'

// Figma: 1:15 — Consumidor 2 — Feed-Mapa · 12:168 — Feed-Mapa (Bairro vazio)

type Item =
  | { tipo: 'promo'; chave: string; negocio: NegocioResponse; ofertas: OfertaResponse[] }
  | { tipo: 'aviso'; chave: string; negocio: NegocioResponse; aviso: AvisoResponse }

interface DadosFeed {
  negocios: NegocioResponse[]
  ofertas: Record<number, OfertaResponse[]>
  avisos: Record<number, AvisoResponse[]>
}

async function carregarFeed(bairro: string): Promise<DadosFeed> {
  const negocios = await getNegocios({ bairro, size: 50 })
  const [listaOfertas, listaAvisos] = await Promise.all([
    Promise.all(negocios.map((n) => getOfertas(n.id))),
    Promise.all(negocios.map((n) => getAvisos(n.id, { size: 20 }))),
  ])
  const ofertas: DadosFeed['ofertas'] = {}
  const avisos: DadosFeed['avisos'] = {}
  negocios.forEach((n, i) => {
    ofertas[n.id] = listaOfertas[i].filter(ofertaAtiva)
    avisos[n.id] = listaAvisos[i]
  })
  return { negocios, ofertas, avisos }
}

/** Aviso mais relevante do negócio: ignora os contestados; mais votos úteis primeiro, depois o mais novo. */
function melhorAviso(avisos: AvisoResponse[]): AvisoResponse | undefined {
  return avisos
    .filter((a) => a.respostaDono !== 'CONTESTADO')
    .sort((a, b) => b.votosUtil - a.votosUtil || b.criadoEm.localeCompare(a.criadoEm))[0]
}

function montarItens(dados: DadosFeed): Item[] {
  const itens: Item[] = []
  for (const negocio of dados.negocios) {
    const ofertas = dados.ofertas[negocio.id] ?? []
    if (ofertas.length > 0) itens.push({ tipo: 'promo', chave: `p${negocio.id}`, negocio, ofertas })
    const aviso = melhorAviso(dados.avisos[negocio.id] ?? [])
    if (aviso) itens.push({ tipo: 'aviso', chave: `a${aviso.id}`, negocio, aviso })
  }
  return itens.sort((a, b) => (a.negocio.distanciaMetros ?? 0) - (b.negocio.distanciaMetros ?? 0))
}

function NomeDistancia({ negocio }: { negocio: NegocioResponse }) {
  const distancia = formatarDistancia(negocio.distanciaMetros)
  return (
    <p className="font-rotulo text-sm font-bold text-texto">
      <span aria-hidden="true">📍 </span>
      <Link to={PATHS.negocio(negocio.id)} className="hover:underline">
        {negocio.nome}
      </Link>
      {distancia && <span> · {distancia}</span>}
    </p>
  )
}

function CardPromo({ negocio, ofertas }: { negocio: NegocioResponse; ofertas: OfertaResponse[] }) {
  const hoje = hojeISO()
  const rotulo = ofertas.some((o) => o.validade === hoje) ? 'PROMOÇÃO HOJE' : 'PROMOÇÃO'
  const nomes = ofertas.map((o) => o.nome).join(', ')
  return (
    <article className="flex overflow-hidden rounded-card bg-superficie shadow-card">
      <div className="w-1.5 shrink-0 bg-destaque" aria-hidden="true" />
      <div className="flex flex-col items-start gap-2.5 p-4">
        <NomeDistancia negocio={negocio} />
        <span className="rounded-[4px] bg-destaque px-2 py-1 font-rotulo text-[11px] font-bold text-texto">
          {emojiCategoriaNegocio(negocio.categoria)} {rotulo}
        </span>
        <p className="font-corpo text-xs text-texto-medio">
          {nomes}: {ofertas[0].descricao}.
        </p>
      </div>
    </article>
  )
}

export default function FeedPage() {
  const { nome } = useBairro()
  const { sessao } = useAuth()
  const navigate = useNavigate()
  const { data, carregando, erro, recarregar } = useAsync(() => carregarFeed(nome), [nome])
  const [postando, setPostando] = useState(false)

  const itens = useMemo(() => (data ? montarItens(data) : []), [data])
  const pinos = useMemo<Pino[]>(
    () =>
      (data?.negocios ?? []).flatMap((n) =>
        n.mapa
          ? [
              {
                id: n.id,
                nome: n.nome,
                x: n.mapa.x,
                y: n.mapa.y,
                tipo: (data?.ofertas[n.id]?.length ?? 0) > 0 ? 'promo' : (data?.avisos[n.id]?.length ?? 0) > 0 ? 'aviso' : 'neutro',
              } satisfies Pino,
            ]
          : [],
      ),
    [data],
  )

  function irParaLogin() {
    navigate(PATHS.login, { state: { from: PATHS.feed } })
  }

  async function aoVotar(aviso: AvisoResponse, util: boolean) {
    if (!sessao) return irParaLogin()
    await votar(aviso.negocioId, aviso.id, util)
    recarregar()
  }

  const vazio = !!data && data.negocios.length === 0

  return (
    <div className="grid flex-1 lg:grid-cols-[3fr_2fr]">
      <Mapa pinos={pinos} className="min-h-[300px] lg:min-h-[calc(100vh-4rem)]" />

      <section className="bg-fundo-claro px-6 py-6">
        <h1 className="font-display text-2xl font-black text-texto">Perto de você</h1>

        {carregando && !data && <Carregando />}
        {erro && !data && (
          <div className="mt-6">
            <ErroBox erro={erro} onRetry={recarregar} />
          </div>
        )}

        {vazio && (
          <div className="mx-auto mt-16 flex max-w-sm flex-col gap-3 lg:mt-24">
            <span className="text-4xl" aria-hidden="true">
              🗺️
            </span>
            <h2 className="mt-3 font-display text-[22px] font-black leading-tight text-texto">
              Ainda não existem negócios cadastrados neste bairro
            </h2>
            <p className="font-corpo text-[13px] text-texto-secundario">
              Conhece uma vendinha, um mercado ou um serviço aqui perto? Seja o primeiro a colocar {nome} no mapa.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link to={PATHS.novoNegocio} className={classeBotao('primario')}>
                Cadastrar negócio
              </Link>
              <Button
                variante="secundario"
                onClick={() => (sessao ? setPostando(true) : irParaLogin())}
              >
                Postar um aviso
              </Button>
            </div>
          </div>
        )}

        {data && !vazio && (
          <div className="mt-5 flex flex-col gap-4">
            {itens.map((item) =>
              item.tipo === 'promo' ? (
                <CardPromo key={item.chave} negocio={item.negocio} ofertas={item.ofertas} />
              ) : (
                <div key={item.chave} className="flex flex-col gap-1.5">
                  <AvisoCard
                    aviso={{ ...item.aviso, negocioNome: item.negocio.nome }}
                    variante="feed"
                    comNegocio
                    onVotar={(util) => void aoVotar(item.aviso, util)}
                  />
                </div>
              ),
            )}
            <aside className="rounded-card border border-borda bg-fundo-claro px-4 py-3">
              <p className="font-rotulo text-[13px] font-bold text-texto">
                <span aria-hidden="true">🏪 </span>Tem um negócio no bairro?
              </p>
              <Link to={PATHS.novoNegocio} className="font-rotulo text-xs font-semibold text-primaria hover:underline">
                Cadastre e apareça pros seus vizinhos →
              </Link>
            </aside>
          </div>
        )}
      </section>

      {postando && (
        <AvisoFormModal
          onClose={() => setPostando(false)}
          onSaved={() => {
            setPostando(false)
            recarregar()
          }}
        />
      )}
    </div>
  )
}
