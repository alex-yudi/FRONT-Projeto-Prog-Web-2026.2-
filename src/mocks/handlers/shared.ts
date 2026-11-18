import type { AvisoResponse, NegocioResponse, UsuarioResponse } from '@/types'
import { db } from '../db'
import { naoEncontrado } from '../helpers'
import type { AvisoRow, NegocioRow, UsuarioRow } from '../types'

// ---------------------------------------------------------------------------
// Conversões linha do banco → Response da API
// ---------------------------------------------------------------------------
export function toUsuario({ id, nome, email, cep, numero }: UsuarioRow): UsuarioResponse {
  return { id, nome, email, cep, numero }
}

export function toNegocio(row: NegocioRow): NegocioResponse {
  const { ativo: _ativo, ...negocio } = row
  return negocio
}

export function toAviso(row: AvisoRow, usuario: UsuarioRow | null): AvisoResponse {
  const votos = db.votos.filter((v) => v.avisoId === row.id)
  const meu = usuario ? votos.find((v) => v.usuarioId === usuario.id) : undefined
  return {
    id: row.id,
    negocioId: row.negocioId,
    autorId: row.autorId,
    categoria: row.categoria,
    texto: row.texto,
    criadoEm: row.criadoEm,
    votosUtil: row.votosBase.util + votos.filter((v) => v.util).length,
    votosNaoUtil: row.votosBase.naoUtil + votos.filter((v) => !v.util).length,
    // mock-only
    autorNome: db.usuarios.find((u) => u.id === row.autorId)?.nome,
    negocioNome: db.negocios.find((n) => n.id === row.negocioId)?.nome,
    meuVoto: usuario ? (meu?.util ?? null) : undefined,
    respostaDono: row.respostaDono,
  }
}

// ---------------------------------------------------------------------------
// Buscas com 404 e usuário logado
// ---------------------------------------------------------------------------
export function buscarNegocio(id: number): NegocioRow {
  const negocio = db.negocios.find((n) => n.id === id && n.ativo)
  if (!negocio) throw naoEncontrado(`Negócio com id ${id} não encontrado.`)
  return negocio
}

export function buscarAviso(negocioId: number, avisoId: number): AvisoRow {
  const aviso = db.avisos.find((a) => a.id === avisoId && a.negocioId === negocioId)
  if (!aviso) throw naoEncontrado(`Aviso com id ${avisoId} não encontrado.`)
  return aviso
}

export const isAdmin = (usuario: UsuarioRow | null) => usuario?.role === 'ADMIN'

/** Usuário logado (dono do token salvo). Rotas como "postar aviso" precisam saber quem é o autor. */
export function logado(usuario: UsuarioRow | null): UsuarioRow {
  if (!usuario) throw new Error('[mock] Esta rota precisa de um usuário logado: faça login antes.')
  return usuario
}
