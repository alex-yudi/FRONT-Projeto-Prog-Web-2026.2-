interface Props {
  /** Linha pequena abaixo: "por 12 vizinhos". */
  legenda: string
}

/** Carimbo vermelho "CONFIRMADO" (Figma: Permanent Marker, levemente inclinado). */
export default function Carimbo({ legenda }: Props) {
  return (
    <div
      aria-label={`Confirmado ${legenda}`}
      className="inline-flex shrink-0 -rotate-6 flex-col items-center rounded-[4px] border-2 border-perigo px-4 py-1.5 font-carimbo uppercase leading-tight text-perigo select-none"
    >
      <span className="text-sm tracking-wide">Confirmado</span>
      <span className="text-[8px] tracking-wider">{legenda}</span>
    </div>
  )
}
