import type { BairroRow } from '../types'

/** "Alto de São Manoel" fica sem negócios de propósito (tela Feed vazio, Figma 12:168). */
export function seedBairros(): BairroRow[] {
  return [
    { nome: 'Centro', cidade: 'Mossoró', uf: 'RN' },
    { nome: 'Doze Anos', cidade: 'Mossoró', uf: 'RN' },
    { nome: 'Nova Betânia', cidade: 'Mossoró', uf: 'RN' },
    { nome: 'Alto de São Manoel', cidade: 'Mossoró', uf: 'RN' },
  ]
}
