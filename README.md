# quizzes

Desafio técnico para um sistema de Quizz com perguntas sobre países e continentes, pontuação por acertos/erros e ranking de XP.

**Autor**
1. Manuel dos Santos
2. GitHub: `https://github.com/nuelst/quizzes`
3. LinkedIn: `https://www.linkedin.com/in/nuelst/`

**Requisitos atendidos**
1. Sistema de Quizz com páginas de listagem, jogo e ranking
2. Quizzes sobre países e continentes
3. +50 XP por acerto e -15 XP por erro (saldo pode ficar negativo)
4. Back-end em NestJS + TypeScript + Prisma + PostgreSQL
5. Front-end em React + TypeScript
6. Docker para banco de dados
7. Estrutura seguindo Clean Architecture e Clean Code

**Stack**
1. Back-end: NestJS, Prisma ORM, PostgreSQL
2. Front-end: React, Vite, Axios
3. Infra: Docker Compose

**Arquitetura (resumo)**
1. `domain`: entidades e contratos de repositório
2. `application`: casos de uso e DTOs
3. `infrastructure`: HTTP controllers e implementação de repositórios Prisma

**Principais rotas da API**
1. `POST /auth/session` login/cadastro por username
2. `GET /auth/ranking` ranking por XP
3. `GET /quizzes` lista de quizzes
4. `GET /quizzes/:id` detalhes do quiz com perguntas e respostas embaralhadas (sem isCorrect)
5. `POST /attempts` inicia tentativa
6. `POST /attempts/:id/answers` envia resposta (+50/-15)
7. `POST /attempts/:id/complete` finaliza tentativa

**Swagger**
1. `http://localhost:3333/api/docs`

**Pré-requisitos**
1. Node.js e pnpm
2. Docker e Docker Compose

**Como rodar**
1. Clone o repositório:
```bash
git clone git@github.com:nuelst/quizzes.git
cd quizzes
```
2. Suba o banco de dados:
```bash
docker compose -f backend/compose.yml up -d
```
3. Configure variáveis de ambiente do back-end:
```bash
cp backend/.env.example backend/.env
```
Edite `backend/.env` se necessário. O padrão do projeto usa `PORT=3333`.

4. Instale dependências:
```bash
pnpm --dir backend install
pnpm --dir frontend install
```
5. Gere o cliente Prisma, rode migrations e seed:
```bash
pnpm --dir backend prisma:generate
pnpm --dir backend prisma:migrate
pnpm --dir backend prisma:seed
```
6. Inicie o back-end:
```bash
pnpm --dir backend start:dev
```
7. Inicie o front-end:
```bash
pnpm --dir frontend dev
```

**Configuração do front-end**
1. Por padrão, o front consome `http://localhost:3333`.
2. Para alterar, defina `VITE_API_URL` no ambiente do front.

**Estrutura do projeto**
1. `backend/` API NestJS + Prisma
2. `frontend/` App React + Vite

**Seed**
1. O seed cria quizzes de geografia (países, continentes e capitais).

**Observações**
1. A autenticação é simples via username, com identificação pelo header `x-user-id` nas rotas protegidas.
