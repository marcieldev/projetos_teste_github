# Taxonomia do NEXOVERSO

O catálogo separa quatro ideias principais:

- `id`: identidade interna e estável da obra/conteúdo.
- `categoria`: família principal e fixa do catálogo.
- `subcategoria`: classificação editorial/temática secundária, usada para refinar a categoria.
- `generos`: características, temas ou assuntos do conteúdo.

## Categorias

As categorias principais são somente:

- `filme` — Filmes
- `desenho` — Desenhos animados
- `serie` — Séries
- `documentario` — Documentários
- `programa_televisao` — Programas de televisão
- `jogos` — Jogos

Não crie novas categorias para cada formato de vídeo. Formatos e assuntos mais específicos pertencem à subcategoria ou ao gênero.

## Subcategorias

A subcategoria refina a categoria sem competir com ela. Exemplos:

- `episodio`
- `compilado`
- `especial`
- `gameplay`
- `busologia`
- `analise`
- `review`
- `tutorial`
- `trailer`
- `teaser`
- `clipe`
- `entrevista`
- `live`
- `curta`
- `cena`
- `short`

### Filtro contextual para Gameplay

Quando `subcategoria` for `gameplay`, o catálogo pode mostrar um segundo filtro contextual chamado **Jogo**. O conteúdo informa o jogo em um campo próprio:

```json
"categoria": "jogos",
"subcategoria": "gameplay",
"jogo": "Euro Truck Simulator 2"
```

A lista de jogos é montada a partir dos conteúdos cadastrados. Assim, o usuário pode escolher primeiro `Gameplay` e depois o jogo específico, sem transformar cada jogo em uma nova categoria ou gênero.

## Gêneros

Os gêneros continuam independentes e não mudam de função. Eles representam características, temas ou assuntos do conteúdo, por exemplo:

```json
"generos": ["Simulação", "Ônibus", "ETS2"]
```

Não repita categoria ou subcategoria dentro de `generos`. Evite, por exemplo:

```json
"categoria": "jogos",
"subcategoria": "gameplay",
"generos": ["Jogos", "Gameplay"]
```

## ID

Use um identificador legível, estável e único. Exemplos de formato:

```text
filme-nome-da-obra-2016
desenho-nome-da-obra
jogo-nome-do-jogo-gameplay
```

O ID não depende do YouTube ou de outro provedor. Se a fonte mudar, o ID continua o mesmo. Não reutilize um ID antigo para outra obra.

## Mídia

`midia` descreve onde o conteúdo está, sem decidir sua categoria:

```json
"midia": {
  "plataforma": "youtube",
  "tipo": "playlist",
  "destino": "externo",
  "link": "https://www.youtube.com/playlist?list=..."
}
```

## Fonte

Use `fontes` para listar canais/perfis responsáveis ou associados ao conteúdo. O nome vira link quando `link` estiver preenchido.
