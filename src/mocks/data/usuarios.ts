import type { UsuarioRow } from '../types'

/**
 * Usuários de demonstração. As senhas são valores de teste, só existem no mock.
 *
 * | Perfil              | E-mail                  | Senha        |
 * |---------------------|-------------------------|--------------|
 * | Vizinha             | maria.souza@email.com   | maria12345   |
 * | Dono (Quitanda)     | jose@email.com          | jose12345    |
 * | ADMIN               | admin@bairro.com        | admin12345   |
 */
export function seedUsuarios(): UsuarioRow[] {
  return [
    { id: 1, nome: 'Admin bairro.', email: 'admin@bairro.com', senha: 'admin12345', role: 'ADMIN', cep: '59600000', numero: '1', ativo: true },
    { id: 2, nome: 'Maria Souza', email: 'maria.souza@email.com', senha: 'maria12345', role: 'USER', cep: '59600000', numero: '340', ativo: true },
    { id: 3, nome: 'José Almeida', email: 'jose@email.com', senha: 'jose12345', role: 'USER', cep: '59600000', numero: '120', ativo: true },
    { id: 4, nome: 'Carlos Lima', email: 'carlos@email.com', senha: 'carlos12345', role: 'USER', cep: '59600010', numero: '455', ativo: true },
    { id: 5, nome: 'Rita Pereira', email: 'rita@email.com', senha: 'rita12345', role: 'USER', cep: '59600020', numero: '87', ativo: true },
    { id: 6, nome: 'Ana Ribeiro', email: 'ana@email.com', senha: 'ana123456', role: 'USER', cep: '59600030', numero: '210', ativo: true },
  ]
}
