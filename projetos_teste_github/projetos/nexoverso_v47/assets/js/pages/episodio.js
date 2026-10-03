/* EPISÓDIO — tela intermediária para filmes, episódios e conteúdos externos. */
import {findById} from '../core/data.js';
import {escapeHtml,params,sortedEpisodes,mediaReferenceLabel,mediaReferenceType,categoryLabel,subcategoryLabel} from '../core/utils.js';
import {mediaLink,externalInfo} from '../core/links.js';
import {initHeader} from '../components/header.js';
import {pageUrl,assetUrl} from '../core/paths.js';

initHeader();
const root=document.querySelector('#episode-page');
const p=params();
const id=p.get('id');

const categoryName=categoryLabel;
const subcategoryName=subcategoryLabel;

function contentInfo(item,current){
  return {
    titulo: current?.titulo || item.titulo || 'Conteúdo',
    ano: current?.ano ?? item.ano ?? null,
    generos: Array.isArray(current?.generos) && current.generos.length ? current.generos : (item.generos||[]),
    sinopse: current?.sinopse || item.sinopse || '',
    classificacao: current?.classificacao ?? item.classificacao ?? '',
    subcategoria: current?.subcategoria ?? item.subcategoria ?? '',
    colecao: item.colecao || current?.colecao || '',
    categoria: item.categoria || current?.categoria || ''
  };
}

function briefInfo(item,current){
  const info=contentInfo(item,current);
  const genres=(info.generos||[]).map(g=>`<span class="intermediate-tag">${escapeHtml(g)}</span>`).join('');
  const meta=[
    categoryName(info.categoria),
    info.subcategoria ? subcategoryName(info.subcategoria) : '',
    info.ano,
    info.classificacao,
    info.colecao
  ].filter(v=>v!==undefined&&v!==null&&String(v)!=='').map(v=>`<span>${escapeHtml(v)}</span>`).join('');
  return `<aside class="intermediate-info">
    <p class="eyebrow">SOBRE O CONTEÚDO</p>
    <h2>${escapeHtml(info.titulo)}</h2>
    <div class="intermediate-meta">${meta}</div>
    ${genres?`<div class="intermediate-genres">${genres}</div>`:''}
    ${info.sinopse?`<p class="intermediate-synopsis">${escapeHtml(info.sinopse)}</p>`:''}
  </aside>`;
}

function filmIdentification(current,index){
  return `Filme ${String(current?.numero ?? index+1).padStart(2,'0')}`;
}

(async()=>{
  try{
    if(!id) throw new Error('Nenhum conteúdo foi informado.');
    const item=await findById(id);
    const episodes=sortedEpisodes(item);
    const contents=Array.isArray(item.conteudos)?item.conteudos:[];
    const isContents=contents.length>0;
    const entries=isContents?contents:episodes;
    const isFilm=item.categoria==='filme';
    let currentIndex=-1;
    let current;

    if(isContents){
      currentIndex=Math.max(0,Math.min(entries.length-1,Number(p.get('content')||0)));
      current=entries[currentIndex];
    }else if(episodes.length){
      currentIndex=entries.findIndex(ep=>String(ep.numero)===String(p.get('episode')||1)&&String(ep.temporada||1)===String(p.get('season')||1));
      if(currentIndex<0) currentIndex=0;
      current=entries[currentIndex];
    }else if(isFilm && item.midia){
      currentIndex=0;
      current=item;
    }

    if(!current) throw new Error('Nenhum conteúdo foi cadastrado para esta obra.');
    const media=current.midia || item.midia;
    const external=externalInfo(mediaLink(media),media?.tipo);
    if(!external.href) throw new Error('Nenhum link externo foi cadastrado para este conteúdo.');

    /* Para filmes, temporada/episódio nunca aparece: o identificador é FILME 01, FILME 02... */
    const referenceType=isFilm ? 'nenhuma' : mediaReferenceType(media);
    const referenceLabel=isFilm ? filmIdentification(current,currentIndex) : mediaReferenceLabel(media,current);
    const info=contentInfo(item,current);
    const title=info.titulo;

    /* A imagem pertence ao conteúdo atual. Só usa a imagem da obra como último fallback. */
    const thumbnail=current?.imagem ? assetUrl(current.imagem) : (external.thumbnail || assetUrl(item.imagem||'assets/img/poster-aster.svg'));

    let navigation='';
    if(entries.length>1){
      const prev=entries[currentIndex-1], next=entries[currentIndex+1];
      const hrefFor=(entry,index)=>isContents
        ? pageUrl(`paginas/episodio/?id=${encodeURIComponent(id)}&content=${index}`)
        : pageUrl(`paginas/episodio/?id=${encodeURIComponent(id)}&season=${entry.temporada||1}&episode=${entry.numero||index+1}`);
      navigation=`<div class="episode-navigation">${prev?`<a class="btn" href="${escapeHtml(hrefFor(prev,currentIndex-1))}">← Anterior</a>`:'<span class="btn disabled">← Anterior</span>'}<a class="btn" href="${escapeHtml(pageUrl(`paginas/titulo/?id=${encodeURIComponent(id)}`))}">☰ Playlist</a>${next?`<a class="btn" href="${escapeHtml(hrefFor(next,currentIndex+1))}">Próximo →</a>`:'<span class="btn disabled">Próximo →</span>'}</div>`;
    }else{
      navigation=`<div class="episode-navigation"><a class="btn" href="${escapeHtml(pageUrl(`paginas/titulo/?id=${encodeURIComponent(id)}`))}">← Voltar para a obra</a></div>`;
    }

    let pageLabel;
    if(isFilm) pageLabel='FILME';
    else pageLabel=referenceType==='episodio'?'EPISÓDIO':referenceType==='temporada'?'TEMPORADA':'CONTEÚDO';

    root.innerHTML=`<section class="episode-shell">
      <div class="episode-page-heading">
        <p class="eyebrow">${pageLabel}</p>
        ${referenceLabel?`<div class="episode-page-identification">${escapeHtml(referenceLabel)}</div>`:''}
        <h1>${escapeHtml(title)}</h1>
      </div>
      <div class="intermediate-layout">
        <div class="intermediate-main">
          <a class="external-poster-link" href="${escapeHtml(external.href)}" target="_blank" rel="noopener noreferrer" aria-label="Abrir ${escapeHtml(title)} no site externo">
            <img src="${escapeHtml(thumbnail)}" alt="Capa de ${escapeHtml(title)}">
            <span class="external-poster-overlay"><strong>▶</strong><b>CLIQUE NA IMAGEM</b><small>para acessar o conteúdo externo</small></span>
          </a>
          <div class="external-poster-note">O NEXOVERSO não reproduz esta mídia aqui. Clique na imagem para abrir o conteúdo no endereço externo cadastrado.</div>
        </div>
        ${briefInfo(item,current)}
      </div>
      ${navigation}
    </section>`;
  }catch(e){
    root.innerHTML=`<div class="error"><h1>Não foi possível abrir este conteúdo</h1><p>${escapeHtml(e.message)}</p><a class="btn primary" href="${escapeHtml(pageUrl(`paginas/titulo/?id=${encodeURIComponent(id||'')}`))}">← Voltar para a obra</a></div>`;
  }
})();
