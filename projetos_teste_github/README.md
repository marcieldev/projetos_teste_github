# Central de Projetos em Teste

Ambiente para publicar projetos no GitHub e testá-los diretamente pelo navegador antes de movê-los para a pasta de projetos concluídos.

## Estrutura

```text
projetos_teste_github/
├── index.html                 # Central de testes
├── data/projetos.json         # Cadastro dos projetos
├── assets/css/style.css       # Visual da central
├── assets/js/app.js           # Busca, filtros e carregamento
└── projetos/                  # Projetos publicados para teste
    └── nexoverso_v47/
```

## Como adicionar um projeto

1. Coloque a pasta do projeto dentro de `projetos/`.
2. Garanta que ele tenha um `index.html` na raiz da pasta do projeto.
3. Abra `data/projetos.json`.
4. Adicione um novo objeto ao array `projetos`.
5. Em `caminho`, informe o caminho relativo, por exemplo `projetos/meu_projeto/`.
6. Faça o push para o GitHub.
7. Abra o GitHub Pages e clique em **Testar projeto**.

## Fluxo

```text
Projeto novo
   ↓
projetos_teste_github
   ↓
GitHub / GitHub Pages
   ↓
Central de Projetos em Teste
   ↓
Testar no navegador
   ├── precisa de correções → permanece em teste
   ├── continuar desenvolvendo → permanece em teste
   └── aprovado → pode ser movido para Projetos Concluídos
```

## Observação importante

A central usa `fetch()` para carregar `data/projetos.json`. Por isso, teste pelo GitHub Pages ou por um servidor HTTP local; não abra o `index.html` da central com `file://` esperando que o JSON carregue em todos os navegadores.
