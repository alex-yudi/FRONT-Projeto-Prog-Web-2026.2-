import { diasAFrente, proximoDomingo } from '../helpers'
import type { OfertaRow } from '../types'

/** Promoções do Figma. A de id 1 já venceu, para testar o filtro de "promoções ativas". */
export function seedOfertas(): OfertaRow[] {
  const domingo = proximoDomingo()
  return [
    { id: 6, negocioId: 5, nome: 'Alface crespa', descricao: '20% off até domingo', preco: 3.2, validade: domingo },
    { id: 5, negocioId: 5, nome: 'Tomate italiano', descricao: 'Leve 3 pague 2', preco: 6.9, validade: domingo, unidade: 'kg' },
    { id: 4, negocioId: 5, nome: 'Cheiro-verde', descricao: 'Grátis na compra acima de R$20', preco: 0, validade: domingo },
    { id: 3, negocioId: 3, nome: 'Combo café da manhã', descricao: 'Pão francês, café e manteiga', preco: 9.9, validade: diasAFrente(0) },
    { id: 2, negocioId: 4, nome: 'Feijão carioca 1kg', descricao: 'Preço especial no fim de semana', preco: 7.49, validade: null },
    { id: 1, negocioId: 4, nome: 'Carne moída', descricao: 'Promoção encerrada', preco: 24.9, validade: diasAFrente(-1), unidade: 'kg' },
  ]
}
