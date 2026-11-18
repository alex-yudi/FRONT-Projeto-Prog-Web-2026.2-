export interface UsuarioResponse {
  id: number
  nome: string
  email: string
  /** 8 dígitos, sem hífen. */
  cep: string
  numero: string
}

export interface UsuarioRegistroRequest {
  nome: string
  email: string
  /** 8 a 32 caracteres. */
  senha: string
  cep: string
  numero: string
}

/** PUT /usuarios/me envia todos os campos, sem senha. Trocar o e-mail invalida o token. */
export interface UsuarioAtualizacaoRequest {
  nome: string
  email: string
  cep: string
  numero: string
}

export interface LoginRequest {
  email: string
  senha: string
}

export interface LoginResponse {
  token: string
}
