import { db, nextId, salvar } from '../db'
import { CEP, conflito, created, noContent, ok, paginate, regras, validar } from '../helpers'
import type { MockRoute } from '../router'
import { logado, toAviso, toNegocio, toUsuario } from './shared'

const camposComuns = {
  nome: [regras.obrigatorio('O nome é obrigatório!')],
  email: [regras.obrigatorio('O email é obrigatório!'), regras.email('O email informado não é válido!')],
  cep: [regras.obrigatorio('O CEP é obrigatório!'), regras.padrao(CEP, 'O CEP deve conter exatamente 8 dígitos!')],
  numero: [regras.obrigatorio('O número é obrigatório!')],
}

function emailEmUso(email: unknown, exceto?: number) {
  return db.usuarios.some((u) => u.ativo && u.email === email && u.id !== exceto)
}

export const usuariosRoutes: MockRoute[] = [
  {
    // POST /usuarios (público) → 201 UsuarioResponse
    method: 'post',
    path: '/usuarios',
    handler: ({ body }) => {
      const d = validar(body, {
        ...camposComuns,
        senha: [
          regras.obrigatorio('A senha é obrigatória!'),
          regras.tamanho(8, 32, 'A senha deve ter entre 8 e 32 caracteres!'),
        ],
      })
      if (emailEmUso(d.email)) throw conflito('Já existe um registro com esses dados.')
      const usuario = {
        id: nextId(db.usuarios),
        nome: String(d.nome),
        email: String(d.email),
        senha: String(d.senha),
        cep: String(d.cep),
        numero: String(d.numero),
        role: 'USER' as const,
        ativo: true,
      }
      db.usuarios.push(usuario)
      salvar()
      return created(toUsuario(usuario))
    },
  },
  {
    method: 'get',
    path: '/usuarios/me',
    handler: ({ usuario }) => ok(toUsuario(logado(usuario))),
  },
  {
    // PUT /usuarios/me — todos os campos, sem senha. Trocar o e-mail invalida o token atual.
    method: 'put',
    path: '/usuarios/me',
    handler: ({ usuario, body }) => {
      const eu = logado(usuario)
      const d = validar(body, camposComuns)
      if (emailEmUso(d.email, eu.id)) throw conflito('Já existe um registro com esses dados.')
      Object.assign(eu, { nome: d.nome, email: d.email, cep: d.cep, numero: d.numero })
      salvar()
      return ok(toUsuario(eu))
    },
  },
  {
    // DELETE /usuarios/me — soft delete: anonimiza e-mail, desvincula negócios, remove votos.
    method: 'delete',
    path: '/usuarios/me',
    handler: ({ usuario }) => {
      const eu = logado(usuario)
      eu.ativo = false
      eu.email = `excluido-${eu.id}@anonimo.local`
      db.negocios.forEach((n) => {
        if (n.donoId === eu.id) n.donoId = null
      })
      db.votos = db.votos.filter((v) => v.usuarioId !== eu.id)
      salvar()
      return noContent()
    },
  },
  {
    // GET /usuarios/me/avisos?page&size
    method: 'get',
    path: '/usuarios/me/avisos',
    handler: ({ usuario, query }) => {
      const eu = logado(usuario)
      const ativos = new Set(db.negocios.filter((n) => n.ativo).map((n) => n.id))
      const meus = db.avisos.filter((a) => a.autorId === eu.id && ativos.has(a.negocioId))
      return ok(paginate(meus, query).map((a) => toAviso(a, eu)))
    },
  },
  {
    // TODO backend: GET /usuarios/me/negocios — necessário para o Dashboard e o Editar negócio.
    method: 'get',
    path: '/usuarios/me/negocios',
    handler: ({ usuario }) => {
      const eu = logado(usuario)
      const meus = db.negocios.filter((n) => n.ativo && n.donoId === eu.id)
      return ok([...meus].sort((a, b) => b.id - a.id).map(toNegocio))
    },
  },
]
