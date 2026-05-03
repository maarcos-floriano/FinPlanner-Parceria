# FinPlanner - Deploy barato

## Melhor caminho agora

1. Frontend: Vercel no plano gratis.
2. Backend: Render/Railway free para teste rapido, ou VPS Hostinger quando for vender de verdade.
3. Banco: SQLite apenas na VPS com backup. Para backend serverless/free, use Postgres gratis/baixo custo.
4. Automacao: n8n Cloud trial para validar ou n8n self-host na VPS quando migrar.

## Vercel frontend

- Root Directory: `front`
- Build Command: `npm run build`
- Output Directory: `dist`
- Variaveis:
  - `VITE_API_BASE_URL=https://sua-api.com/api`
  - `VITE_GOOGLE_CLIENT_ID=...apps.googleusercontent.com`
  - `VITE_KIRVANO_ESSENTIAL_URL=https://pay.kirvano.com/...`
  - `VITE_KIRVANO_WHATSAPP_URL=https://pay.kirvano.com/...`

## Backend gratis para validar

Opcoes:

- Render Web Service free ou similar: bom para MVP, pode dormir em inatividade.
- Supabase Postgres free: banco separado para nao depender de arquivo SQLite.

Config:

- Root Directory: `back`
- Start Command: `npm start`
- Variaveis do `back/.env.example`
- `DATABASE_URL` apontando para Postgres.
- `FRONTEND_URL` com a URL da Vercel.
- `ADMIN_EMAILS` com seu email de login.

## VPS Hostinger

1. Instalar Node.js 20, Nginx e PM2.
2. Subir repo em `/var/www/finplanner`.
3. Rodar `npm ci` dentro de `back`.
4. Criar `back/.env` com as variaveis reais.
5. Rodar `pm2 start server.js --name finplanner-api`.
6. Criar proxy Nginx de `api.seudominio.com` para `http://127.0.0.1:5000`.
7. Ativar SSL com Certbot.

## URLs que voce precisa me passar depois

- URL final do frontend na Vercel.
- URL final da API.
- Google OAuth Client ID.
- Link Kirvano do plano Essencial.
- Link Kirvano do plano WhatsApp.
- URL/webhook configurado na Kirvano para `https://sua-api.com/api/webhooks/kirvano`.
- URL do n8n e segredo que voce quer usar em `N8N_WEBHOOK_SECRET`.

## Endpoints n8n

Headers:

```text
x-n8n-secret: seu-segredo
```

Registrar transacao:

```http
POST /api/webhooks/n8n/transaction
```

Body:

```json
{
  "email": "cliente@email.com",
  "phone": "5511999999999",
  "type": "expense",
  "amount": 25.9,
  "category": "Alimentacao",
  "description": "Almoco",
  "date": "2026-05-03"
}
```

Resumo:

```http
POST /api/webhooks/n8n/summary
```

Body:

```json
{
  "phone": "5511999999999"
}
```
