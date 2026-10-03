/* CARDS — renderiza itens e coleções; não controla estado da página. */
import {escapeHtml,categoryLabel,subcategoryLabel} from '../core/utils.js';
import {pageUrl,assetUrl} from '../core/paths.js';

const poster=item=>assetUrl(item.imagem||'assets/img/poster-aster.svg');
const titleUrl=item=>pageUrl(`paginas/titulo/?id=${encodeURIComponent(item.id)}`);

function meta(item){
  return `<div class="meta"><span>${escapeHtml(item.ano||'')}</span>${item.colecao?`<span>· ${escapeHtml(item.colecao)}</span>`:''}${(item.generos||[]).slice(0,2).map(g=>`<span>· ${escapeHtml(g)}</span>`).join('')}</div>`;
}

export function card(item){
  return `<article class="card">
    <a href="${titleUrl(item)}">
      <img class="poster" src="${poster(item)}" alt="Pôster de ${escapeHtml(item.titulo)}" loading="lazy">
      <div class="card-body">
        <span class="card-type ${escapeHtml(item.categoria)}">${categoryLabel(item.categoria)}</span>
        <h3>${escapeHtml(item.titulo)}</h3>
        ${item.subcategoria?`<span class="card-content-type">${subcategoryLabel(item.subcategoria)}</span>`:''}
        <p>${escapeHtml(item.sinopse||'')}</p>
        ${meta(item)}
      </div>
    </a>
  </article>`;
}

function contentPoster(content){
  return content?.imagem
    ? `<img src="${escapeHtml(assetUrl(content.imagem))}" alt="Pôster de ${escapeHtml(content.titulo||'Conteúdo')}" loading="lazy">`
    : `<div class="collection-entry-placeholder">▶</div>`;
}

/* Uma saga/coleção aparece no catálogo como UM card comum.
   Ao clicar, a página de título abre a playlist completa da coleção. */
export function collectionCard(item){
  const contents=Array.isArray(item.conteudos)?item.conteudos:[];
  const collection=item.colecao||item.titulo;
  return `<article class="card collection-card">
    <a href="${titleUrl(item)}" aria-label="Abrir coleção ${escapeHtml(collection)}">
      <div class="collection-poster-wrap">
        <img class="poster" src="${poster(item)}" alt="Pôster da coleção ${escapeHtml(collection)}" loading="lazy">
        <span class="collection-badge">COLEÇÃO</span>
      </div>
      <div class="card-body">
        <span class="card-type filme">FILMES</span>
        <h3>${escapeHtml(collection)}</h3>
        <p>${contents.length} ${contents.length===1?'conteúdo':'conteúdos'} nesta coleção</p>
        <div class="meta"><span>▶ Lista completa</span>${(item.generos||[]).slice(0,2).map(g=>`<span>· ${escapeHtml(g)}</span>`).join('')}</div>
      </div>
    </a>
  </article>`;
}

export function renderCards(container,items){
  if(!items.length){container.innerHTML='<div class="empty">Nenhuma obra encontrada.</div>';return;}
  container.innerHTML=items.map(item=>
    Array.isArray(item.conteudos) && item.conteudos.length>1 && item.colecao
      ? collectionCard(item)
      : card(item)
  ).join('');
}

export function highlightCard(item){
  return `<article class="highlight-card">
    <a class="highlight-link" href="${titleUrl(item)}" aria-label="Abrir ${escapeHtml(item.titulo)}">
      <div class="highlight-poster"><img src="${poster(item)}" alt="Pôster de ${escapeHtml(item.titulo)}" loading="lazy"></div>
      <div class="highlight-body"><span class="card-type ${escapeHtml(item.categoria)}">${categoryLabel(item.categoria)}</span><h3>${escapeHtml(item.titulo)}</h3>${item.subcategoria?`<span class="card-content-type">${subcategoryLabel(item.subcategoria)}</span>`:''}<p>${escapeHtml(item.sinopse||'')}</p>${meta(item)}</div>
    </a>
  </article>`;
}
