(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const storage = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch (_) {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (_) {
        // Controls still work for the current page when storage is unavailable.
      }
    }
  };

  const sidebarTrigger = document.getElementById('sidebar-trigger');
  const sidebar = document.getElementById('sidebar');
  const sidebarClose = document.getElementById('sidebar-close');
  const mask = document.getElementById('mask');
  const mobileNavigation = window.matchMedia('(max-width: 64rem)');
  const triggerIcon = sidebarTrigger?.querySelector('[aria-hidden="true"]');

  function syncNavigation() {
    const mobile = mobileNavigation.matches;
    const open = mobile && body.classList.contains('nav-open');
    if (!mobile) body.classList.remove('nav-open');
    if (sidebar) {
      sidebar.inert = mobile && !open;
      if (mobile && !open) sidebar.setAttribute('aria-hidden', 'true');
      else sidebar.removeAttribute('aria-hidden');
    }
    sidebarTrigger?.setAttribute('aria-expanded', String(open));
    sidebarTrigger?.setAttribute(
      'aria-label',
      open ? sidebarTrigger.dataset.closeLabel : sidebarTrigger.dataset.openLabel
    );
    if (triggerIcon) triggerIcon.textContent = open ? '×' : '☰';
    if (mask) mask.hidden = !open;
  }

  function closeNavigation(restoreFocus = false) {
    const wasOpen = body.classList.contains('nav-open');
    if (wasOpen && sidebar?.contains(document.activeElement)) {
      sidebarTrigger?.focus({ preventScroll: true });
    }
    body.classList.remove('nav-open');
    syncNavigation();
    if (restoreFocus && wasOpen) sidebarTrigger?.focus({ preventScroll: true });
  }

  function openNavigation() {
    if (!mobileNavigation.matches) return;
    body.classList.add('nav-open');
    syncNavigation();
    sidebarClose?.focus({ preventScroll: true });
  }

  syncNavigation();
  sidebarTrigger?.addEventListener('click', () => {
    if (body.classList.contains('nav-open')) closeNavigation(true);
    else openNavigation();
  });
  sidebarClose?.addEventListener('click', () => closeNavigation(true));
  mask?.addEventListener('click', () => closeNavigation(true));
  document.querySelectorAll('#sidebar a').forEach((link) => link.addEventListener('click', () => closeNavigation()));
  mobileNavigation.addEventListener('change', () => closeNavigation());

  const themeButton = document.getElementById('mode-toggle');
  const themeNames = body.dataset.language === 'lt'
    ? { system: 'Sistema', light: 'Šviesi', dark: 'Tamsi' }
    : { system: 'System', light: 'Light', dark: 'Dark' };

  function applyTheme(mode) {
    if (mode === 'light' || mode === 'dark') root.dataset.theme = mode;
    else delete root.dataset.theme;
    if (themeButton) {
      themeButton.dataset.mode = mode;
      themeButton.title = themeNames[mode];
      themeButton.setAttribute('aria-label', `${themeButton.textContent.trim()}: ${themeNames[mode]}`);
    }
  }

  applyTheme(storage.get('hecavex-theme') || 'system');
  themeButton?.addEventListener('click', () => {
    const order = ['system', 'light', 'dark'];
    const current = themeButton.dataset.mode || 'system';
    const mode = order[(order.indexOf(current) + 1) % order.length];
    storage.set('hecavex-theme', mode);
    applyTheme(mode);
  });

  document.addEventListener('click', (event) => {
    const languageLink = event.target.closest('[data-language]');
    if (languageLink) storage.set('hecavex-language', languageLink.dataset.language);
    document.querySelectorAll('.hx-language[open]').forEach((details) => {
      if (!details.contains(event.target)) closeDisclosure(details);
    });
  });

  function closeDisclosure(details) {
    const returnFocus = details.contains(document.activeElement);
    details.removeAttribute('open');
    if (returnFocus) details.querySelector('summary')?.focus({ preventScroll: true });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab' && mobileNavigation.matches && body.classList.contains('nav-open') && sidebar) {
      const focusable = [...sidebar.querySelectorAll('a[href], button:not([disabled]), summary, input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])')]
        .filter((element) => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable.at(-1);
      if (first && last && (event.shiftKey && document.activeElement === first)) {
        event.preventDefault();
        last.focus();
      } else if (first && last && (!event.shiftKey && document.activeElement === last)) {
        event.preventDefault();
        first.focus();
      }
      return;
    }
    if (event.key !== 'Escape') return;
    closeNavigation(true);
    closeSearch();
    document.querySelectorAll('.hx-language[open]').forEach(closeDisclosure);
  });

  const searchTrigger = document.getElementById('search-trigger');
  const searchPanel = document.getElementById('search-panel');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const searchCancel = document.getElementById('search-cancel');
  let searchIndex = null;

  function closeSearch() {
    if (!searchPanel) return;
    const returnFocus = searchPanel.contains(document.activeElement);
    searchPanel.hidden = true;
    searchTrigger?.setAttribute('aria-expanded', 'false');
    if (returnFocus) searchTrigger?.focus({ preventScroll: true });
  }

  function openSearch() {
    if (!searchPanel) return;
    searchPanel.hidden = false;
    searchTrigger?.setAttribute('aria-expanded', 'true');
    searchInput?.focus();
  }

  async function loadSearch() {
    if (searchIndex) return searchIndex;
    const language = body.dataset.language || 'en';
    const response = await fetch(`/${language}/search.json`);
    if (!response.ok) throw new Error(`Search index returned ${response.status}`);
    searchIndex = await response.json();
    return searchIndex;
  }

  function searchText(item) {
    return `${item.title} ${item.categories} ${item.tags} ${item.content}`.toLocaleLowerCase();
  }

  async function renderSearch() {
    if (!searchInput || !searchResults) return;
    const query = searchInput.value.trim().toLocaleLowerCase();
    searchResults.replaceChildren();
    if (query.length < 2) return;
    try {
      const items = await loadSearch();
      const matches = items.filter((item) => searchText(item).includes(query)).slice(0, 8);
      if (!matches.length) {
        const empty = document.createElement('p');
        empty.className = 'search-empty';
        empty.textContent = body.dataset.language === 'lt' ? 'Rezultatų nerasta.' : 'No results found.';
        searchResults.append(empty);
        return;
      }
      const list = document.createElement('ol');
      matches.forEach((item) => {
        const entry = document.createElement('li');
        const link = document.createElement('a');
        const meta = document.createElement('small');
        link.href = item.url;
        link.textContent = item.title;
        meta.textContent = [String(item.date).slice(0, 10), item.categories].filter(Boolean).join(' · ');
        entry.append(link, meta);
        list.append(entry);
      });
      searchResults.append(list);
    } catch (_) {
      const error = document.createElement('p');
      error.className = 'search-empty';
      error.textContent = body.dataset.language === 'lt'
        ? 'Paieška šiuo metu nepasiekiama.'
        : 'Search is temporarily unavailable.';
      searchResults.append(error);
    }
  }

  searchTrigger?.addEventListener('click', () => searchPanel?.hidden ? openSearch() : closeSearch());
  searchCancel?.addEventListener('click', closeSearch);
  searchInput?.addEventListener('input', renderSearch);
  searchInput?.addEventListener('focus', loadSearch, { once: true });

  const article = document.querySelector('.hx-article-body');
  const toc = document.getElementById('toc');
  if (article && toc) {
    const headings = [...article.querySelectorAll('h2, h3')];
    if (headings.length) {
      const list = document.createElement('ol');
      headings.forEach((heading, index) => {
        if (!heading.id) heading.id = `section-${index + 1}`;
        const item = document.createElement('li');
        const link = document.createElement('a');
        if (heading.tagName === 'H3') item.className = 'toc-depth-3';
        link.href = `#${encodeURIComponent(heading.id)}`;
        link.textContent = heading.textContent.trim();
        item.append(link);
        list.append(item);
      });
      toc.append(list);
    } else {
      toc.closest('.hx-toc')?.remove();
    }
  }

  if (window.mermaid) {
    document.querySelectorAll('code.language-mermaid').forEach((code) => {
      const diagram = document.createElement('pre');
      diagram.className = 'mermaid';
      diagram.textContent = code.textContent;
      code.closest('pre').replaceWith(diagram);
    });
    window.mermaid.initialize({ startOnLoad: false, theme: 'neutral', securityLevel: 'strict' });
    window.mermaid.run({ querySelector: '.mermaid' });
  }

  document.querySelectorAll('.hx-article-body pre:not(.mermaid)').forEach((block) => {
    const wrapper = document.createElement('div');
    const button = document.createElement('button');
    wrapper.className = 'code-block';
    button.className = 'code-copy';
    button.type = 'button';
    button.textContent = body.dataset.language === 'lt' ? 'Kopijuoti' : 'Copy';
    block.parentNode.insertBefore(wrapper, block);
    wrapper.append(block, button);
    button.addEventListener('click', async () => {
      await navigator.clipboard.writeText(block.textContent);
      button.textContent = body.dataset.language === 'lt' ? 'Nukopijuota' : 'Copied';
    });
  });

  const copyLink = document.getElementById('copy-link');
  copyLink?.addEventListener('click', async () => {
    await navigator.clipboard.writeText(window.location.href);
    copyLink.textContent = copyLink.dataset.success;
  });

  const backToTop = document.getElementById('back-to-top');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  function updateBackToTop() {
    backToTop?.classList.toggle('is-visible', window.scrollY > 700);
  }
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  backToTop?.addEventListener('click', () => window.scrollTo({
    top: 0,
    behavior: reduceMotion.matches ? 'auto' : 'smooth'
  }));
  updateBackToTop();
})();
