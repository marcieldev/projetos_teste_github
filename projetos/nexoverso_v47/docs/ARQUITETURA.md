# Arquitetura do NEXOVERSO

O NEXOVERSO usa uma arquitetura estática e simples:

```text
JSON → JavaScript → HTML + CSS → Navegador
                         ↓
                link externo da mídia
```

## Conteúdo

Os catálogos ficam em `data/**/catalogo.json`.

Cada conteúdo possui `categoria` e `subcategoria`. Quando necessário, campos contextuais como `jogo` refinam a subcategoria. A mídia é uma camada separada.

Exemplo:

```json
"midia": {
  "plataforma": "externo",
  "tipo": "pagina",
  "destino": "externo",
  "link": "",
  "referencia": "nenhuma"
}
```

Cada episódio pode ter a mesma estrutura dentro de `episodios[].midia`.

O campo `link` pode apontar para uma página de vídeo, arquivo de mídia, playlist ou outro destino autorizado. O NEXOVERSO não hospeda nem processa o vídeo: ele apenas abre o endereço cadastrado.

## Playlist

A página da obra funciona como uma playlist. Cada episódio possui seu próprio botão e seu próprio link no JSON. Para conteúdos seriados, basta cadastrar os episódios em `episodios` na ordem desejada. Conteúdos que não são séries não precisam usar temporada/episódio.

## GitHub Pages

Como as mídias não ficam dentro do repositório, arquivos grandes como MP4 não bloqueiam o `git push`. O repositório contém somente código, dados, imagens leves e documentação.

Para conteúdo real, use somente links para mídias que você tenha autorização para distribuir ou incorporar.

## Filtros do catálogo
- `core/filtros.js` contém somente regras puras de busca, filtros, ordenação e paginação.
- `components/filtros.js` cria a interface dos filtros e paginação, sem conhecer a fonte dos dados.
- `pages/catalogo.js` coordena estado, eventos e atualização do DOM.
- Gêneros aceitam seleção múltipla; os filtros são combináveis e podem ser removidos individualmente.

## Controle de identificação da mídia
A identificação de temporada/episódio agora é definida pela própria mídia:
- `midia.referencia: "nenhuma"` não mostra temporada nem episódio.
- `midia.referencia: "temporada"` mostra somente `Temporada X`.
- `midia.referencia: "episodio"` mostra `Temporada X · Episódio Y`.

O antigo campo `identificacao` continua aceito para compatibilidade com cadastros antigos, mas os novos conteúdos devem usar `midia.referencia`.
- `exibir_thumbnail: false` continua ocultando a área de thumbnail.

## Taxonomia
- `data/taxonomia.json` concentra categorias, subcategorias, filtros contextuais e gêneros sugeridos.
- `core/filtros.js` filtra `categoria`, `subcategoria` e filtros contextuais como `jogo` separadamente.
- O link da mídia não é usado para adivinhar o tipo editorial.
