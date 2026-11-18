import { minutosAtras } from '../helpers'
import type { AvisoRow, VotoRow } from '../types'

/** Avisos com os textos do Figma. `votosBase` simula votos de outros vizinhos. */
export function seedAvisos(): AvisoRow[] {
  return [
    {
      id: 6,
      negocioId: 4,
      autorId: 2,
      categoria: 'PRECO',
      texto: 'Carne moída está sem promoção até amanhã',
      criadoEm: minutosAtras(180),
      votosBase: { util: 11, naoUtil: 1 },
      respostaDono: null,
    },
    {
      id: 5,
      negocioId: 3,
      autorId: 2,
      categoria: 'ESTOQUE',
      texto: 'Chegou pão francês quentinho, forno acabou de sair',
      criadoEm: minutosAtras(20),
      votosBase: { util: 0, naoUtil: 0 },
      respostaDono: null,
    },
    {
      id: 4,
      negocioId: 5,
      autorId: 5,
      categoria: 'ESTOQUE',
      texto: 'Chegou jiló fresquinho hoje de manhã, tava faltando fazia semana.',
      criadoEm: minutosAtras(300),
      votosBase: { util: 12, naoUtil: 0 },
      respostaDono: 'CONFIRMADO',
    },
    {
      id: 3,
      negocioId: 5,
      autorId: 4,
      categoria: 'ESTOQUE',
      texto: 'A batata tá meio murcha hoje, vale avisar quem for comprar.',
      criadoEm: minutosAtras(40),
      votosBase: { util: 3, naoUtil: 0 },
      respostaDono: null,
    },
    {
      id: 2,
      negocioId: 5,
      autorId: 2,
      categoria: 'ATENDIMENTO',
      texto: 'Fechou mais cedo hoje, não tinha ninguém às 18h',
      criadoEm: minutosAtras(26 * 60),
      votosBase: { util: 2, naoUtil: 3 },
      respostaDono: 'CONTESTADO',
    },
    {
      id: 1,
      negocioId: 1,
      autorId: 6,
      categoria: 'PRECO',
      texto: 'Esse mercadinho tem o melhor preço de arroz e feijão da região, vale a pena conferir.',
      criadoEm: minutosAtras(2 * 24 * 60),
      votosBase: { util: 12, naoUtil: 0 },
      respostaDono: null,
    },
  ]
}

/** Votos reais (de usuários do seed). José marcou "útil" no aviso 6 → total 12 útil / 1 não confere. */
export function seedVotos(): VotoRow[] {
  return [{ id: 1, avisoId: 6, usuarioId: 3, util: true, criadoEm: minutosAtras(120) }]
}
