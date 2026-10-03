/* FILTROS UI — cria e atualiza os controles visuais do catálogo. Não filtra dados. */
import {escapeHtml} from '../core/utils.js';

export function setupGenreFilter(container,genres,onChange,selected=[]){
  let values=[...selected];
  const selectedSet=()=>new Set(values);
  container.innerHTML=`<button type="button" class="filter-select" aria-expanded="false"><span class="filter-select-label">Gêneros</span><span class="filter-count"></span><span class="filter-chevron">⌄</span></button><div class="genre-menu" hidden><label class="genre-search"><input type="search" placeholder="Buscar gênero..."></label><div class="genre-options"></div><div class="genre-actions"><button type="button" class="genre-clear">Limpar</button><button type="button" class="genre-apply">Aplicar</button></div></div>`;
  const toggle=container.querySelector('.filter-select'),menu=container.querySelector('.genre-menu'),options=container.querySelector('.genre-options'),input=container.querySelector('.genre-search input'),count=container.querySelector('.filter-count');
  const draw=filter=>{
    const set=selectedSet();
    const list=genres.filter(g=>!filter||String(g).toLocaleLowerCase('pt-BR').includes(filter.toLocaleLowerCase('pt-BR')));
    options.innerHTML=list.map(g=>`<label class="genre-option"><input type="checkbox" value="${escapeHtml(g)}" ${set.has(g)?'checked':''}><span>${escapeHtml(g)}</span></label>`).join('')||'<span class="genre-empty">Nenhum gênero encontrado.</span>';
    count.textContent=values.length?String(values.length):'';
  };
  draw('');
  toggle.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));if(open) input.focus();});
  input.addEventListener('input',()=>draw(input.value));
  options.addEventListener('change',e=>{if(!e.target.matches('input[type="checkbox"]'))return;values=[...options.querySelectorAll('input:checked')].map(x=>x.value);count.textContent=values.length?String(values.length):'';});
  container.querySelector('.genre-clear').addEventListener('click',()=>{values=[];draw(input.value);onChange(values);});
  container.querySelector('.genre-apply').addEventListener('click',()=>{onChange(values);menu.hidden=true;toggle.setAttribute('aria-expanded','false');});
  document.addEventListener('click',e=>{if(!container.contains(e.target)){menu.hidden=true;toggle.setAttribute('aria-expanded','false');}});
  return {get selected(){return [...values]},setSelected(next){values=[...next];draw(input.value)}};
}

export function renderActiveFilters(container,filters,labels,onRemove,onClear){
  const chips=[];
  if(filters.category) chips.push(['category',labels.category||filters.category,filters.category]);
  if(filters.subcategory) chips.push(['subcategory',labels.subcategory||filters.subcategory,filters.subcategory]);
  if(filters.tema) chips.push(['tema',labels.tema||filters.tema,filters.tema]);
  if(filters.colecao) chips.push(['colecao',labels.colecao||filters.colecao,filters.colecao]);
  if(filters.saga) chips.push(['saga',labels.saga||'Somente sagas','1']);
  if(filters.game) chips.push(['game',labels.game||filters.game,filters.game]);
  if(filters.year) chips.push(['year',String(filters.year),filters.year]);
  for(const g of filters.genres||[]) chips.push(['genre',g,g]);
  if(!chips.length){container.innerHTML='';return;}
  container.innerHTML=chips.map(([kind,label,value])=>`<button type="button" class="active-filter" data-kind="${escapeHtml(kind)}" data-value="${escapeHtml(value)}">${escapeHtml(label)} <span>×</span></button>`).join('')+`<button type="button" class="clear-filters">Limpar filtros</button>`;
  container.querySelectorAll('.active-filter').forEach(btn=>btn.addEventListener('click',()=>onRemove(btn.dataset.kind,btn.dataset.value)));
  container.querySelector('.clear-filters').addEventListener('click',onClear);
}

export function renderPagination(container,state,onPage){
  if(state.totalPages<=1){container.innerHTML='';return;}
  const buttons=[];
  for(let p=1;p<=state.totalPages;p++){
    if(state.totalPages>7 && p>2 && p<state.totalPages-1 && Math.abs(p-state.page)>1){if(buttons.at(-1)!=='…')buttons.push('…');continue;}
    buttons.push(p);
  }
  container.innerHTML=`<button class="page-btn" data-page="${state.page-1}" ${state.page===1?'disabled':''}>‹</button>${buttons.map(p=>p==='…'?'<span class="page-gap">…</span>':`<button class="page-btn ${p===state.page?'active':''}" data-page="${p}">${p}</button>`).join('')}<button class="page-btn" data-page="${state.page+1}" ${state.page===state.totalPages?'disabled':''}>›</button>`;
  container.querySelectorAll('.page-btn:not(:disabled)').forEach(btn=>btn.addEventListener('click',()=>onPage(Number(btn.dataset.page))));
}
