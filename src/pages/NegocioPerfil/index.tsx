import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getProblem } from '@/lib/problem'
import { PATHS } from '@/routes/paths'
import { getSessao } from '@/services/auth.service'
import { getAvisos } from '@/services/avisos.service'
import { getNegocio, reivindicarNegocio } from '@/services/negocios.service'
import { getOfertas } from '@/services/ofertas.service'
import type { AvisoResponse, CategoriaNegocio, NegocioResponse, OfertaResponse } from '@/types'
import PostarAvisoModal from './components/PostarAvisoModal'

const CATEGORIAS: Record<CategoriaNegocio, string> = {
  HORTIFRUTI: 'Hortifruti',
  MERCADO: 'Mercado',
  SERVICOS: 'Serviços',
  PADARIA: 'Padaria',
  OUTRO: 'Outro',
}

/** Data de hoje (local) em yyyy-MM-dd, para comparar com `validade`. */
function hojeISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function tempoRelativo(criadoEm: string) {
  const minutos = Math.max(0, Math.round((Date.now() - new Date(criadoEm).getTime()) / 60_000))
  if (minutos < 1) return 'agora'
  if (minutos < 60) return `há ${minutos} min`
  if (minutos < 24 * 60) return `há ${Math.floor(minutos / 60)}h`
  const dias = Math.floor(minutos / (24 * 60))
  return dias === 1 ? 'há 1 dia' : `há ${dias} dias`
}

function formatarPreco({ preco, unidade }: OfertaResponse) {
  if (preco === 0) return '—'
  return `R$ ${preco.toFixed(2).replace('.', ',')}${unidade ? `/${unidade}` : ''}`
}

const confirmado = (a: AvisoResponse) => a.votosUtil >= 5 && a.votosUtil > a.votosNaoUtil

export default function NegocioPerfilPage() {
  const { id } = useParams()
  return <Perfil key={id} id={Number(id)} />
}

