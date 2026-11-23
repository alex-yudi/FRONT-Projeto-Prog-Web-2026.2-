// Figma: 3:74 — Dono 2 — Dashboard
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { PATHS } from '@/routes/paths'
import { getSessao } from '@/services/auth.service'
import { getAvisos, responderAviso } from '@/services/avisos.service'
import { getMetricasNegocio } from '@/services/negocios.service'
import { getOfertas } from '@/services/ofertas.service'
import { getMeusNegocios } from '@/services/usuarios.service'
import type { AvisoResponse, NegocioMetricas, NegocioResponse, OfertaResponse, RespostaDono } from '@/types'
import EncerrarPromocaoModal from './components/EncerrarPromocaoModal'
import PromocaoFormModal from './components/PromocaoFormModal'

type Modal = { tipo: 'promocao'; oferta?: OfertaResponse } | { tipo: 'encerrar'; oferta: OfertaResponse } | null

/** Data de hoje (local) em yyyy-MM-dd, para comparar com `validade`. */
function hojeISO() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** Até 6 dias à frente: nome do dia ("domingo"); depois disso: "22/11". */
function textoValidade(data: string) {
  const dias = Math.round((new Date(data + 'T00:00').getTime() - new Date(hojeISO() + 'T00:00').getTime()) / 86_400_000)
  if (dias === 0) return 'hoje'
  if (dias < 7) return new Date(data + 'T00:00').toLocaleDateString('pt-BR', { weekday: 'long' }).replace('-feira', '')
  return data.slice(8, 10) + '/' + data.slice(5, 7)
}

function tempoRelativo(criadoEm: string) {
  const minutos = Math.max(0, Math.round((Date.now() - new Date(criadoEm).getTime()) / 60_000))
  if (minutos < 1) return 'agora'
  if (minutos < 60) return `há ${minutos} min`
  if (minutos < 24 * 60) return `há ${Math.floor(minutos / 60)}h`
  const dias = Math.floor(minutos / (24 * 60))
  return dias === 1 ? 'há 1 dia' : `há ${dias} dias`
}

