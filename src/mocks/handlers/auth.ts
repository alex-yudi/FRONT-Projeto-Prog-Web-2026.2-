import { db } from '../db'
import { MockHttpError, noContent, ok, regras, validar } from '../helpers'
import { criarToken } from '../jwt'
import type { MockRoute } from '../router'

export const authRoutes: MockRoute[] = [
  {
    // POST /auth/login { email, senha } → { token }
    method: 'post',
    path: '/auth/login',
    handler: ({ body }) => {
      const dados = validar(body, {
        email: [regras.obrigatorio('O email é obrigatório!')],
        senha: [regras.obrigatorio('A senha é obrigatória!')],
      })
      const usuario = db.usuarios.find((u) => u.ativo && u.email === dados.email && u.senha === dados.senha)
      // A API real devolve 403 sem ProblemDetail detalhado em credencial errada.
      if (!usuario) throw new MockHttpError(403, 'E-mail ou senha inválidos.')
      return ok({ token: criarToken(usuario.email, usuario.role) })
    },
  },
  {
    // POST /auth/logout → 204 (nada no servidor; o cliente descarta o token)
    method: 'post',
    path: '/auth/logout',
    handler: () => noContent(),
  },
]
