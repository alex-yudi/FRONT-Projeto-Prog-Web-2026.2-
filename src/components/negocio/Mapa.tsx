import { useNavigate } from 'react-router'
import { useBairro } from '@/hooks/useBairro'
import { PATHS } from '@/routes/paths'

export interface Pino {
  id: number
  nome: string
  /** Posição em % (0–100) dentro do mapa. */
  x: number
  y: number
  /** Amarelo = tem promoção; vermelho = só avisos; verde = sem novidades. */
  tipo: 'promo' | 'aviso' | 'neutro'
}

const cores: Record<Pino['tipo'], string> = {
  promo: 'bg-destaque',
  aviso: 'bg-perigo',
  neutro: 'bg-primaria/70',
}

/** "Você está aqui": mesma posição do pino verde grande do Figma. */
const VOCE = { x: 30, y: 54 }

/** Mapa estilizado do Figma (ruas, rio e quadra verde desenhados em CSS) com os negócios como pinos. */
export default function Mapa({ pinos, className = '' }: { pinos: Pino[]; className?: string }) {
  const navigate = useNavigate()
  const { atual } = useBairro()
  const local = `${atual?.cidade ?? 'Mossoró'} · ${atual?.uf ?? 'RN'}`

  return (
    <div
      className={`relative min-h-[260px] overflow-hidden bg-mapa ${className}`}
      role="img"
      aria-label={`Mapa estilizado de ${local} com ${pinos.length} negócios`}
    >
      {/* ruas */}
      {[22, 57, 87].map((y) => (
        <div key={y} className="absolute inset-x-0 h-[3px] bg-white/50" style={{ top: `${y}%` }} />
      ))}
      {[10, 23, 38, 55, 78].map((x) => (
        <div key={x} className="absolute inset-y-0 w-[3px] bg-white/50" style={{ left: `${x}%` }} />
      ))}
      <div className="absolute inset-x-0 top-[34%] h-[6px] bg-white/80" />
      <div className="absolute inset-y-0 left-[38%] w-[6px] bg-white/80" />
      {/* rio e quadra verde */}
      <div className="absolute -left-[10%] top-[58%] h-[16%] w-[130%] origin-left rotate-[17deg] bg-mapa-rio" />
      <div className="absolute left-[63%] top-[58%] h-[12%] w-[10%] rounded-[3px] bg-mapa-verde" />

      <span className="absolute left-5 top-5 font-rotulo text-[11px] font-bold tracking-wide text-texto-secundario">
        {local.toUpperCase()}
      </span>

      {pinos.map((p) => (
        <button
          key={p.id}
          type="button"
          title={p.nome}
          aria-label={`Abrir ${p.nome}`}
          onClick={() => navigate(PATHS.negocio(p.id))}
          className={`absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-card transition hover:scale-125 ${cores[p.tipo]}`}
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
        />
      ))}

      <span
        title="Você está aqui"
        className="absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-primaria shadow-card"
        style={{ left: `${VOCE.x}%`, top: `${VOCE.y}%` }}
      />
    </div>
  )
}
