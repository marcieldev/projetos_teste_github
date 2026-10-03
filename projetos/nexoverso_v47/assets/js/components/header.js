/* HEADER — navegação, busca, notificações e pequenos comportamentos globais. */
import {alerts as loadAlerts} from '../core/data.js';
import {escapeHtml} from '../core/utils.js';
import {pageUrl} from '../core/paths.js';
export {pageUrl};

export function initHeader(){
  document.querySelectorAll('input[placeholder="Buscar conteúdos..."]').forEach(input=>{
    input.addEventListener('keydown', e=>{
      if(e.key==='Enter' && input.value.trim()) location.href=pageUrl(`paginas/catalogo/?q=${encodeURIComponent(input.value.trim())}`);
    });
  });
  const bell=document.querySelector('.tool-icon[aria-label="Notificações"]');
  if(!bell) return;
  let panel=document.getElementById('nexoAlerts');
  if(!panel){
    panel=document.createElement('div'); panel.className='nexo-alert-panel'; panel.id='nexoAlerts';
    panel.setAttribute('role','dialog'); panel.setAttribute('aria-label','Informações importantes');
    panel.innerHTML='<div class="alert-panel-head"><h3>Informações importantes</h3><button type="button" aria-label="Fechar">×</button></div><div id="nexoAlertList">Carregando...</div>';
    document.body.appendChild(panel);
    panel.querySelector('button').onclick=()=>panel.classList.remove('open');
  }
  const closeOutside=e=>{if(panel.classList.contains('open')&&!panel.contains(e.target)&&!bell.contains(e.target))panel.classList.remove('open')};
  document.addEventListener('click',closeOutside);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')panel.classList.remove('open')});
  bell.onclick=async()=>{
    panel.classList.toggle('open');
    if(!panel.classList.contains('open')) return;
    try{
      const data=await loadAlerts();
      const active=(data.alertas||[]).filter(a=>a.ativo!==false);
      document.getElementById('nexoAlertList').innerHTML=active.length
        ? active.map(a=>`<div class="nexo-alert"><b>${escapeHtml(a.titulo)}</b><p>${escapeHtml(a.mensagem)}</p><small>${escapeHtml(a.data||'')}</small></div>`).join('')
        : '<div class="nexo-alert">Nenhuma informação nova.</div>';
    }catch(e){document.getElementById('nexoAlertList').textContent=e.message||'Não foi possível carregar os alertas.'}
  };
}
