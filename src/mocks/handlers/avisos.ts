import type { CategoriaAviso, RespostaDono } from '@/types'
import { db, nextId, salvar } from '../db'
import { agoraLocal, created, idParam, noContent, ok, paginate, regras, validar } from '../helpers'
import type { MockRoute } from '../router'
import type { AvisoRow } from '../types'
import { buscarAviso, buscarNegocio, logado, toAviso } from './shared'

const CATEGORIAS: readonly CategoriaAviso[] = ['PRECO', 'ESTOQUE', 'ATENDIMENTO']
const RESPOSTAS: readonly RespostaDono[] = ['CONFIRMADO', 'CONTESTADO']

const schemaAviso = {
  categoria: [regras.obrigatorio('A categoria é obrigatória!'), regras.umDe(CATEGORIAS, 'Categoria inválida.')],
  texto: [regras.obrigatorio('O texto é obrigatório!'), regras.max(500, 'O texto deve ter no máximo 500 caracteres.')],
}

export const avisosRoutes: MockRoute[] = [
  {
    // GET /negocios/:id/avisos?page&size (público). Não existe GET de um aviso por id.
    method: 'get',
    path: '/negocios/:negocioId/avisos',
    handler: ({ params, query, usuario }) => {
      const negocio = buscarNegocio(idParam(params.negocioId, 'Negócio'))
      const lista = db.avisos.filter((a) => a.negocioId === negocio.id)
      return ok(paginate(lista, query).map((a) => toAviso(a, usuario)))
    },
  },
  {
    // POST — o autor é o usuário logado.
    method: 'post',
    path: '/negocios/:negocioId/avisos',
    handler: ({ usuario, params, body }) => {
      const eu = logado(usuario)
      const negocio = buscarNegocio(idParam(params.negocioId, 'Negócio'))
      const d = validar(body, schemaAviso)
      const aviso: AvisoRow = {
        id: nextId(db.avisos),
        negocioId: negocio.id,
        autorId: eu.id,
        categoria: d.categoria as CategoriaAviso,
        texto: String(d.texto),
        criadoEm: agoraLocal(),
        votosBase: { util: 0, naoUtil: 0 },
        respostaDono: null,
      }
      db.avisos.push(aviso)
      salvar()
      return created(toAviso(aviso, eu))
    },
  },
  {
    // PUT /negocios/:id/avisos/:avisoId
    method: 'put',
    path: '/negocios/:negocioId/avisos/:avisoId',
    handler: ({ usuario, params, body }) => {
      const eu = logado(usuario)
      const aviso = buscarAviso(idParam(params.negocioId, 'Negócio'), idParam(params.avisoId, 'Aviso'))
      const d = validar(body, schemaAviso)
      Object.assign(aviso, { categoria: d.categoria, texto: d.texto })
      salvar()
      return ok(toAviso(aviso, eu))
    },
  },
  {
    // DELETE /negocios/:id/avisos/:avisoId
    method: 'delete',
    path: '/negocios/:negocioId/avisos/:avisoId',
    handler: ({ params }) => {
      const aviso = buscarAviso(idParam(params.negocioId, 'Negócio'), idParam(params.avisoId, 'Aviso'))
      db.avisos = db.avisos.filter((a) => a !== aviso)
      db.votos = db.votos.filter((v) => v.avisoId !== aviso.id)
      salvar()
      return noContent()
    },
  },
  {
    // TODO backend: resposta do dono ao aviso (botões Confirmar / Contestar do Dashboard).
    method: 'put',
    path: '/negocios/:negocioId/avisos/:avisoId/resposta-dono',
    handler: ({ usuario, params, body }) => {
      const negocio = buscarNegocio(idParam(params.negocioId, 'Negócio'))
      const aviso = buscarAviso(negocio.id, idParam(params.avisoId, 'Aviso'))
      const d = validar(body, {
        resposta: [regras.obrigatorio('A resposta é obrigatória!'), regras.umDe(RESPOSTAS, 'Resposta inválida.')],
      })
      aviso.respostaDono = d.resposta as RespostaDono
      salvar()
      return ok(toAviso(aviso, usuario))
    },
  },
]
