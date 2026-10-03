/* CATÁLOGO — estado previsível, URL compartilhável e filtros dependentes. */
import {catalogo,taxonomia} from '../core/data.js';
import {escapeHtml,categoryLabel,subcategoryLabel} from '../core/utils.js';
import {filterItems,paginate,uniqueValues} from '../core/filtros.js';
import {initHeader} from '../components/header.js';
import {renderCards} from '../components/cards.js';
import {setupGenreFilter,renderActiveFilters,renderPagination} from '../components/filtros.js';

initHeader();
const $=s=>document.querySelector(s);
const grid=$('#catalog'),search=$('#search'),categories=$('#categoryFilter'),subcategories=$('#subcategoryFilter'),themes=$('#themeFilter'),collections=$('#collectionFilter'),sagas=$('#sagaFilter'),games=$('#gameFilter'),years=$('#yearFilter'),genreBox=$('#genreFilter'),sort=$('#sortFilter'),count=$('#catalogCount'),active=$('#activeFilters'),pagination=$('#pagination');
const pageSize=48; let all=[], taxonomy={categorias:[],subcategorias:[],temas:[],generos_sugeridos:[]};
let state={query:'',category:'',subcategory:'',tema:'',colecao:'',saga:'',game:'',year:'',genres:[],sort:'relevancia',page:1}; let genreControl;
const names={category:new Map(),subcategory:new Map(),theme:new Map(),collection:new Map()};
const fill=(select,values,first,labels=new Map())=>select.innerHTML=`<option value="">${escapeHtml(first)}</option>`+values.map(v=>`<option value="${escapeHtml(v)}">${escapeHtml(labels.get(v)||v)}</option>`).join('');

function syncSubcategories(){
 const valid=taxonomy.subcategorias.filter(x=>!state.category || all.some(i=>i.categoria===state.category&&i.subcategoria===x.id));
 fill(subcategories,valid.map(x=>x.id),'Todas as subcategorias',names.subcategory);
 if(!valid.some(x=>x.id===state.subcategory)){state.subcategory='';}
 subcategories.value=state.subcategory;
}
function syncGameFilter(){
 const enabled=state.subcategory==='gameplay';
 const relevant=all.filter(item=>item.subcategoria==='gameplay'&&(!state.category||item.categoria===state.category));
 const vals=uniqueValues(relevant,'jogo').filter(Boolean).sort((a,b)=>String(a).localeCompare(String(b),'pt-BR'));
 games.disabled=!enabled; games.hidden=!enabled;
 if(!enabled){games.value='';state.game='';return;}
 fill(games,vals,'Todos os jogos'); games.value=vals.includes(state.game)?state.game:'';
 if(state.game&&!vals.includes(state.game))state.game='';
}
function writeUrl(){
 const p=new URLSearchParams();
 const map={q:state.query,categoria:state.category,subcategoria:state.subcategory,tema:state.tema,colecao:state.colecao,saga:state.saga,jogo:state.game,ano:state.year,ordenar:state.sort};
 Object.entries(map).forEach(([k,v])=>{if(v)p.set(k,v)}); state.genres.forEach(g=>p.append('genero',g)); if(state.page>1)p.set('pagina',String(state.page));
 const next=`${location.pathname}${p.toString()?`?${p}`:''}`;
 history.replaceState(null,'',next);
}
function render(){
 syncSubcategories(); syncGameFilter();
 const filtered=filterItems(all,state), page=paginate(filtered,state.page,pageSize); state.page=page.page; writeUrl();
 count.textContent=state.saga?`${page.total} ${page.total===1?'saga encontrada':'sagas encontradas'}`:`${page.total} ${page.total===1?'título encontrado':'títulos encontrados'}`;
 renderCards(grid,page.items);
 renderPagination(pagination,page,p=>{state.page=p;render();window.scrollTo({top:0,behavior:'smooth'})});
 renderActiveFilters(active,state,{category:categoryLabel(state.category),subcategory:subcategoryLabel(state.subcategory),tema:names.theme.get(state.tema)||state.tema,colecao:names.collection.get(state.colecao)||state.colecao,saga:state.saga?'Somente sagas':'',game:state.game},(kind,value)=>{
  const map={category:'category',subcategory:'subcategory',tema:'tema',colecao:'colecao',saga:'saga',game:'game',year:'year'};
  if(kind==='genre'){state.genres=state.genres.filter(g=>g!==value);genreControl.setSelected(state.genres)} else if(map[kind]) state[map[kind]]=''; state.page=1; syncSelects(); render();
 },()=>{state={...state,category:'',subcategory:'',tema:'',colecao:'',game:'',year:'',genres:[],saga:'',page:1};genreControl.setSelected([]);syncSelects();render()});
}
function syncSelects(){categories.value=state.category;themes.value=state.tema;collections.value=state.colecao;sagas.value=state.saga;years.value=state.year;sort.value=state.sort;}
function readUrl(){
 const p=new URLSearchParams(location.search); state.query=p.get('q')||'';state.category=p.get('categoria')||'';state.subcategory=p.get('subcategoria')||p.get('tipo_conteudo')||'';state.tema=p.get('tema')||'';state.colecao=p.get('colecao')||'';state.saga=p.get('saga')||'';state.game=p.get('jogo')||'';state.year=p.get('ano')||'';state.sort=p.get('ordenar')||'relevancia';state.page=Math.max(1,Number(p.get('pagina'))||1);state.genres=p.getAll('genero');search.value=state.query;
}

