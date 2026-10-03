# Responsabilidades dos arquivos

## CSS
- `base/reset.css`: normalização global.
- `base/variaveis.css`: identidade visual e tokens.
- `base/base.css`: corpo, tipografia e regras globais.
- `components/header.css`: estrutura visual do cabeçalho.
- `components/menu_navegacao.css`: links e estados da navegação.
- `components/botoes.css`: aparência dos botões.
- `components/cards.css`: cards e seus estados.
- `components/footer.css`: rodapé.
- `components/modais.css`: modal e painel de notificações.
- `pages/*.css`: composição exclusiva de cada página.
- `responsivo/responsivo.css`: somente breakpoints e adaptações.

## JavaScript
- `core/config.js`: caminhos dos arquivos de dados.
- `core/data.js`: leitura, cache e localização dos dados.
- `core/utils.js`: funções puras de tratamento.
- `core/links.js`: regras de links externos.
- `components/header.js`: comportamento do cabeçalho.
- `components/cards.js`: criação de cards.
- `components/modal.js`: modal da Home.
- `pages/home.js`: carrossel e destaques.
- `pages/catalogo.js`: pesquisa e filtros.
- `pages/titulo.js`: detalhes e playlist.
- `pages/episodio.js`: seleção do episódio e anterior/próximo.
- `pages/comunidade.js`: comportamento da comunidade.

### Regra de ouro
Nenhum módulo deve buscar dados ou controlar visual que pertence a outro módulo. O JSON contém dados; o core fornece dados; os componentes apresentam partes reutilizáveis; cada página coordena somente sua própria lógica.


### Links externos e YouTube
- `core/links.js`: identifica vídeo, playlist e links externos; também extrai miniatura quando o URL do YouTube contém um ID de vídeo.
- `pages/titulo.js`: decide como apresentar cada episódio e usa o componente visual de playlist.
- `pages/episodio.js`: continua sendo responsável somente pela página do episódio/redirecionamento.
- `css/pages/titulo.css`: aparência dos cards de episódios e do perfil da fonte.

Um link do YouTube com `?list=` é tratado como **playlist**, mesmo quando o URL também contém `?v=`. Nesse caso, se houver ID de vídeo no próprio URL, ele é usado como miniatura.
