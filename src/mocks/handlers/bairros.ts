import { db } from '../db'
import { ok } from '../helpers'
import type { MockRoute } from '../router'

export const bairrosRoutes: MockRoute[] = [
  {
    // TODO backend: GET /bairros — seletor "📍 Centro ▾" da Topbar.
    method: 'get',
    path: '/bairros',
    handler: () => ok(db.bairros),
  },
]