function Perfil({ id }: { id: number }) {
  const navigate = useNavigate()
  const logado = getSessao() !== null
  const [negocio, setNegocio] = useState<NegocioResponse | null>(null)
  const [ofertas, setOfertas] = useState<OfertaResponse[]>([])
  const [avisos, setAvisos] = useState<AvisoResponse[]>([])
  const [erro, setErro] = useState('')
  const [seguindo, setSeguindo] = useState(false)
  const [postando, setPostando] = useState(false)
  const [pedidoEnviado, setPedidoEnviado] = useState(false)
  const [erroPedido, setErroPedido] = useState('')

  // useCallback: carregar só muda quando o id muda, então o useEffect abaixo roda uma vez por negócio.
  const carregar = useCallback(async () => {
    try {
      const n = await getNegocio(id)
      const hoje = hojeISO()
      const [a, o] = await Promise.all([getAvisos(id), n.donoId !== null ? getOfertas(id) : Promise.resolve([])])
      setNegocio(n)
      setAvisos(a)
      setOfertas(o.filter((x) => x.validade === null || x.validade >= hoje))
    } catch (err) {
      setErro(getProblem(err).detail)
    }
  }, [id])

  useEffect(() => {
    carregar()
  }, [carregar])

  async function reivindicar() {
    if (!logado) return navigate(PATHS.login)
    try {
      await reivindicarNegocio(id)
      setPedidoEnviado(true)
    } catch (err) {
      setErroPedido(getProblem(err).detail)
    }
  }

  if (!negocio) return <p className="px-16 py-10 text-texto-secundario">{erro || 'Carregando...'}</p>

  const temDono = negocio.donoId !== null
  const endereco = [
    CATEGORIAS[negocio.categoria],
    `${negocio.logradouro ?? 'Endereço não informado'}, ${negocio.numero} — ${negocio.bairro}`,
    temDono ? negocio.distanciaMetros !== undefined && `${negocio.distanciaMetros}m de você` : 'citado por vizinhos',
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <main className="pb-16 font-corpo">
      {/* Hero */}
      {temDono ? (
        <section className="flex h-[220px] items-center justify-between bg-fundo-hero px-16">
          <div>
            <h1 className="font-display text-[34px] leading-[44px] font-black">{negocio.nome}</h1>
            <p className="mt-1 leading-[22px] text-texto-medio">{endereco}</p>
            <span className="mt-3 inline-block w-[180px] rounded-md bg-primaria px-2.5 py-1.5 text-xs font-semibold text-fundo">
              ✓ PERFIL VERIFICADO
            </span>
          </div>
          <button
            onClick={() => setSeguindo(!seguindo)}
            className="h-12 w-[140px] cursor-pointer rounded-card bg-primaria text-[15px] font-semibold text-fundo transition hover:brightness-110 active:scale-[0.99]"
          >
            {seguindo ? '✓ Seguindo' : '+ Seguir'}
          </button>
        </section>
      ) : (
        <section className="h-[180px] border-2 border-[#bfbaad] bg-[#e5e5e0] px-16 pt-[38px]">
          <h1 className="font-display text-[32px] leading-[39px] font-black">{negocio.nome}</h1>
          <p className="mt-[9px] leading-[19px] text-texto-medio">{endereco}</p>
          <span className="mt-[15px] inline-block w-[280px] rounded-md border-[1.5px] border-texto-suave bg-superficie px-2.5 py-[5px] text-xs font-semibold text-texto-medio">
            ○ PERFIL AINDA NÃO REIVINDICADO
          </span>
        </section>
      )}

      <div className="px-16">
        {/* Faixa de reivindicação (só sem dono) */}
        {!temDono && (
          <section className="mt-8 flex min-h-[108px] items-center justify-between rounded-xl bg-primaria px-8 py-6">
            <div className="self-start">
              <h2 className="font-display text-[19px] leading-[23px] font-black text-white">Esse negócio é seu?</h2>
              <p className="mt-2 text-sm text-[#d8eae5]">
                Reivindique o perfil pra responder aos vizinhos e cadastrar suas próprias promoções.
              </p>
              {erroPedido && <p className="mt-2 text-sm font-semibold text-destaque">{erroPedido}</p>}
            </div>
            {pedidoEnviado ? (
              <p className="font-semibold text-white">✓ Pedido enviado — aguardando aprovação</p>
            ) : (
              <button
                onClick={reivindicar}
                className="h-[52px] w-[220px] cursor-pointer rounded-card bg-destaque text-[15px] font-semibold transition hover:brightness-95 active:scale-[0.99]"
              >
                Reivindicar perfil
              </button>
            )}
          </section>
        )}

        {/* Promoções ativas e catálogo (só com dono) */}
        {temDono && (
          <>
            <h2 className="mt-10 font-display text-2xl leading-7 font-black">Promoções ativas</h2>
            {ofertas.length === 0 ? (
              <p className="mt-5 text-sm text-texto-secundario">Nenhuma promoção ativa.</p>
            ) : (
              <div className="mt-5 grid grid-cols-3 gap-6">
                {ofertas.map((o) => (
                  <div key={o.id} className="h-[140px] overflow-hidden rounded-card border-t-[6px] border-destaque bg-superficie px-6 pt-[22px] shadow-sm">
                    <p className="text-[17px] leading-5 font-semibold">{o.nome}</p>
                    <p className="mt-2.5 text-sm leading-[22px] text-texto-medio">{o.descricao}</p>
                    <p className="mt-3 font-display text-xl leading-7 font-black text-primaria">{formatarPreco(o)}</p>
                  </div>
                ))}
              </div>
            )}

            {negocio.catalogo && negocio.catalogo.length > 0 && (
              <>
                <h2 className="mt-[46px] font-display text-2xl leading-7 font-black">Catálogo</h2>
                <div className="mt-5 grid grid-cols-6 gap-4">
                  {negocio.catalogo.map((item) => (
                    <div key={item} className="flex h-14 items-center rounded-input border border-borda-suave bg-superficie px-4 text-sm">
                      {item}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Avisos da comunidade */}
        <div className={`flex items-center justify-between ${temDono ? 'mt-[42px]' : 'mt-9'}`}>
          <h2 className="font-display text-2xl leading-7 font-black">O que a comunidade disse</h2>
          {temDono && (
            <button
              onClick={() => (logado ? setPostando(true) : navigate(PATHS.login))}
              className="h-9 w-[176px] cursor-pointer rounded-input bg-primaria font-rotulo text-[13px] font-semibold text-white transition hover:brightness-110 active:scale-[0.99]"
            >
              + Postar um aviso
            </button>
          )}
        </div>
        <div className={`space-y-3 ${temDono ? 'mt-4' : 'mt-5'}`}>
          {avisos.length === 0 && <p className="text-sm text-texto-secundario">Nenhum aviso ainda.</p>}
          {avisos.map((a) => (
            <div key={a.id} className="flex min-h-[130px] items-start justify-between rounded-card border-l-[6px] border-primaria bg-superficie pt-8 pr-[26px] pb-5 pl-6 shadow-sm">
              <div>
                <p className="leading-[22px] text-texto-medio">“{a.texto}”</p>
                <p className="mt-[38px] text-[13px] leading-[18px] text-texto-secundario">
                  postado por um vizinho · {tempoRelativo(a.criadoEm)}
                </p>
              </div>
              {confirmado(a) && <Carimbo vizinhos={a.votosUtil} />}
            </div>
          ))}
        </div>
      </div>

      {postando && (
        <PostarAvisoModal
          negocioId={negocio.id}
          negocioNome={negocio.nome}
          onClose={() => setPostando(false)}
          onSaved={() => {
            setPostando(false)
            carregar()
          }}
        />
      )}
    </main>
  )
}

function Carimbo({ vizinhos }: { vizinhos: number }) {
  return (
    <div className="-mt-0.5 flex h-[73px] w-[174px] shrink-0 rotate-[6deg] flex-col items-center justify-center rounded-lg border-[2.5px] border-perigo font-carimbo text-perigo">
      <span className="text-sm leading-5">CONFIRMADO</span>
      <span className="text-[10px]">por {vizinhos} vizinhos</span>
    </div>
  )
}
