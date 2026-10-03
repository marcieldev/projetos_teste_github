# Dados e organização

## Categorias principais
O NEXOVERSO mantém seis categorias de mídia: filmes, séries, desenhos animados, documentários, programas de televisão e jogos.

## Temas
Para conteúdos que precisam de uma classificação temática mais específica, existe `tema`. Ex.: `motorhome`, `automoveis`, `motocicletas`, `mecanica`. Isso não substitui `generos`.

## Arquivos JSON
Os catálogos são carregados por uma lista em `assets/js/core/config.js`. Um mesmo tipo pode ter vários `catalogo.json`, separados por tema/pasta. Isso evita um arquivo gigante.

## Ano
O campo `ano` é do conteúdo. O sistema mostra anos existentes no filtro e também permite localizar itens sem ano informado. Não são inventados anos para conteúdos cujo ano ainda não foi fornecido.


### Coleções de filmes
`colecao` identifica uma saga/franquia sem transformar a franquia em categoria principal. Os arquivos podem ser separados por coleção para facilitar manutenção.
