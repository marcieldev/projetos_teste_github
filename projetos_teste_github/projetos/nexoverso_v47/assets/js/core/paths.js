/* PATHS — URLs do projeto sem depender da raiz do domínio. Compatível com GitHub Pages/subpastas. */
export const projectRoot = new URL('../../../', import.meta.url);
export const pageUrl = path => new URL(String(path || '').replace(/^\/+/, ''), projectRoot).href;
export const assetUrl = path => pageUrl(path);
