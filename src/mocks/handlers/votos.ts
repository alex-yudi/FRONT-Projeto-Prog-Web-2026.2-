import { db, nextId, salvar } from '../db'
import { agoraLocal, idParam, ok } from '../helpers'
import type { MockRoute } from '../router'
import { buscarAviso, logado } from './shared'

export const votosRoutes: MockRoute[] = [
  {
    // PUT /negocios/:id/avisos/:avisoId/votos/me { util } — idempotente: cria ou troca o voto.
    method: 'put',
    path: '/negocios/:negocioId/avisos/:avisoId/votos/me',
    handler: ({ usuario, params, body }) => {
      const eu = logado(usuario)
      const aviso = buscarAviso(idParam(params.negocioId, 'Negócio'), idParam(params.avisoId, 'Aviso'))
      // Igual à API: `util` é boolean primitivo, então um corpo sem `util` vira false.
      const util = (body as { util?: unknown } | undefined)?.util === true
      let voto = db.votos.find((v) => v.avisoId === aviso.id && v.usuarioId === eu.id)
      if (voto) {
        voto.util = util
      } else {
        voto = { id: nextId(db.votos), avisoId: aviso.id, usuarioId: eu.id, util, criadoEm: agoraLocal() }
        db.votos.push(voto)
      }
      salvar()
      return ok(voto)
    },
  },
]
