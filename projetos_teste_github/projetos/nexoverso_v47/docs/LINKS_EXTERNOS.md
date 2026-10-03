# Links externos

O NEXOVERSO não hospeda os vídeos. Cada conteúdo cadastra sua mídia em `midia.link`. O campo pode ficar vazio durante o cadastro e ser preenchido quando o link real estiver definido.

## Tipo da mídia x referência editorial

São duas coisas diferentes:

- `midia.tipo`: como a mídia é acessada (`video`, `playlist`, `pagina` etc.).
- `midia.referencia`: como a identificação deve aparecer na interface (`nenhuma`, `temporada` ou `episodio`).

### Conteúdo sem temporada/episódio
Use `nenhuma`. É o padrão para filmes, jogos, documentários ou qualquer conteúdo que não deva ser apresentado como série.

```json
"midia": {
  "plataforma": "youtube",
  "tipo": "video",
  "destino": "externo",
  "link": "",
  "referencia": "nenhuma"
}
```

### Link de uma temporada
Use `temporada`. A interface mostra somente `Temporada X`.

```json
"midia": {
  "plataforma": "youtube",
  "tipo": "playlist",
  "destino": "externo",
  "link": "",
  "referencia": "temporada",
  "temporada": 1
}
```

### Link de um episódio
Dentro de `episodios`, use `episodio`. A interface mostra `Temporada X · Episódio Y`.

```json
{
  "numero": 1,
  "temporada": 1,
  "titulo": "Nome do episódio",
  "midia": {
    "plataforma": "youtube",
    "tipo": "video",
    "destino": "externo",
    "link": "",
    "referencia": "episodio"
  }
}
```

### Regra importante
O link não decide se o conteúdo é temporada ou episódio. Essa decisão fica explícita no JSON. Assim, uma URL do YouTube que contenha `list=` ainda pode ser cadastrada como `video` com `referencia: "episodio"` quando o destino real for um vídeo individual.

## Vários conteúdos sem serem episódios

Quando uma obra possui vários vídeos, mas eles não são uma série com temporadas/episódios, use `conteudos`. Cada item de `conteudos` também possui `midia.referencia: "nenhuma"`. A interface chama essa seção de **Conteúdos**, sem mostrar temporada ou episódio.

```json
"conteudos": [
  {
    "titulo": "Nome do vídeo",
    "midia": {
      "plataforma": "youtube",
      "tipo": "video",
      "destino": "externo",
      "link": "",
      "referencia": "nenhuma"
    }
  }
]
```

## Fontes e perfis

Uma obra pode ter várias fontes/canais. Use `fontes`:

```json
"fontes": [
  { "nome": "Nome do canal", "link": "" },
  { "nome": "Outro canal", "link": "" }
]
```

Se `link` estiver vazio, o nome aparece sem ser clicável. Não invente URLs de canais/perfis.
