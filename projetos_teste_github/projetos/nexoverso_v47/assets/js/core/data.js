/* DATA — camada única de carregamento de JSON, com resolução segura para GitHub Pages e subpastas. */
import {DATA_FILES,CATALOG_FILES} from './config.js';

const ROOT = new URL('../../../', import.meta.url);
const cache = new Map();

export function projectUrl(path='') {
  const clean = String(path || '').replace(/^\/+/, '');
  return new URL(clean, ROOT).href;
}

export async function json(path, {force=false}={}) {
  const absolute = projectUrl(path);
  if (!force && cache.has(absolute)) return cache.get(absolute);
  const promise = (async () => {
    if (location.protocol === 'file:') {
      throw new Error('O NEXOVERSO precisa ser aberto por um servidor HTTP/HTTPS para carregar os arquivos JSON. Use Live Server, python -m http.server ou publique no GitHub Pages.');
    }
    const response = await fetch(absolute, { cache: force ? 'no-store' : 'default', headers: { Accept: 'application/json' } });
    const text = await response.text();
    if (!response.ok) throw new Error(`Falha ao carregar ${path} (${response.status}).`);
    try { return JSON.parse(text); }
    catch { throw new Error(`JSON inválido em ${path}. Verifique vírgulas, aspas e chaves.`); }
  })().catch(error => { cache.delete(absolute); throw error; });
  cache.set(absolute, promise);
  return promise;
}

export async function catalogo() {
  const results = await Promise.allSettled(CATALOG_FILES.map(path => json(path)));
  const failures = results.filter(r => r.status === 'rejected');
  const items = results.flatMap((result, index) => {
    if (result.status === 'rejected') return [];
    const source = result.value || {};
    return (Array.isArray(source.itens) ? source.itens : []).map(item => ({
      ...item,
      categoria: item.categoria || source.categoria || '',
      subcategoria: item.subcategoria ?? item.tipo_conteudo ?? '',
      tema: item.tema ?? source.tema ?? ''
    }));
  });
  if (!items.length && failures.length) {
    const first = failures[0].reason;
    throw new Error(first?.message || 'Nenhum catálogo pôde ser carregado.');
  }
  return items;
}

export const taxonomia = () => json('data/taxonomia.json');
export async function findById(id) {
  const item = (await catalogo()).find(x => String(x.id) === String(id));
  if (!item) throw new Error(`Conteúdo "${id}" não encontrado no catálogo.`);
  return item;
}
export const config = () => json(DATA_FILES.config);
export const alerts = () => json(DATA_FILES.alerts);
export const highlights = () => json(DATA_FILES.highlights);
export const community = () => json(DATA_FILES.community);
