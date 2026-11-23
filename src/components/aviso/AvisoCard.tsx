import type { ReactNode } from 'react'
import { Link } from 'react-router'
import Carimbo from '@/components/ui/Carimbo'
import { PATHS } from '@/routes/paths'
import type { AvisoResponse } from '@/types'
import { legendaCarimbo, statusAviso } from '@/utils/aviso'
import { tempoRelativo } from '@/utils/format'

interface Props {
  aviso: AvisoResponse
  /** feed/perfil: faixa verde e "postado por um vizinho"; meus: layout da tela Meus Avisos. */
  variante: 'feed' | 'perfil' | 'meus'
  /** Mostra "📍 Nome do negócio" acima do texto (feed e meus avisos). */
  comNegocio?: boolean
  /** Se informado, 👍/👎 viram botões (precisa de login: quem chama decide o que fazer). */
  onVotar?: (util: boolean) => void
  /** Ações à direita (Editar / Excluir). */
  acoes?: ReactNode
}

function Votos({ aviso, onVotar }: Pick<Props, 'aviso' | 'onVotar'>) {
  const base = 'rounded px-1 py-0.5 font-corpo text-xs'
  const itens = [
    { util: true, texto: `👍 útil (${aviso.votosUtil})`, ativo: aviso.meuVoto === true },
    { util: false, texto: `👎 não confere (${aviso.votosNaoUtil})`, ativo: aviso.meuVoto === false },
  ]
  return (
    <span className="inline-flex gap-2">
      {itens.map((i) =>
        onVotar ? (
          <button
            key={String(i.util)}
            type="button"
            aria-pressed={i.ativo}
            onClick={() => onVotar(i.util)}
            className={`${base} hover:bg-fundo ${i.ativo ? 'bg-fundo font-bold text-primaria' : 'text-texto-medio'}`}
          >
            {i.texto}
          </button>
        ) : (
          <span key={String(i.util)} className={`${base} text-texto-medio`}>
            {i.texto}
          </span>
        ),
      )}
    </span>
  )
}

export default function AvisoCard({ aviso, variante, comNegocio, onVotar, acoes }: Props) {
  const status = statusAviso(aviso)
  const contestado = status === 'CONTESTADO'
  const faixa = contestado ? 'bg-perigo' : variante === 'meus' ? '' : 'bg-primaria'
  const quando = tempoRelativo(aviso.criadoEm)
  const autor = variante === 'perfil' ? `postado por um vizinho · ${quando}` : `postado ${quando}`

  return (
    <article className="flex overflow-hidden rounded-card bg-superficie shadow-card">
      {faixa && <div className={`w-1.5 shrink-0 ${faixa}`} aria-hidden="true" />}
      <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-x-4 gap-y-3 p-4">
        <div className="min-w-0 flex-1 basis-56">
          {comNegocio && (
            <p className="mb-1 font-rotulo text-xs font-bold text-texto-medio">
              <span aria-hidden="true">📍 </span>
              {variante === 'meus' ? (
                <Link to={PATHS.negocio(aviso.negocioId)} className="hover:underline">
                  {aviso.negocioNome}
                </Link>
              ) : (
                aviso.negocioNome
              )}
            </p>
          )}
          <p className="font-corpo text-[15px] leading-snug text-texto">“{aviso.texto}”</p>
          <p
            className={`mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-corpo text-xs ${
              contestado ? 'font-semibold text-perigo' : 'text-texto-secundario'
            }`}
          >
            <span>{autor}</span>
            {contestado ? (
              <>
                <span aria-hidden="true">·</span>
                <span>⚠ contestado pelo dono do negócio</span>
              </>
            ) : status === 'AGUARDANDO' && variante === 'meus' ? (
              <>
                <span aria-hidden="true">·</span>
                <span>⏳ aguardando confirmação da vizinhança</span>
              </>
            ) : (
              <>
                <span aria-hidden="true">·</span>
                <Votos aviso={aviso} onVotar={onVotar} />
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {status === 'CONFIRMADO' && <Carimbo legenda={legendaCarimbo(aviso)} />}
          {acoes}
        </div>
      </div>
    </article>
  )
}
