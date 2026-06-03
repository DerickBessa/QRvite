# TáNaLista — Backend

API REST para gerenciamento de eventos com QR Code check-in.

## Stack

- **Node.js** + **Express**
- **Prisma** ORM
- **PostgreSQL** (Neon ou Supabase — gratuito)
- **Deploy**: Vercel (serverless)

## Estrutura

```
tanalista-backend/
├── api/
│   ├── index.js          # Entry point (Express app)
│   └── routes/
│       ├── person.js     # CRUD Person + QR code + PDF
│       ├── family.js     # CRUD Family
│       └── party.js      # CRUD Party + check-ins
├── lib/
│   ├── prisma.js         # Singleton PrismaClient
│   └── qrcode.js         # Geração de QR code e PDF
├── prisma/
│   └── schema.prisma     # Modelos do banco
├── vercel.json           # Config Vercel
└── .env.example
```

## Setup Local

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env
# Edite .env com sua DATABASE_URL

# 3. Gerar o Prisma client e aplicar schema
npm run db:generate
npm run db:push        # push direto (sem migration files)

# 4. Rodar em desenvolvimento
npm run dev
```

API disponível em `http://localhost:3001`

---

## Deploy na Vercel

### 1. Banco de dados (Neon — recomendado)

1. Acesse [neon.tech](https://neon.tech) e crie um projeto gratuito
2. Copie a **connection string** (formato `postgresql://...?sslmode=require`)

### 2. Deploy

```bash
# Instalar Vercel CLI (se não tiver)
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Seguir as instruções e definir as variáveis de ambiente:
# DATABASE_URL = sua connection string do Neon
# FRONTEND_URL = URL do seu frontend (ex: https://tanalista.vercel.app)
```

### 3. Aplicar schema no banco de produção

```bash
# Após configurar DATABASE_URL no .env com a URL de produção:
npm run db:push
```

---

## Endpoints

### Person

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/persons` | Lista todas |
| GET | `/api/persons/:id` | Busca por ID |
| POST | `/api/persons` | Cria + gera QR code |
| PUT | `/api/persons/:id` | Atualiza |
| DELETE | `/api/persons/:id` | Deleta |
| POST | `/api/persons/:id/checkin` | Faz check-in pelo QR |
| GET | `/api/persons/:id/pdf` | Download PDF com QR |

### Family

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/families` | Lista todas |
| GET | `/api/families/:id` | Busca por ID |
| POST | `/api/families` | Cria |
| PUT | `/api/families/:id` | Atualiza |
| DELETE | `/api/families/:id` | Deleta |
| POST | `/api/families/:id/members` | Adiciona membro |
| DELETE | `/api/families/:id/members/:personId` | Remove membro |

### Party

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/parties` | Lista todas |
| GET | `/api/parties/:id` | Busca por ID |
| POST | `/api/parties` | Cria |
| PUT | `/api/parties/:id` | Atualiza |
| DELETE | `/api/parties/:id` | Deleta |
| POST | `/api/parties/:id/guests` | Adiciona convidados |
| DELETE | `/api/parties/:id/guests/:personId` | Remove convidado |
| GET | `/api/parties/:id/checkins` | Resumo de check-ins |

---

## Exemplos de Request

### Criar Person (gera QR automaticamente)
```json
POST /api/persons
{
  "nome": "Fulana de Tal",
  "familyId": "uuid-opcional"
}
```

### Fazer check-in
```json
POST /api/persons/uuid-da-person/checkin
```

### Criar Party
```json
POST /api/parties
{
  "titulo": "Festa de Natal 2025",
  "adminId": "uuid-do-admin",
  "startDate": "2025-12-25T20:00:00.000Z",
  "endDate": "2025-12-26T02:00:00.000Z",
  "guestIds": ["uuid1", "uuid2"]
}
```