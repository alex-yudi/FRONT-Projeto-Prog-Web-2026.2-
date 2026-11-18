/** URLs do app. Use sempre estas constantes em <Link>/navigate, nunca strings soltas. */
export const PATHS = {
  feed: '/',
  login: '/login',
  cadastro: '/cadastro',
  busca: '/busca',
  negocio: (id: number | string = ':id') => `/negocios/${id}`,
  reivindicar: (id: number | string = ':id') => `/negocios/${id}/reivindicar`,
  novoNegocio: '/negocios/novo',
  editarNegocio: (id: number | string = ':id') => `/negocios/${id}/editar`,
  painel: '/painel',
  minhaConta: '/minha-conta',
  meusAvisos: '/meus-avisos',
} as const
