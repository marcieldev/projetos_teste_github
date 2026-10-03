# Auditoria lógica — versão JSON + JavaScript

A dependência de API/Python foi removida do frontend.

Fluxo esperado:

```text
arquivos JSON
    ↓
NEXO (carregador)
    ↓
páginas JavaScript
    ↓
DOM / HTML
```

## Regras

- O catálogo é lido diretamente dos `catalogo.json`.
- Destaques são IDs definidos em `data/destaques.json`.
- Configurações são lidas de `data/configuracao.json`.
- Alertas são lidos de `data/alertas.json`.
- A URL da mídia vem do próprio item/episódio no JSON.
- Comunidade de teste usa `localStorage`; não é uma comunidade online real.
- Python/SQLite não são necessários para o site.
