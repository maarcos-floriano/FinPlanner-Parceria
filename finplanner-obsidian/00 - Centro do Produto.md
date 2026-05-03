# FinPlanner - Centro do Produto

## Visao
Produto low-ticket de planejamento financeiro pessoal, mobile-first, simples o bastante para o cliente registrar gastos sem friccao e util o bastante para continuar assinando.

## Posicionamento
- Publico: pessoas que querem controlar dinheiro sem planilhas complicadas.
- Promessa: registrar, entender e melhorar o dinheiro em poucos minutos por semana.
- Diferencial pago: automacao por WhatsApp via n8n.

## Planos
- Essencial: app completo, dashboard, lancamentos, relatorios e metas.
- WhatsApp: tudo do Essencial + registros e consultas pelo WhatsApp.

Nao criar varios planos. A unica diferenca comercial deve ser WhatsApp.

## Decisoes tecnicas
- Manter React/Vite no front por simplicidade e deploy barato na Vercel.
- Manter Express/Sequelize no backend para MVP e deploy em VPS Hostinger.
- SQLite pode servir para MVP na VPS, mas nao deve ser usado como banco persistente em serverless da Vercel.
- Admin protegido por role/env `ADMIN_EMAILS`.
- n8n integrara no endpoint autenticado por `N8N_WEBHOOK_SECRET`.

## Links internos
- [[01 - Backlog]]
- [[02 - Log de Implementacao]]
- [[03 - Deploy]]
