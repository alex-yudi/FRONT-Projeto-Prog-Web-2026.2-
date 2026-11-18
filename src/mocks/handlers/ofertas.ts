import { db, nextId, salvar } from '../db'
import { MockHttpError, created, idParam, naoEncontrado, noContent, ok, regras, validar } from '../helpers'
import type { MockRoute } from '../router'
import type { OfertaRow } from '../types'
import { buscarNegocio } from './shared'

const DATA = /^\d{4}-\d{2}-\d{2}$/

const schemaOferta = {
  nome: [regras.obrigatorio('O nome é obrigatório!'), regras.max(150, 'O nome deve ter no máximo 150 caracteres.')],
  descricao: [
    regras.obrigatorio('A descrição é obrigatória!'),
    regras.max(500, 'A descrição deve ter no máximo 500 caracteres.'),
  ],
  preco: [regras.obrigatorio('O preço é obrigatório!'), regras.naoNegativo('O preço não pode ser negativo!')],
  validade: [regras.padrao(DATA, 'A validade deve estar no formato yyyy-MM-dd.')],
}

function camposOferta(d: Record<string, unknown>) {
  const preco = Number(d.preco)
  if (Number.isNaN(preco)) {
    throw new MockHttpError(400, 'O preço informado não é um número.', undefined, 'Corpo da requisição inválido')
  }
  return {
    nome: String(d.nome),
    descricao: String(d.descricao),
    preco,
    validade: typeof d.validade === 'string' && d.validade !== '' ? d.validade : null,
  }
}

function buscarOferta(negocioId: number, ofertaId: number): OfertaRow {
  const oferta = db.ofertas.find((o) => o.id === ofertaId && o.negocioId === negocioId)
  if (!oferta) throw naoEncontrado(`Oferta com id ${ofertaId} não encontrada.`)
  return oferta
}

export const ofertasRoutes: MockRoute[] = [
  {
    // GET /negocios/:id/ofertas — sem paginação e sem filtrar validade (vencidas também vêm).
    method: 'get',
    path: '/negocios/:negocioId/ofertas',
    handler: ({ params }) => {
      const negocio = buscarNegocio(idParam(params.negocioId, 'Negócio'))
      return ok(db.ofertas.filter((o) => o.negocioId === negocio.id).sort((a, b) => b.id - a.id))
    },
  },
  {
    method: 'get',
    path: '/negocios/:negocioId/ofertas/:ofertaId',
    handler: ({ params }) => {
      const negocio = buscarNegocio(idParam(params.negocioId, 'Negócio'))
      return ok(buscarOferta(negocio.id, idParam(params.ofertaId, 'Oferta')))
    },
  },
  {
    method: 'post',
    path: '/negocios/:negocioId/ofertas',
    handler: ({ params, body }) => {
      const negocio = buscarNegocio(idParam(params.negocioId, 'Negócio'))
      const oferta: OfertaRow = {
        id: nextId(db.ofertas),
        negocioId: negocio.id,
        ...camposOferta(validar(body, schemaOferta)),
      }
      db.ofertas.push(oferta)
      salvar()
      return created(oferta)
    },
  },
  {
    method: 'put',
    path: '/negocios/:negocioId/ofertas/:ofertaId',
    handler: ({ params, body }) => {
      const negocio = buscarNegocio(idParam(params.negocioId, 'Negócio'))
      const oferta = buscarOferta(negocio.id, idParam(params.ofertaId, 'Oferta'))
      Object.assign(oferta, camposOferta(validar(body, schemaOferta)))
      salvar()
      return ok(oferta)
    },
  },
  {
    // DELETE — usado pelo "Encerrar promoção".
    method: 'delete',
    path: '/negocios/:negocioId/ofertas/:ofertaId',
    handler: ({ params }) => {
      const negocio = buscarNegocio(idParam(params.negocioId, 'Negócio'))
      const oferta = buscarOferta(negocio.id, idParam(params.ofertaId, 'Oferta'))
      db.ofertas = db.ofertas.filter((o) => o !== oferta)
      salvar()
      return noContent()
    },
  },
]
