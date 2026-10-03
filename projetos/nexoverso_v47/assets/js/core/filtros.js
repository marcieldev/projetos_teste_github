/* FILTROS — regras puras de pesquisa, filtros, ordenação e paginação. */
export function normalize(value=''){return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();}
export function matchesSearch(item,query){
  const q=normalize(query); if(!q)return true;
  const nested=(item.conteudos||[]).flatMap(c=>[c.titulo,c.ano,c.sinopse,c.jogo,...(c.generos||[])]);
  return normalize([item.titulo,item.sinopse,item.categoria,item.subcategoria,item.tema,item.colecao,item.jogo,item.ano,...(item.generos||[]),...nested].join(' ')).includes(q);
}
export function matchesFilters(item,filters){
  const genres=item.generos||[];
  const nested=item.conteudos||[];
  const isSaga=Boolean(item.colecao&&Array.isArray(nested)&&nested.length>1);
  const nestedGenres=nested.flatMap(c=>c.generos||[]);
  const nestedYears=nested.map(c=>c.ano).filter(Boolean);
  const genrePool=[...genres,...nestedGenres];
  const yearMatch=!filters.year || (filters.year==='__sem_ano__' ? (item.ano==null||item.ano==='') : String(item.ano)===String(filters.year) || nestedYears.some(y=>String(y)===String(filters.year)));
  return (!filters.category||item.categoria===filters.category)&&(!filters.subcategory||item.subcategoria===filters.subcategory)&&(!filters.tema||item.tema===filters.tema)&&(!filters.colecao||item.colecao===filters.colecao)&&(!filters.saga||isSaga)&&(!filters.game||item.jogo===filters.game||nested.some(c=>c.jogo===filters.game))&&yearMatch&&(!filters.genres?.length||filters.genres.every(g=>genrePool.includes(g)))&&matchesSearch(item,filters.query);
}
export function sortItems(items,sort='relevancia'){
 const result=[...items],text=v=>normalize(v);
 if(sort==='recentes')return result.sort((a,b)=>(Number(b.ano)||0)-(Number(a.ano)||0)||text(a.titulo).localeCompare(text(b.titulo),'pt-BR'));
 if(sort==='antigos')return result.sort((a,b)=>(Number(a.ano)||99999)-(Number(b.ano)||99999)||text(a.titulo).localeCompare(text(b.titulo),'pt-BR'));
 if(sort==='az')return result.sort((a,b)=>text(a.titulo).localeCompare(text(b.titulo),'pt-BR'));
 if(sort==='za')return result.sort((a,b)=>text(b.titulo).localeCompare(text(a.titulo),'pt-BR'));
 if(sort==='episodios')return result.sort((a,b)=>(b.episodios?.length||b.conteudos?.length||0)-(a.episodios?.length||a.conteudos?.length||0)||text(a.titulo).localeCompare(text(b.titulo),'pt-BR'));
 return result;
}
export function filterItems(items,filters){return sortItems(items.filter(item=>matchesFilters(item,filters)),filters.sort);}
export function paginate(items,page=1,perPage=12){const totalPages=Math.max(1,Math.ceil(items.length/perPage)),safePage=Math.min(Math.max(1,Number(page)||1),totalPages),start=(safePage-1)*perPage;return {items:items.slice(start,start+perPage),page:safePage,perPage,total:items.length,totalPages};}
export function uniqueValues(items,key){return [...new Set(items.flatMap(item=>Array.isArray(item[key])?item[key]:item[key]!=null&&item[key]!==''?[item[key]]:[]))];}
