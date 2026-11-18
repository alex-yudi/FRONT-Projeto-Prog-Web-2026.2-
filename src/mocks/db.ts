import { seedAvisos, seedVotos } from './data/avisos'
import { seedBairros } from './data/bairros'
import { seedMetricas, seedNegocios } from './data/negocios'
import { seedOfertas } from './data/ofertas'
import { seedReivindicacoes } from './data/reivindicacoes'
import { seedUsuarios } from './data/usuarios'
import type { MockDb } from './types'

/** Troque a versão quando mudar o formato do seed, para descartar dados antigos salvos. */
const STORAGE_KEY = 'bairro.mockdb.v1'

function criarSeed(): MockDb {
  return {
    usuarios: seedUsuarios(),
    negocios: seedNegocios(),
    ofertas: seedOfertas(),
    avisos: seedAvisos(),
    votos: seedVotos(),
    reivindicacoes: seedReivindicacoes(),
    metricas: seedMetricas(),
    bairros: seedBairros(),
  }
}

function carregar(): MockDb {
  try {
    const salvo = window.localStorage.getItem(STORAGE_KEY)
    if (salvo) return JSON.parse(salvo) as MockDb
  } catch {
    // localStorage indisponível ou corrompido: usa o seed.
  }
  return criarSeed()
}

/** "Banco" em memória. Os handlers leem e alteram este objeto e chamam `salvar()`. */
export const db: MockDb = carregar()

export function salvar(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  } catch {
    // Sem persistência: os dados valem só até recarregar a página.
  }
}

/** Volta o banco ao seed inicial (útil antes de uma apresentação). */
export function resetDb(): void {
  Object.assign(db, criarSeed())
  salvar()
}

/** Próximo id de uma tabela (max + 1). */
export function nextId(tabela: { id: number }[]): number {
  return tabela.reduce((max, row) => Math.max(max, row.id), 0) + 1
}

// Atalho para o console do navegador durante a demo: bairroMock.resetDb()
if (import.meta.env.DEV) {
  ;(window as unknown as { bairroMock: unknown }).bairroMock = { db, resetDb }
}
