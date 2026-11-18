/** Categorias de negócio aceitas pela API. */
export type CategoriaNegocio = 'HORTIFRUTI' | 'MERCADO' | 'SERVICOS' | 'PADARIA' | 'OUTRO'

/** Papel do usuário, lido do claim `role` do JWT (não vem no UsuarioResponse). */
export type Role = 'ADMIN' | 'USER'

/**
 * Parâmetros de paginação. A API devolve só o array (sem total):
 * acabou quando vier menos itens que `size`. `page` começa em 0; `size` padrão 20, máx. 50.
 */
export interface Paginacao {
  page?: number
  size?: number
}

/** Data no formato yyyy-MM-dd. */
export type DataISO = string

/** LocalDateTime sem fuso (yyyy-MM-ddTHH:mm:ss), tratado como horário de Brasília. */
export type DataHoraLocal = string
