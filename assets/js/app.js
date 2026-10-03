(() => {
  'use strict';
  const state = { projects: [], search: '', status: 'todos' };
  const $ = (selector) => document.querySelector(selector);
  const grid = $('#projectsGrid');
  const empty = $('#emptyState');
  const count = $('#projectCount');
  const notice = $('#notice');
  const search = $('#searchInput');
  const status = $('#statusFilter');

  const statusLabel = {
    'em-teste': 'Em teste',
    'desenvolvimento': 'Em desenvolvimento',
    'aguardando': 'Aguardando revisão',
    'aprovado': 'Aprovado',
    'problemas': 'Com problemas'
  };

  function escapeHTML(value='') {
    return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  }

  function normalizePath(path) {
    if (!path) return '#';
    const clean = path.replace(/^\/+/, '');
    return clean.endsWith('/') ? clean : `${clean}/`;
  }

  function render() {
    const term = state.search.trim().toLocaleLowerCase('pt-BR');
    const filtered = state.projects.filter(project => {
      const matchesSearch = !term || [project.nome, project.versao, project.descricao, project.categoria, project.status].join(' ').toLocaleLowerCase('pt-BR').includes(term);
      const matchesStatus = state.status === 'todos' || project.status === state.status;
      return matchesSearch && matchesStatus;
    });

    count.textContent = state.projects.length;
    grid.innerHTML = filtered.map(project => {
      const label = statusLabel[project.status] || project.status || 'Sem status';
      return `<article class="project-card">
        <div class="card-top">
          <div><h2 class="project-name">${escapeHTML(project.nome)}</h2><div class="version">${escapeHTML(project.versao || 'Sem versão')}</div></div>
          <span class="status ${escapeHTML(project.status || '')}">${escapeHTML(label)}</span>
        </div>
        <p class="description">${escapeHTML(project.descricao || 'Sem descrição cadastrada.')}</p>
        <div class="meta"><span>${escapeHTML(project.categoria || 'Projeto')}</span><span>${escapeHTML(project.id || '')}</span></div>
        <div class="card-bottom"><span class="date">Atualizado em ${escapeHTML(formatDate(project.ultimaAtualizacao))}</span><a class="test-btn" href="${escapeHTML(normalizePath(project.caminho))}">🚀 Testar projeto</a></div>
      </article>`;
    }).join('');
    empty.hidden = filtered.length !== 0;
  }

  function formatDate(value) {
    if (!value) return '—';
    const date = new Date(`${value}T12:00:00`);
    return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('pt-BR').format(date);
  }

  async function loadProjects() {
    notice.hidden = true;
    try {
      const response = await fetch(`data/projetos.json?cache=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (!Array.isArray(data.projetos)) throw new Error('O arquivo precisa conter um array "projetos".');
      state.projects = data.projetos;
      render();
    } catch (error) {
      state.projects = [];
      render();
      notice.hidden = false;
      notice.className = 'notice error';
      notice.innerHTML = `<strong>Não foi possível carregar os projetos.</strong><br>${escapeHTML(error.message)}<br><small>Confira se o projeto está sendo aberto por um servidor/GitHub Pages. Abrir o index.html diretamente como arquivo pode bloquear o carregamento do JSON.</small>`;
    }
  }

  search.addEventListener('input', event => { state.search = event.target.value; render(); });
  status.addEventListener('change', event => { state.status = event.target.value; render(); });
  $('#refreshBtn').addEventListener('click', loadProjects);
  loadProjects();
})();
