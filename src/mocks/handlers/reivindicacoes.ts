import type { StatusReivindicacao } from '@/types'
import { db, salvar } from '../db'
import { agoraLocal, idParam, naoEncontrado, ok, paginate, regraViolada, regras, validar } from '../helpers'
import type { MockRoute } from '../router'

export const reivindicacoesRoutes: MockRoute[] = [
  {
    // GET /reivindicacoes?status&page&size
    method: 'get',
    path: '/reivindicacoes',
    handler: ({ query }) => {
      const status = query.get('status')
      const lista = db.reivindicacoes.filter((r) => !status || r.status === status)
      return ok(paginate(lista, query))
    },
  },
  {
    // PATCH /reivindicacoes/:id { status: APROVADA | REJEITADA }. Aprovar define o dono.
    method: 'patch',
    path: '/reivindicacoes/:id',
    handler: ({ usuario, params, body }) => {
      const id = idParam(params.id, 'Reivindicação')
      const reivindicacao = db.reivindicacoes.find((r) => r.id === id)
      if (!reivindicacao) throw naoEncontrado(`Reivindicação com id ${id} não encontrada.`)
      const d = validar(body, {
        status: [
          regras.obrigatorio('O status é obrigatório!'),
          regras.umDe(['APROVADA', 'REJEITADA'], 'Status inválido.'),
        ],
      })
      if (reivindicacao.status !== 'PENDENTE') throw regraViolada('Esta reivindicação já foi decidida.')

      reivindicacao.status = d.status as StatusReivindicacao
      reivindicacao.decididaEm = agoraLocal()
      reivindicacao.decididaPorId = usuario?.id ?? null
      if (reivindicacao.status === 'APROVADA') {
        const negocio = db.negocios.find((n) => n.id === reivindicacao.negocioId)
        if (negocio) negocio.donoId = reivindicacao.usuarioId
      }
      salvar()
      return ok(reivindicacao)
    },
  },
]
