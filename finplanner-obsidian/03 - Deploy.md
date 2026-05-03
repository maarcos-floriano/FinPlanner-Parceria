# Deploy

## Estrategia recomendada
- Frontend: Vercel apontando para `front`.
- Backend: VPS Hostinger com Node.js, PM2/Nginx e banco persistente.
- Banco MVP: SQLite na VPS com backup automatico.
- Banco recomendado quando tracionar: Postgres gerenciado ou Postgres na VPS.

## Variaveis do backend
- `PORT`
- `JWT_SECRET`
- `FRONTEND_URL`
- `DATABASE_URL` ou `SQLITE_STORAGE`
- `ADMIN_EMAILS`
- `GOOGLE_CLIENT_ID`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ESSENTIAL`
- `STRIPE_PRICE_WHATSAPP`
- `N8N_WEBHOOK_SECRET`

## Variaveis do frontend
- `VITE_API_BASE_URL`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_KIRVANO_ESSENTIAL_URL`
- `VITE_KIRVANO_WHATSAPP_URL`

## Observacao
Nao hospedar backend com SQLite persistente na Vercel. Em serverless o arquivo pode sumir ou divergir entre execucoes.

## URLs para pedir ao Marcos
- Frontend Vercel
- API publica: `https://finplanner-parceria.onrender.com`
- Google OAuth Client ID
- Link Kirvano Essencial
- Link Kirvano WhatsApp
- Webhook Kirvano apontando para `/api/webhooks/kirvano`
- URL n8n e segredo `N8N_WEBHOOK_SECRET`

## Supabase
- Project ref: `babxgehxnlixxuxuvzyx`
- Host: `db.babxgehxnlixxuxuvzyx.supabase.co`
- Port: `5432`
- Database: `postgres`
- User: `postgres`
- Nao salvar senha no Obsidian/repo. Usar apenas no painel do Render.

## Kirvano
- Essencial: `https://pay.kirvano.com/4a02d232-f4d5-4e65-b757-65df59990bc7`
- WhatsApp: `https://pay.kirvano.com/3bc35847-e2e3-4bf1-953c-f2cf26bbd353`
- Webhook: `https://finplanner-parceria.onrender.com/api/webhooks/kirvano`
