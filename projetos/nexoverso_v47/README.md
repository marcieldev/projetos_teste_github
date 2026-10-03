# NEXOVERSO — arquitetura modular + links externos

Esta versão mantém a linguagem visual da base original e separa a lógica em módulos com responsabilidades bem definidas.

## Fluxo
`JSON → core/data.js → página/componente → DOM → CSS`

## Mídia
Não há vídeos locais. Cada filme ou episódio usa `midia.link` no JSON. O NEXOVERSO somente abre o endereço externo cadastrado.

## Organização
- `assets/css/base/`: fundação visual
- `assets/css/components/`: componentes reutilizáveis
- `assets/css/pages/`: páginas
- `assets/css/responsivo/`: responsividade
- `assets/js/core/`: infraestrutura e regras puras
- `assets/js/components/`: componentes comportamentais
- `assets/js/pages/`: controladores das páginas
- `data/`: fonte dos dados

Consulte `docs/RESPONSABILIDADES.md` para o mapa completo.


## Links externos

`midia.link` aceita links externos comuns, vídeos do YouTube e playlists do YouTube. O sistema identifica o destino da mídia e usa `midia.referencia` para decidir se deve mostrar temporada/episódio.

## Cards

O card da Home possui um renderer próprio (`highlightCard`) para não misturar sua estrutura visual com o card usado nas listas. A lista de episódios mantém sua estrutura atual.


## Taxonomia
Consulte `docs/TAXONOMIA.md` e `data/taxonomia.json` para o padrão de `id`, `categoria`, `tipo_conteudo` e `midia`.


### Regra de taxonomia

`categoria` e `subcategoria` não devem ser repetidos dentro de `generos`. Os gêneros são usados para temas/características e o filtro de gêneros é derivado dos conteúdos realmente cadastrados.


## Estado inicial dos conteúdos

Os catálogos de conteúdo foram zerados nesta versão para começar o cadastro dos conteúdos reais do zero. Nenhum vídeo de teste ou link de mídia de teste permanece nos catálogos.


## Cadastro inicial de conteúdos reais

A versão atual inicia o catálogo real pela categoria `programa_televisao`, usando os conteúdos fornecidos para o primeiro teste.

- `conteudos` representa vários links que não são episódios de uma série.
- `midia.referencia: "nenhuma"` não mostra temporada nem episódio.
- `midia.referencia: "temporada"` mostra somente a temporada.
- `midia.referencia: "episodio"` mostra temporada e episódio.
- `organizacao.caminho` preserva a hierarquia dos filtros/pastas de origem sem alterar as seis categorias principais.

## Playlist de conteúdos
A página de título apresenta conteúdos externos em uma lista visual inspirada em playlists de vídeo: miniatura, número, título, tipo de mídia e botão Abrir. Quando houver vários conteúdos, a barra "Pesquisar vídeo por número ou nome" filtra localmente pelo número, título e metadados cadastrados. O pôster do título permanece como elemento visual principal.

Cada conteúdo pode usar `numero` para definir a numeração visual. `midia.referencia` continua separado e controla se aparece temporada/episódio: `nenhuma`, `temporada` ou `episodio`.


## v4.5 — organização e catálogo
- Programa de televisão separado em JSONs por tema.
- Novo filtro temático no catálogo.
- Ano normalizado no modelo e opção para itens sem ano informado.
- Comunidade reorganizada em blocos editoriais e informativos.
- Ícone de notificações corrigido para manter aparência de sino.


## Filmes — organização modular
Os filmes são separados por coleção quando isso ajuda a manutenção: `data/filmes/barbie/`, `data/filmes/velozes_furiosos/` e `data/filmes/avulsos/`. A coleção não substitui `generos`: ela organiza sagas/franquias sem duplicar o mesmo filme em vários gêneros.

Os registros desta versão estão preparados para receber links externos autorizados/licenciados.


### Filmes cadastrados
Esta versão cadastra os filmes reais informados para Barbie, Velozes & Furiosos e títulos avulsos. A organização usa `colecao` para separar sagas/franquias sem criar novas categorias principais. Os campos de mídia ficam prontos para receber destinos externos autorizados/licenciados.


## Estrutura de coleções
Sagas/franquias são um único item no catálogo e guardam os títulos em `conteudos`. Cada conteúdo possui `titulo`, `midia`, `exibir_thumbnail`, `numero`, `exibir_numero` e pode ter `imagem`, `ano`, `generos` e `sinopse` para a apresentação visual.
