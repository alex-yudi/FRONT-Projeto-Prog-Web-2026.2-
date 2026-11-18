import type { MetricasRow, NegocioRow } from '../types'

/**
 * Negócios do Figma. A lista da API sai em id DESC, então os ids seguem a ordem
 * da tela de Busca: Quitanda (5), Mercado (4), Padaria (3), Costura (2).
 */
export function seedNegocios(): NegocioRow[] {
  return [
    {
      id: 5,
      nome: 'Quitanda do Zé',
      categoria: 'HORTIFRUTI',
      cep: '59600000',
      numero: '120',
      bairro: 'Centro',
      descricao: 'Hortifruti de bairro com produtos fresquinhos todo dia, direto da feira.',
      donoId: 3,
      logradouro: 'Rua Almino Afonso',
      distanciaMetros: 200,
      catalogo: ['Batata', 'Cebola', 'Laranja', 'Banana', 'Ovos (dúzia)', 'Arroz 5kg'],
      mapa: { x: 38, y: 42 },
      ativo: true,
    },
    {
      id: 4,
      nome: 'Mercado Bom Preço',
      categoria: 'MERCADO',
      cep: '59600010',
      numero: '455',
      bairro: 'Centro',
      descricao: 'Mercado de bairro com açougue, frios e mercearia.',
      donoId: 4,
      logradouro: 'Av. Rio Branco',
      distanciaMetros: 450,
      catalogo: ['Carne moída', 'Frango', 'Arroz', 'Feijão', 'Café'],
      mapa: { x: 62, y: 30 },
      ativo: true,
    },
    {
      id: 3,
      nome: 'Padaria Pão Dourado',
      categoria: 'PADARIA',
      cep: '59600020',
      numero: '87',
      bairro: 'Centro',
      descricao: 'Pão francês saindo do forno de hora em hora, bolos e café da manhã.',
      donoId: 5,
      logradouro: 'Rua Coronel Gurgel',
      distanciaMetros: 320,
      catalogo: ['Pão francês', 'Bolo de milho', 'Café', 'Tapioca'],
      mapa: { x: 50, y: 64 },
      ativo: true,
    },
    {
      id: 2,
      nome: 'Costura da Dona Ana',
      categoria: 'SERVICOS',
      cep: '59600030',
      numero: '210',
      bairro: 'Centro',
      descricao: 'Ajustes, barras e consertos de roupa em geral.',
      donoId: null,
      logradouro: 'Rua Dionísio Filgueira',
      distanciaMetros: 180,
      catalogo: [],
      mapa: { x: 28, y: 70 },
      ativo: true,
    },
    {
      id: 1,
      nome: 'Mercearia Central',
      categoria: 'MERCADO',
      cep: '59603000',
      numero: 's/n',
      bairro: 'Doze Anos',
      descricao: 'Mercadinho de esquina citado pelos vizinhos.',
      donoId: null,
      logradouro: 'Rua Félix Miranda',
      distanciaMetros: 1200,
      catalogo: [],
      mapa: { x: 45, y: 50 },
      ativo: true,
    },
  ]
}

/** mock-only — números do Dashboard (Figma 3:74). */
export function seedMetricas(): MetricasRow[] {
  return [
    { negocioId: 5, visualizacoesSemana: 842, seguidores: 156 },
    { negocioId: 4, visualizacoesSemana: 510, seguidores: 98 },
    { negocioId: 3, visualizacoesSemana: 377, seguidores: 64 },
  ]
}
