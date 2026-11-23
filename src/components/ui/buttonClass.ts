export type VarianteBotao = 'primario' | 'secundario' | 'destaque' | 'perigo' | 'contornoPerigo'

const base =
  'inline-flex items-center justify-center gap-2 rounded-input font-rotulo font-semibold text-sm transition disabled:opacity-60'

const variantes: Record<VarianteBotao, string> = {
  primario: 'bg-primaria text-white hover:brightness-110',
  secundario: 'border border-borda bg-superficie text-texto hover:bg-fundo-claro',
  destaque: 'bg-destaque text-texto hover:brightness-95',
  perigo: 'bg-perigo text-white hover:brightness-95',
  contornoPerigo: 'border border-perigo bg-superficie text-perigo hover:bg-alerta-fundo',
}

/** Classes de botão, para usar também em <Link> estilizado como botão. */
export function classeBotao(variante: VarianteBotao = 'primario', opcoes: { bloco?: boolean; pequeno?: boolean } = {}) {
  const tamanho = opcoes.pequeno ? 'h-9 px-4 text-[13px]' : 'h-[43px] px-5'
  return `${base} ${variantes[variante]} ${tamanho} ${opcoes.bloco ? 'w-full' : ''}`.trim()
}
