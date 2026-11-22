# bairro. — Frontend

Crowdsourcing local de bairro: vizinhos encontram negócios locais, veem promoções e postam avisos que outros vizinhos confirmam. Projeto de Programação Web 2026.2 (UFERSA).

**Stack:** React 19, Vite 8, TypeScript, React Router 7, Tailwind CSS 4.

## Rodando

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # checagem de tipos + build
npm run lint
```

Nesta fase **não há integração com o backend**: todos os dados vêm dos mocks em `src/mocks`, que simulam as respostas da API.

## Estrutura

```
src/
├─ main.tsx            # monta o RouterProvider
├─ index.css           # Tailwind + tokens do Figma (@theme)
├─ routes/             # paths.ts (URLs) e router.tsx (rotas)
├─ layouts/            # AppLayout (com Topbar) e AuthLayout (login/cadastro)
├─ pages/              # uma pasta por tela do Figma (componentes usados só por ela ficam em pages/<Tela>/components)
├─ components/
│  ├─ layout/Topbar    # cabeçalho de todas as telas, menos login e cadastro
│  ├─ modals/          # modais usados por mais de uma tela (AvisoFormModal)
│  └─ ui/ negocio/ aviso/ oferta/   # componentes compartilhados (criados tela a tela)
├─ lib/                # token JWT (localStorage) e ProblemDetail/ApiError
├─ services/           # funções que as telas chamam (uma por endpoint)
├─ types/              # DTOs da API
├─ mocks/              # "servidor falso": server.ts, banco em memória, seed e handlers
├─ hooks/ contexts/ utils/
```

## Como os mocks funcionam

```
Tela → services/negocios.service.ts → mockApi.get('/negocios', filtros) → mocks/server.ts → mocks/handlers/negocios.ts → mocks/db.ts
```

- Os **services** fazem "pseudo-requisições": método e caminho iguais aos da API (`mockApi.get('/negocios', { bairro })`). As telas só chamam os services.
- O **servidor mock** (`mocks/server.ts`) casa o método e o caminho com os handlers e resolve com os dados. Se algo falhar (campo inválido, id inexistente, e-mail duplicado), rejeita com um `ApiError` que contém o `ProblemDetail`.
- **Não há atraso simulado nem regras de permissão.** O token salvo no login serve só para o mock saber quem é o usuário logado (autor de um aviso, "meus avisos", "meus negócios").
- O **banco** (`mocks/db.ts`) começa com o seed de `mocks/data/`, que usa os textos do Figma. As alterações ficam salvas no `localStorage`.
  - Para voltar ao seed, rode no console do navegador: `bairroMock.resetDb()`.
- Os campos e as rotas que **só existem no mock** estão marcados com `// mock-only` e `// TODO backend`. Essa é a lista do que o backend ainda precisa ganhar.

### Usuários de demonstração

| Perfil | E-mail | Senha |
|---|---|---|
| Vizinha | `maria.souza@email.com` | `maria12345` |
| Dono da Quitanda do Zé | `jose@email.com` | `jose12345` |
| ADMIN | `admin@bairro.com` | `admin12345` |

São valores de teste e só existem em `src/mocks/data/usuarios.ts`.

## Contribuindo

Uma tela por vez, sempre usando os `services/` (nunca `mocks/` direto) e os tokens do Tailwind definidos em `src/index.css`. Cada página traz no topo o node id do frame correspondente no Figma.
