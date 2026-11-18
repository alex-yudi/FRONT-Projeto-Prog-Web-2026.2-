import type { CategoriaNegocio } from '@/types'
import { db, nextId, salvar } from '../db'
import { CEP, agoraLocal, conflito, created, idParam, noContent, ok, paginate, regras, validar } from '../helpers'
import type { MockRoute } from '../router'
import type { NegocioRow } from '../types'
import { buscarNegocio, isAdmin, logado, toNegocio } from './shared'

const CATEGORIAS: readonly CategoriaNegocio[] = ['HORTIFRUTI', 'MERCADO', 'SERVICOS', 'PADARIA', 'OUTRO']

const schemaNegocio = {
  nome: [regras.obrigatorio('O nome é obrigatório!')],
  categoria: [regras.obrigatorio('A categoria é obrigatória!'), regras.umDe(CATEGORIAS, 'Categoria inválida.')],
  cep: [regras.obrigatorio('O CEP é obrigatório!'), regras.padrao(CEP, 'O CEP deve conter exatamente 8 dígitos!')],
  numero: [regras.obrigatorio('O número é obrigatório!')],
  bairro: [regras.obrigatorio('O bairro é obrigatório!')],
  descricao: [
    regras.obrigatorio('A descrição é obrigatória!'),
    regras.max(500, 'A descrição deve ter no máximo 500 caracteres.'),
  ],
}

function camposNegocio(d: Record<string, unknown>) {
  return {
    nome: String(d.nome),
    categoria: d.categoria as CategoriaNegocio,
    cep: String(d.cep),
    numero: String(d.numero),
    bairro: String(d.bairro).trim(),
    descricao: String(d.descricao),
  }
}

export const negociosRoutes: MockRoute[] = [
  {
    // GET /negocios?bairro&categoria&q&page&size (público)
    method: 'get',
    path: '/negocios',
    handler: ({ query }) => {
      const bairro = query.get('bairro')?.trim()
      const categoria = query.get('categoria')
      const q = query.get('q')?.trim().toLowerCase()
      const lista = db.negocios.filter(
        (n) =>
          n.ativo &&
          (!bairro || n.bairro === bairro) &&
          (!categoria || n.categoria === categoria) &&
          (!q || n.nome.toLowerCase().includes(q) || n.descricao.toLowerCase().includes(q)),
      )
      return ok(paginate(lista, query).map(toNegocio))
    },
  },
  {
    method: 'get',
    path: '/negocios/:id',
    handler: ({ params }) => ok(toNegocio(buscarNegocio(idParam(params.id, 'Negócio')))),
  },
  {
    // POST /negocios — USER vira dono; ADMIN cria sem dono.
    method: 'post',
    path: '/negocios',
    handler: ({ usuario, body }) => {
      const eu = logado(usuario)
      const d = validar(body, schemaNegocio)
      const negocio: NegocioRow = {
        id: nextId(db.negocios),
        ...camposNegocio(d),
        donoId: isAdmin(eu) ? null : eu.id,
        catalogo: [],
        distanciaMetros: Math.round(150 + Math.random() * 800),
        mapa: { x: Math.round(20 + Math.random() * 60), y: Math.round(20 + Math.random() * 60) },
        ativo: true,
      }
      db.negocios.push(negocio)
      db.metricas.push({ negocioId: negocio.id, visualizacoesSemana: 0, seguidores: 0 })
      salvar()
      return created(toNegocio(negocio))
    },
  },
  {
    // PUT /negocios/:id — todos os campos.
    method: 'put',
    path: '/negocios/:id',
    handler: ({ params, body }) => {
      const negocio = buscarNegocio(idParam(params.id, 'Negócio'))
      const d = validar(body, schemaNegocio)
      Object.assign(negocio, camposNegocio(d))
      salvar()
      return ok(toNegocio(negocio))
    },
  },
  {
    // DELETE /negocios/:id — soft delete sem volta; apaga ofertas e avisos.
    method: 'delete',
    path: '/negocios/:id',
    handler: ({ params }) => {
      const negocio = buscarNegocio(idParam(params.id, 'Negócio'))
      negocio.ativo = false
      const avisosRemovidos = new Set(db.avisos.filter((a) => a.negocioId === negocio.id).map((a) => a.id))
      db.ofertas = db.ofertas.filter((o) => o.negocioId !== negocio.id)
      db.avisos = db.avisos.filter((a) => a.negocioId !== negocio.id)
      db.votos = db.votos.filter((v) => !avisosRemovidos.has(v.avisoId))
      salvar()
      return noContent()
    },
  },
  {
    // POST /negocios/:id/reivindicacoes { justificativa? } → 201
    method: 'post',
    path: '/negocios/:id/reivindicacoes',
    handler: ({ usuario, params, body }) => {
      const eu = logado(usuario)
      const negocio = buscarNegocio(idParam(params.id, 'Negócio'))
      const d = validar(body ?? {}, {
        justificativa: [regras.tamanho(1, 10_000, 'A justificativa não pode ser vazia!')],
      })
      if (negocio.donoId !== null) throw conflito('Este negócio já foi reivindicado.')
      const pendente = db.reivindicacoes.some(
        (r) => r.negocioId === negocio.id && r.usuarioId === eu.id && r.status === 'PENDENTE',
      )
      if (pendente) throw conflito('Você já tem uma reivindicação pendente para este negócio.')
      const reivindicacao = {
        id: nextId(db.reivindicacoes),
        negocioId: negocio.id,
        usuarioId: eu.id,
        justificativa: typeof d.justificativa === 'string' ? d.justificativa : null,
        status: 'PENDENTE' as const,
        criadoEm: agoraLocal(),
        decididaEm: null,
        decididaPorId: null,
      }
      db.reivindicacoes.push(reivindicacao)
      salvar()
      return created(reivindicacao)
    },
  },
  {
    // TODO backend: GET /negocios/:id/metricas — números do Dashboard.
    method: 'get',
    path: '/negocios/:id/metricas',
    handler: ({ params }) => {
      const negocio = buscarNegocio(idParam(params.id, 'Negócio'))
      const m = db.metricas.find((x) => x.negocioId === negocio.id)
      return ok({
        negocioId: negocio.id,
        visualizacoesSemana: m?.visualizacoesSemana ?? 0,
        seguidores: m?.seguidores ?? 0,
        avisosParaRevisar: db.avisos.filter((a) => a.negocioId === negocio.id && a.respostaDono === null).length,
      })
    },
  },
]
