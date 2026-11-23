interface Opcao<T extends string> {
  valor: T
  label: string
}

interface Props<T extends string> {
  opcoes: readonly Opcao<T>[]
  valor: T
  onChange: (valor: T) => void
  /** Rótulo acessível do grupo. */
  rotulo: string
  /** Quando true, o chip selecionado e os demais ficam com o tamanho "compacto" dos filtros. */
  compacto?: boolean
}

/** Pílulas de seleção única (categoria, "válido por", filtros da busca). */
export default function ChipGroup<T extends string>({ opcoes, valor, onChange, rotulo, compacto }: Props<T>) {
  return (
    <div role="radiogroup" aria-label={rotulo} className="flex flex-wrap gap-2">
      {opcoes.map((o) => {
        const ativo = o.valor === valor
        return (
          <button
            key={o.valor}
            type="button"
            role="radio"
            aria-checked={ativo}
            onClick={() => onChange(o.valor)}
            className={`rounded-pilula border font-rotulo text-xs font-semibold transition ${
              compacto ? 'h-9 px-4' : 'h-[30px] px-3.5'
            } ${
              ativo
                ? 'border-primaria bg-primaria text-white'
                : 'border-borda bg-superficie text-texto hover:bg-fundo-claro'
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