export default function DashboardPage() {
  const logado = getSessao() !== null
  const [negocio, setNegocio] = useState<NegocioResponse | null>(null)
  const [semNegocio, setSemNegocio] = useState(false)
  const [metricas, setMetricas] = useState<NegocioMetricas | null>(null)
  const [ofertas, setOfertas] = useState<OfertaResponse[]>([])
  const [avisos, setAvisos] = useState<AvisoResponse[]>([])
  const [modal, setModal] = useState<Modal>(null)

  async function carregar() {
    const [meu] = await getMeusNegocios()
    if (!meu) return setSemNegocio(true)
    const hoje = hojeISO()
    const [m, o, a] = await Promise.all([getMetricasNegocio(meu.id), getOfertas(meu.id), getAvisos(meu.id)])
    setNegocio(meu)
    setMetricas(m)
    setOfertas(o.filter((x) => x.validade === null || x.validade >= hoje))
    setAvisos(a.filter((x) => !x.respostaDono))
  }

  useEffect(() => {
    // carregar() só altera o estado depois dos awaits, não de forma síncrona.
    // oxlint-disable-next-line react/set-state-in-effect
    if (logado) carregar()
  }, [logado])

  async function responder(aviso: AvisoResponse, resposta: RespostaDono) {
    await responderAviso(aviso.negocioId, aviso.id, resposta)
    carregar()
  }

  function fecharModal() {
    setModal(null)
    carregar()
  }

  if (!logado) return <Aviso texto="Entre como dono para ver o painel." link={PATHS.login} acao="Entrar" />
  if (semNegocio) return <Aviso texto="Você ainda não tem negócio cadastrado." link={PATHS.novoNegocio} acao="Cadastrar negócio" />
  if (!negocio || !metricas) return <Aviso texto="Carregando..." />

  return (
    <main className="px-16 py-8 font-rotulo">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[28px] leading-[34px] font-extrabold">Painel — {negocio.nome}</h1>
          <Link to={PATHS.editarNegocio(negocio.id)} className="mt-1.5 inline-block text-sm font-semibold text-primaria cursor-pointer underline-offset-2 hover:underline">
            ✏️ Editar dados do negócio
          </Link>
        </div>
        <button onClick={() => setModal({ tipo: 'promocao' })} className="h-12 w-[200px] cursor-pointer rounded-card bg-destaque text-[15px] font-semibold transition hover:brightness-95 active:scale-[0.99]">
          + Nova promoção
        </button>
      </div>

      <div className="mt-1.5 grid grid-cols-3 gap-5">
        <Metrica rotulo="Visualizações essa semana" valor={metricas.visualizacoesSemana} />
        <Metrica rotulo="Seguidores no bairro" valor={metricas.seguidores} />
        <Metrica rotulo="Avisos da comunidade p/ revisar" valor={metricas.avisosParaRevisar} destaque />
      </div>

      <h2 className="mt-10 text-[22px] leading-[27px] font-extrabold">Promoções ativas</h2>
      <div className="mt-5 space-y-3">
        {ofertas.length === 0 && <p className="text-sm text-texto-secundario">Nenhuma promoção ativa.</p>}
        {ofertas.map((o) => (
          <div key={o.id} className="flex h-[76px] items-center justify-between rounded-card bg-superficie pr-[34px] pl-6">
            <div>
              <p className="text-[17px] leading-[22px] font-semibold">{o.nome}</p>
              <p className="mt-1 text-[13px] leading-[18px] text-texto-secundario">
                {o.descricao}
                {o.validade && ` · válido até ${textoValidade(o.validade)}`}
              </p>
            </div>
            <div className="flex gap-10 text-sm font-semibold">
              <button onClick={() => setModal({ tipo: 'promocao', oferta: o })} className="text-primaria cursor-pointer underline-offset-2 hover:underline">
                Editar
              </button>
              <button onClick={() => setModal({ tipo: 'encerrar', oferta: o })} className="text-perigo cursor-pointer underline-offset-2 hover:underline">
                Encerrar
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="mt-8 text-[22px] leading-[27px] font-extrabold">Avisos da comunidade</h2>
      <div className="mt-5 space-y-3">
        {avisos.length === 0 && <p className="text-sm text-texto-secundario">Nenhum aviso para revisar.</p>}
        {avisos.map((a) => (
          <div key={a.id} className="flex min-h-[96px] items-start justify-between rounded-card bg-superficie pt-[18px] pr-[124px] pb-4 pl-6">
            <div>
              <p className="leading-6 text-texto-medio">“{a.texto}”</p>
              <p className="mt-5 text-[13px] leading-[18px] text-texto-secundario">
                postado por um vizinho · {tempoRelativo(a.criadoEm)}
              </p>
            </div>
            <div className="mt-4 flex gap-[52px] text-sm font-semibold">
              <button onClick={() => responder(a, 'CONFIRMADO')} className="text-primaria cursor-pointer underline-offset-2 hover:underline">
                Confirmar
              </button>
              <button onClick={() => responder(a, 'CONTESTADO')} className="text-perigo cursor-pointer underline-offset-2 hover:underline">
                Contestar
              </button>
            </div>
          </div>
        ))}
      </div>

      {modal?.tipo === 'promocao' && (
        <PromocaoFormModal negocioId={negocio.id} oferta={modal.oferta} onClose={() => setModal(null)} onSaved={fecharModal} />
      )}
      {modal?.tipo === 'encerrar' && (
        <EncerrarPromocaoModal negocioId={negocio.id} oferta={modal.oferta} onClose={() => setModal(null)} onDone={fecharModal} />
      )}
    </main>
  )
}

function Metrica({ rotulo, valor, destaque }: { rotulo: string; valor: number; destaque?: boolean }) {
  return (
    <div className="h-[100px] rounded-card bg-superficie px-6 pt-5">
      <p className="text-[13px] leading-5 text-texto-secundario">{rotulo}</p>
      <p className={`mt-1 text-[32px] leading-10 font-extrabold ${destaque ? 'text-perigo' : ''}`}>{valor}</p>
    </div>
  )
}

function Aviso({ texto, link, acao }: { texto: string; link?: string; acao?: string }) {
  return (
    <main className="px-16 py-10 font-rotulo text-texto-secundario">
      <p>{texto}</p>
      {link && (
        <Link to={link} className="mt-2 inline-block font-semibold text-primaria cursor-pointer underline-offset-2 hover:underline">
          {acao}
        </Link>
      )}
    </main>
  )
}
