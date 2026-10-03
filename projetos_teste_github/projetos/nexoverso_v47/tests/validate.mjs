import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const errors=[];
const jsonFiles=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.name==='node_modules'||entry.name==='.git')continue;if(entry.isDirectory())walk(p);else if(entry.name.endsWith('.json'))jsonFiles.push(p)}}
walk(path.join(root,'data'));
for(const file of jsonFiles){try{JSON.parse(fs.readFileSync(file,'utf8'))}catch(e){errors.push(`${path.relative(root,file)}: JSON inválido — ${e.message}`)}}
const catalogFiles=jsonFiles.filter(f=>f.endsWith('catalogo.json'));
const ids=new Map();
for(const file of catalogFiles){let data;try{data=JSON.parse(fs.readFileSync(file,'utf8'))}catch{continue}for(const item of (data.itens||[])){if(!item.id)continue;const id=String(item.id);if(ids.has(id))errors.push(`ID duplicado: ${id} (${path.relative(root,file)} e ${ids.get(id)})`);else ids.set(id,path.relative(root,file));if(!item.titulo)errors.push(`${path.relative(root,file)}: item ${id} sem titulo`)}}
for(const ext of ['.mp4','.mov','.avi','.mkv','.webm']){
 const found=[];function scan(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){if(e.name==='node_modules'||e.name==='.git')continue;const p=path.join(dir,e.name);if(e.isDirectory())scan(p);else if(e.name.toLowerCase().endsWith(ext))found.push(p)}}
 scan(root); if(found.length)errors.push(`Mídia local ${ext} encontrada: ${found.length} arquivo(s)`);
}
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log(`NEXOVERSO OK — ${jsonFiles.length} JSONs válidos, ${ids.size} IDs únicos, sem vídeos locais.`);
