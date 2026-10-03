/* TÍTULO — detalhes da obra e playlist de conteúdos/episódios. */
import {findById} from '../core/data.js';
import {escapeHtml,categoryLabel,subcategoryLabel,params,sortedEpisodes,mediaReferenceLabel} from '../core/utils.js';
import {mediaLink,externalInfo} from '../core/links.js';
import {initHeader} from '../components/header.js';
import {assetUrl,pageUrl} from '../core/paths.js';

initHeader();
const el=document.querySelector('#detail');
const id=params().get('id');

const initials = value => String(value||'Fonte').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase() || 'F';

function normalizeSources(item){
  const raw = item?.fontes ?? item?.fonte ?? [];
  const list = Array.isArray(raw) ? raw : [raw];
  const episodeSources = (item?.episodios||[]).flatMap(ep => {
    const value = ep?.fontes ?? ep?.fonte ?? [];
    return Array.isArray(value) ? value : [value];
  });
  const combined = [...list, ...episodeSources].map(source => {
    if(typeof source === 'string') return {nome:source,link:''};
    return source || {};
  }).filter(source => source.nome || source.provedor || source.link);
  const seen = new Set();
  return combined.filter(source => {
    const key = `${source.nome||source.provedor||''}|${source.link||''}`.toLowerCase();
    if(seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function sourceProfile(item){
  const sources=normalizeSources(item);
  if(!sources.length) return '';
  const primary=sources[0];
  const name=primary.nome||primary.provedor||'Fonte';
  const avatar=primary.imagem||primary.avatar||primary.logo||'';
  const avatarHtml=avatar
    ? `<img class="source-avatar" src="${escapeHtml(assetUrl(avatar))}" alt="">`
    : `<span class="source-avatar source-avatar-initials">${escapeHtml(initials(name))}</span>`;
  const links=sources.map(source=>{
    const label=source.nome||source.provedor||'Fonte';
    return source.link
      ? `<a class="source-channel" href="${escapeHtml(source.link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`
      : `<span class="source-channel source-channel-disabled">${escapeHtml(label)}</span>`;
  }).join('<span class="source-separator">, </span>');
  return `<div class="source-profile">${avatarHtml}<div class="source-profile-info"><span class="source-kicker">FONTE / PERFIS</span><div class="source-channel-list">${links}</div><span>${escapeHtml(primary.creditos||'Fonte e créditos do conteúdo')}</span></div></div>`;
}

function episodeButton(link,declaredType='',intermediateHref=''){
  const info=externalInfo(link,declaredType);
  if(!info.href) return '<span class="btn disabled" aria-disabled="true">Link não cadastrado</span>';
  if(intermediateHref) return `<a class="btn primary" href="${escapeHtml(intermediateHref)}">▶ Ver conteúdo</a>`;
  return `<a class="btn primary" href="${escapeHtml(info.href)}" target="_blank" rel="noopener noreferrer">▶ Abrir</a>`;
}

function youtubeThumb(info, title){
  if(!info?.thumbnail) return `<div class="episode-thumb episode-thumb-placeholder"><span>▶</span></div>`;
  return `<div class="episode-thumb"><img src="${escapeHtml(info.thumbnail)}" alt="Miniatura de ${escapeHtml(title)}" loading="lazy"><span class="thumb-play">▶</span></div>`;
}

function mediaItem(ep,item,index,isContents=false){
  const link=mediaLink(ep.midia);
  const info=link?externalInfo(link,ep.midia?.tipo):null;
  const configuredLabel=mediaReferenceLabel(ep.midia,ep);
  const identification=ep.identificacao===null ? '' : (ep.identificacao!==undefined ? String(ep.identificacao) : (item.categoria==='filme' ? `Filme ${String(ep.numero??index+1).padStart(2,'0')}` : configuredLabel));
  const title=ep.titulo||configuredLabel||`Conteúdo ${String(ep.numero??index+1).padStart(2,'0')}`;
  const showThumb=ep.exibir_thumbnail!==false;
  const contentImage=ep.imagem ? `<div class="episode-thumb"><img src="${escapeHtml(assetUrl(ep.imagem))}" alt="Pôster de ${escapeHtml(title)}" loading="lazy"><span class="thumb-play">▶</span></div>` : '';
  const thumb=showThumb && (info?.tipo==='playlist'||info?.tipo==='video') ? youtubeThumb(info,title) : (showThumb ? (contentImage || '<div class="episode-thumb episode-thumb-placeholder"><span>▶</span></div>') : '');
  const number=ep.exibir_numero!==false ? `<span class="playlist-number">${String(ep.numero??index+1).padStart(2,'0')}</span>` : '';
  /* A tela intermediária faz parte do fluxo de filmes. Para filme, nunca mostramos temporada/episódio. */
  const needsIntermediate = item.categoria==='filme' ? Boolean(link) : ['temporada','episodio'].includes(String(ep.midia?.referencia||'').toLowerCase());
  const intermediateHref=needsIntermediate
    ? pageUrl(`paginas/episodio/?id=${encodeURIComponent(item.id)}${isContents?`&content=${index}`:`&season=${ep.temporada||1}&episode=${ep.numero||index+1}`}`)
    : '';
  const searchable=[title,ep.numero,configuredLabel,ep.ano,ep.sinopse,...(ep.generos||[]),info?.descricao].filter(Boolean).join(' ').toLowerCase();
  const clickThumb=needsIntermediate && info?.thumbnail
    ? `<a class="episode-thumb episode-thumb-link" href="${escapeHtml(intermediateHref)}"><img src="${escapeHtml(info.thumbnail)}" alt="Miniatura de ${escapeHtml(title)}" loading="lazy"><span class="thumb-play">▶</span></a>`
    : thumb;
  return `<article class="episode-card playlist-item${needsIntermediate?' requires-intermediate':''}" data-playlist-search="${escapeHtml(searchable)}">${clickThumb}<div class="episode-card-body">${number}<div class="episode-card-copy">${identification?`<span class="episode-identification">${escapeHtml(identification)}</span>`:''}<span class="episode-kind">${escapeHtml(info?.descricao||'Mídia externa')}</span><h3>${escapeHtml(title)}</h3>${ep.ano||ep.generos?.length?`<p class="playlist-meta">${ep.ano?escapeHtml(ep.ano):''}${ep.ano&&ep.generos?.length?' · ':''}${(ep.generos||[]).slice(0,3).map(g=>escapeHtml(g)).join(' · ')}</p>`:''}${ep.sinopse?`<p>${escapeHtml(ep.sinopse)}</p>`:''}</div>${episodeButton(link,ep.midia?.tipo,intermediateHref)}</div></article>`;
}

function searchBox(total){
  return `<div class="playlist-tools"><label class="playlist-search"><span>⌕</span><input id="playlistSearch" type="search" placeholder="Pesquisar vídeo por número ou nome..." autocomplete="off"><button id="clearPlaylistSearch" type="button" aria-label="Limpar pesquisa">×</button></label><span id="playlistCount" class="playlist-count">${total} ${total===1?'conteúdo':'conteúdos'}</span></div>`;
}

(async()=>{
  try{
    if(!id) throw new Error('Nenhum conteúdo foi informado.');
    const item=await findById(id);
    document.title=`${item.titulo} — NEXOVERSO`;
    const episodes=sortedEpisodes(item);
    const contents=Array.isArray(item.conteudos)?item.conteudos:[];
    const entries=contents.length?contents:episodes;
    const isContents=contents.length>0;
    const media=mediaLink(item.midia);
    const mediaInfo=media?externalInfo(media,item.midia?.tipo):null;
    const hasStructuredContents=entries.length>0;
    const isStandaloneFilm=item.categoria==='filme' && !hasStructuredContents && !episodes.length;
    const filmList=hasStructuredContents
      ? entries.map((ep,i)=>mediaItem(ep,item,i,isContents)).join('')
      : isStandaloneFilm
        ? `<div class="single-media-action"><div><p class="eyebrow">FILME</p><h3>${escapeHtml(item.titulo)}</h3><p>Este filme é um conteúdo individual. Abra a tela de conteúdo para ver as informações completas e acessar a mídia externa.</p></div>${media?episodeButton(media,item.midia?.tipo,pageUrl(`paginas/episodio/?id=${encodeURIComponent(item.id)}`)):'<span class="btn disabled" aria-disabled="true">Link não cadastrado</span>'}</div>`
        : '<div class="empty">Nenhum conteúdo cadastrado.</div>';
    const showSearch=hasStructuredContents;

    el.innerHTML=`<section class="detail"><div><img class="poster" src="${escapeHtml(assetUrl(item.imagem||'assets/img/poster-aster.svg'))}" alt="Pôster de ${escapeHtml(item.titulo)}"></div><div><span class="card-type ${escapeHtml(item.categoria)}">${categoryLabel(item.categoria)}</span><h1>${escapeHtml(item.titulo)}</h1>${item.subcategoria?`<div class="detail-content-type">${escapeHtml(subcategoryLabel(item.subcategoria))}</div>`:``}<div class="meta"><span>${escapeHtml(item.ano||'')}</span>${item.colecao?`<span>· ${escapeHtml(item.colecao)}</span>`:''}<span>· ${escapeHtml(item.classificacao||'Livre')}</span>${(item.generos||[]).length?`<span>· ${(item.generos||[]).map(g=>`<span class="genre-pill">${escapeHtml(g)}</span>`).join(' ')}</span>`:''}</div><p class="detail-copy">${escapeHtml(item.sinopse||'')}</p>${sourceProfile(item)}</div></section><section class="episodes"><div class="section-head"><div><p class="eyebrow">${hasStructuredContents?'PLAYLIST':'CONTEÚDO'}</p><h2>${item.categoria==='filme' ? (hasStructuredContents ? 'Filmes' : 'Filme') : (isContents?'Conteúdos':'Episódios')}</h2><p class="section-copy">${item.categoria==='filme' && hasStructuredContents ? 'Os filmes da coleção seguem a mesma organização de uma playlist. Cada item pode apontar para uma mídia externa.' : item.categoria==='filme' ? 'Este filme é individual e possui sua própria tela de conteúdo.' : (isContents?'Os conteúdos podem apontar para vídeos, playlists do YouTube ou outros sites. O NEXOVERSO apenas redireciona para a mídia externa.':'Os episódios podem apontar para vídeos, playlists do YouTube ou outros sites. O NEXOVERSO apenas redireciona para a mídia externa.')}</p></div></div>${showSearch?searchBox(entries.length):''}<div class="episodes-list" id="playlistList">${filmList}</div></section>`;

    if(showSearch){
      const input=document.querySelector('#playlistSearch');
      const clear=document.querySelector('#clearPlaylistSearch');
      const count=document.querySelector('#playlistCount');
      const items=[...document.querySelectorAll('.playlist-item')];
      const update=()=>{
        const q=input.value.trim().toLowerCase();
        let visible=0;
        items.forEach(card=>{const ok=!q||card.dataset.playlistSearch.includes(q);card.hidden=!ok;if(ok)visible++;});
        count.textContent=`${visible} ${visible===1?'conteúdo':'conteúdos'}`;
        clear.hidden=!q;
      };
      input.addEventListener('input',update);
      clear.addEventListener('click',()=>{input.value='';input.focus();update();});
    }
  }catch(e){
    el.innerHTML=`<div class="error">${escapeHtml(e.message)}</div>`;
  }
})();
