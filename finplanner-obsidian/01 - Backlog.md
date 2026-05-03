# Backlog

## Agora
- Validar build e corrigir incompatibilidades finais.
- Testar API local com SQLite e `DB_SYNC_ALTER=true`.
- Configurar credenciais reais: Google, Kirvano, n8n e URL da API.
- Melhorar dashboard mobile-first com menos mock e mais dados reais.
- Criar fluxo n8n completo: interpretar mensagem, registrar, consultar e responder.

## Proximas iteracoes
- Stripe com dois Price IDs reais.
- Area de metas recorrentes e orcamentos por categoria.
- Exportacao CSV/PDF.
- Politicas LGPD, termos e privacidade.

## Riscos
- Vercel nao e ideal para backend com SQLite persistente.
- WhatsApp tem custo operacional e precisa limite de uso para manter margem.
- Login Google exige configurar OAuth/Client ID antes de funcionar em producao.
