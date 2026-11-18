import { mockApi } from '@/mocks/server'
import type { BairroResponse } from '@/types'

/** TODO backend: endpoint existe só no mock (seletor de bairro da Topbar). */
export const getBairros = () => mockApi.get<BairroResponse[]>('/bairros')
