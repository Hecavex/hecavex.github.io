(() => {
  'use strict';

  const language = document.body.dataset.language === 'lt' ? 'lt' : 'en';
  const navigation = document.querySelector('[data-mobile-navigation]');
  const navigationSummary = navigation?.querySelector('summary');

  const updateNavigationLabel = () => {
    if (!navigationSummary || !(navigation instanceof HTMLDetailsElement)) return;
    navigationSummary.setAttribute('aria-label', navigation.open
      ? (language === 'lt' ? 'Uždaryti navigacijos meniu' : 'Close navigation menu')
      : (language === 'lt' ? 'Atverti navigacijos meniu' : 'Open navigation menu'));
  };

  navigation?.addEventListener('toggle', updateNavigationLabel);
  navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    if (navigation instanceof HTMLDetailsElement) navigation.open = false;
  }));
  updateNavigationLabel();

  const dialog = document.querySelector('[data-search-dialog]');
  const searchInput = document.querySelector('[data-search-input]');
  const searchResults = document.querySelector('[data-search-results]');
  let searchIndex;

  const openSearch = () => {
    if (!(dialog instanceof HTMLDialogElement)) return;
    dialog.showModal();
    if (navigation instanceof HTMLDetailsElement) navigation.open = false;
    window.requestAnimationFrame(() => searchInput?.focus());
  };

  document.querySelectorAll('[data-search-open]').forEach((button) => button.addEventListener('click', openSearch));
  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog && dialog instanceof HTMLDialogElement) dialog.close();
  });

  const loadSearch = async () => {
    if (searchIndex) return searchIndex;
    const response = await fetch(`/${language}/search.json`);
    if (!response.ok) throw new Error(`Search index returned ${response.status}`);
    searchIndex = await response.json();
    return searchIndex;
  };

  const renderSearch = async () => {
    if (!(searchInput instanceof HTMLInputElement) || !searchResults) return;
    const query = searchInput.value.trim().toLocaleLowerCase(language);
    searchResults.replaceChildren();
    if (query.length < 2) return;
    try {
      const index = await loadSearch();
      const matches = index.filter((item) => `${item.title} ${item.description} ${item.categories.join(' ')} ${item.tags.join(' ')} ${item.content}`.toLocaleLowerCase(language).includes(query)).slice(0, 10);
      if (!matches.length) {
        const empty = document.createElement('p');
        empty.textContent = language === 'lt' ? 'Rezultatų nerasta.' : 'No results found.';
        searchResults.append(empty);
        return;
      }
      const list = document.createElement('ol');
      for (const item of matches) {
        const entry = document.createElement('li');
        const link = document.createElement('a');
        const meta = document.createElement('small');
        link.href = item.url;
        link.textContent = item.title;
        meta.textContent = [String(item.date).slice(0, 10), item.categories.join(', ')].filter(Boolean).join(' · ');
        entry.append(link, meta);
        list.append(entry);
      }
      searchResults.append(list);
    } catch (_) {
      const error = document.createElement('p');
      error.textContent = language === 'lt' ? 'Paieška šiuo metu nepasiekiama.' : 'Search is temporarily unavailable.';
      searchResults.append(error);
    }
  };

  searchInput?.addEventListener('focus', loadSearch, { once: true });
  searchInput?.addEventListener('input', renderSearch);

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (navigation instanceof HTMLDetailsElement && navigation.open) {
      navigation.open = false;
      navigationSummary?.focus({ preventScroll: true });
    }
  });

  document.querySelectorAll('[data-copy-link]').forEach((button) => button.addEventListener('click', async () => {
    if (!navigator.clipboard?.writeText) return;
    await navigator.clipboard.writeText(window.location.href);
    button.textContent = button.dataset.success ?? 'Copied';
  }));

  const backToTop = document.querySelector('[data-back-to-top]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const updateBackToTop = () => backToTop?.classList.toggle('is-visible', window.scrollY > 700);
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' }));
  updateBackToTop();
})();
