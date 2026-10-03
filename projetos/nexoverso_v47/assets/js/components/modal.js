/* MODAL — onboarding de boas-vindas e instruções do NEXOVERSO */
import {config} from '../core/data.js';
import {escapeHtml} from '../core/utils.js';

const STORAGE_KEY='nexoverso_welcome_seen_v2';

function icon(name){
  const icons={
    spark:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/></svg>`,
    alert:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v5"/><path d="M12 17h.01"/></svg>`,
    users:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 21v-1.5a4.5 4.5 0 0 0-4.5-4.5h-3A4.5 4.5 0 0 0 4 19.5V21"/><circle cx="10" cy="7" r="4"/><path d="M17 11a3.5 3.5 0 1 0 0-7"/><path d="M17 14a4.5 4.5 0 0 1 3 4.25V21"/></svg>`,
    link:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 13.5a4 4 0 0 0 5.7.2l2.1-2.1a4 4 0 0 0-5.7-5.7L11 7"/><path d="M14 10.5a4 4 0 0 0-5.7-.2l-2.1 2.1a4 4 0 0 0 5.7 5.7L13 17"/></svg>`,
    check:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4.2 4.2L19 6.5"/></svg>`
  };
  return icons[name]||icons.spark;
}

export async function initWelcomeModal(){
  if(!document.getElementById('heroFeatured'))return;
  if(sessionStorage.getItem(STORAGE_KEY)==='1')return;

  let siteName='NEXOVERSO';
  let discord='';
  let platformText='';
  let platforms=[];
  try{
    const data=await config();
    siteName=data.site?.nome||siteName;
    discord=data.discord?.convite||'';
    platformText=data.creditos?.texto||'';
    platforms=data.creditos?.plataformas||[];
  }catch{}

  const backdrop=document.createElement('div');
  backdrop.className='nexo-modal-backdrop nexo-welcome-overlay';
  backdrop.id='nexoWelcome';
  backdrop.innerHTML=`
    <section class="nexo-modal nexo-welcome-modal" role="dialog" aria-modal="true" aria-labelledby="nexoWelcomeTitle" aria-describedby="nexoWelcomeDescription">
      <button class="nexo-close" id="nexoWelcomeClose" aria-label="Fechar janela">×</button>
      <div class="nexo-modal-progress" aria-label="Etapas de apresentação">
        <span class="is-active" data-progress="1"></span><span data-progress="2"></span><span data-progress="3"></span>
      </div>

      <div class="nexo-welcome-step is-active" data-step="1">
        <div class="nexo-welcome-icon">${icon('spark')}</div>
        <p class="eyebrow">BEM-VINDO</p>
        <h2 id="nexoWelcomeTitle">Opa! Seja bem-vindo ao ${escapeHtml(siteName)}! 👋</h2>
        <p id="nexoWelcomeDescription" class="nexo-lead">Um espaço para reunir, organizar e apresentar conteúdos de um jeito simples, bonito e fácil de explorar.</p>
        <div class="nexo-welcome-grid">
          <article><span class="nexo-mini-icon">${icon('spark')}</span><div><b>Explore</b><small>Encontre filmes, séries, desenhos e outros conteúdos.</small></div></article>
          <article><span class="nexo-mini-icon">${icon('link')}</span><div><b>Acesse</b><small>Quando houver um link externo, você será direcionado para a plataforma correspondente.</small></div></article>
          <article><span class="nexo-mini-icon">${icon('users')}</span><div><b>Participe</b><small>Você também pode acompanhar novidades e enviar sugestões pela comunidade.</small></div></article>
        </div>
      </div>

      <div class="nexo-welcome-step" data-step="2" aria-hidden="true">
        <div class="nexo-section-icon nexo-section-icon-warning">${icon('alert')}</div>
        <p class="eyebrow">ATENÇÃO</p>
        <h2>Antes de explorar, uma informação importante.</h2>
        <div class="nexo-attention-box">
          <strong>${icon('alert')} O ${escapeHtml(siteName)} não hospeda os conteúdos.</strong>
          <p>O projeto organiza informações e pode apresentar links para páginas ou plataformas externas. O conteúdo é acessado no serviço indicado pelo próprio link.</p>
        </div>
        <ul class="nexo-check-list">
          <li>${icon('check')} Não armazenamos episódios, capítulos ou filmes no site.</li>
          <li>${icon('check')} Links externos podem mudar, sair do ar ou deixar de funcionar.</li>
          <li>${icon('check')} A disponibilidade e as regras do conteúdo pertencem à plataforma de destino.</li>
          <li>${icon('check')} O ${escapeHtml(siteName)} não declara afiliação com plataformas externas.</li>
        </ul>
        ${platformText?`<p class="nexo-source-note">${escapeHtml(platformText)}</p>`:''}
        ${platforms.length?`<div class="nexo-platforms">${platforms.slice(0,4).map(s=>`<span>${escapeHtml(s.nome||s.plataforma||'Fonte')}</span>`).join('')}</div>`:''}
      </div>

      <div class="nexo-welcome-step" data-step="3" aria-hidden="true">
        <div class="nexo-section-icon">${icon('users')}</div>
        <p class="eyebrow">COMUNIDADE</p>
        <h2>Quer fazer parte do projeto?</h2>
        <p>O ${escapeHtml(siteName)} também tem um espaço para acompanhar o projeto, trocar ideias e sugerir conteúdos.</p>
        <div class="nexo-community-callout">
          <b>💡 Uma sugestão pode virar conteúdo no projeto.</b>
          <span>Antes de enviar, confira as informações e os links para facilitar a análise.</span>
        </div>
        <div class="nexo-suggestion-guide">
          <div class="nexo-guide-title"><span>${icon('check')}</span><b>ANTES DE ENVIAR SUA SUGESTÃO</b></div>
          <p>Confira se o nome, o tipo de conteúdo, os dados principais e os links das plataformas estão corretos.</p>
          <ol>
            <li>Preencha as informações solicitadas.</li>
            <li>Revise tudo antes de enviar.</li>
            <li>Gere ou baixe o arquivo da sugestão, quando solicitado.</li>
            <li>Envie pelo canal indicado no Discord.</li>
            <li>Aguarde a análise da administração.</li>
          </ol>
          <small>Enviar uma sugestão não garante aprovação ou inclusão. Sugestões incompletas ou com informações incorretas podem precisar de correção.</small>
        </div>
        ${discord?`<a class="btn primary nexo-discord-btn" href="${escapeHtml(discord)}" target="_blank" rel="noopener noreferrer">${icon('users')} Entrar no Discord</a>`:''}
      </div>

      <div class="nexo-welcome-footer">
        <span class="nexo-step-label" id="nexoStepLabel">1 de 3</span>
        <div class="nexo-welcome-actions">
          <button class="btn ghost" id="nexoWelcomeBack" type="button" hidden>Voltar</button>
          <button class="btn ghost" id="nexoWelcomeLater" type="button">Fechar</button>
          <button class="btn primary" id="nexoWelcomeNext" type="button">Continuar</button>
        </div>
      </div>
    </section>`;
  document.body.appendChild(backdrop);

  const steps=[...backdrop.querySelectorAll('[data-step]')];
  const progress=[...backdrop.querySelectorAll('[data-progress]')];
  const next=backdrop.querySelector('#nexoWelcomeNext');
  const back=backdrop.querySelector('#nexoWelcomeBack');
  const later=backdrop.querySelector('#nexoWelcomeLater');
  const label=backdrop.querySelector('#nexoStepLabel');
  let current=0;

  const finish=()=>{sessionStorage.setItem(STORAGE_KEY,'1');backdrop.classList.add('is-closing');setTimeout(()=>backdrop.remove(),180)};
  const render=()=>{
    steps.forEach((step,i)=>{const active=i===current;step.classList.toggle('is-active',active);step.setAttribute('aria-hidden',String(!active))});
    progress.forEach((dot,i)=>dot.classList.toggle('is-active',i<=current));
    label.textContent=`${current+1} de ${steps.length}`;
    back.hidden=current===0;
    next.textContent=current===steps.length-1?'Entrar no NEXOVERSO':'Continuar';
  };
  next.onclick=()=>{if(current<steps.length-1){current++;render()}else finish()};
  back.onclick=()=>{if(current>0){current--;render()}};
  later.onclick=finish;
  backdrop.querySelector('#nexoWelcomeClose').onclick=finish;
  backdrop.addEventListener('click',e=>{if(e.target===backdrop)finish()});
  document.addEventListener('keydown',function onKey(e){if(!document.body.contains(backdrop)){document.removeEventListener('keydown',onKey);return}if(e.key==='Escape')finish();if(e.key==='ArrowRight'&&!next.disabled)next.click();if(e.key==='ArrowLeft'&&!back.hidden)back.click()});
  render();
}