(async()=>{
 try{
  [all,taxonomy]=await Promise.all([catalogo(),taxonomia()]);
  taxonomy.categorias.forEach(x=>names.category.set(x.id,x.nome)); taxonomy.subcategorias.forEach(x=>names.subcategory.set(x.id,x.nome)); (taxonomy.temas||[]).forEach(x=>names.theme.set(x.id,x.nome));
  uniqueValues(all,'colecao').filter(Boolean).forEach(x=>names.collection.set(x,x));
  fill(categories,taxonomy.categorias.map(x=>x.id),'Todas as categorias',names.category); fill(themes,(taxonomy.temas||[]).map(x=>x.id),'Todos os temas',names.theme); fill(collections,[...names.collection.keys()].sort((a,b)=>String(a).localeCompare(String(b),'pt-BR')),'Todas as coleções',names.collection);
  const yearsValues=[...uniqueValues(all,'ano').filter(v=>String(v).trim()&&Number(v)>0).sort((a,b)=>Number(b)-Number(a)),'__sem_ano__']; fill(years,yearsValues,'Todos os anos',new Map([['__sem_ano__','Sem ano informado']]));
  const genreValues=uniqueValues(all,'generos').filter(Boolean).sort((a,b)=>String(a).localeCompare(String(b),'pt-BR')); genreControl=setupGenreFilter(genreBox,genreValues,g=>{state.genres=g;state.page=1;render()});
  readUrl(); syncSubcategories(); syncSelects(); genreControl.setSelected(state.genres); render();
  search.addEventListener('input',()=>{state.query=search.value;state.page=1;render()});
  categories.addEventListener('change',()=>{state.category=categories.value;state.subcategory='';state.game='';state.page=1;render()});
  subcategories.addEventListener('change',()=>{state.subcategory=subcategories.value;state.game='';state.page=1;render()});
  themes.addEventListener('change',()=>{state.tema=themes.value;state.page=1;render()}); collections.addEventListener('change',()=>{state.colecao=collections.value;state.page=1;render()}); sagas.addEventListener('change',()=>{state.saga=sagas.value;state.page=1;render()}); games.addEventListener('change',()=>{state.game=games.value;state.page=1;render()}); years.addEventListener('change',()=>{state.year=years.value;state.page=1;render()}); sort.addEventListener('change',()=>{state.sort=sort.value;state.page=1;render()});
  addEventListener('popstate',()=>{readUrl();syncSubcategories();syncSelects();genreControl.setSelected(state.genres);render()});
 }catch(e){grid.innerHTML=`<div class="error"><strong>Não foi possível carregar o catálogo.</strong><p>${escapeHtml(e.message)}</p><button class="btn primary" onclick="location.reload()">Tentar novamente</button></div>`;count.textContent='Erro de carregamento'}
})();
