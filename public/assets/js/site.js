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

  const outlineGroups = new Map();
  document.querySelectorAll('[data-content-outline]').forEach((outline) => {
    const key = outline.dataset.contentOutline;
    if (!key) return;
    const group = outlineGroups.get(key) ?? [];
    group.push(outline);
    outlineGroups.set(key, group);
  });

  const outlineTrackers = [...outlineGroups.values()].map((outlines) => {
    const scopeId = outlines[0]?.dataset.outlineScope;
    const scope = scopeId ? document.getElementById(scopeId) : undefined;
    if (!scope) return undefined;
    const allTargets = [...scope.querySelectorAll('[data-outline-heading][id], .prose h2[id], .prose h3[id]')];
    const listedTargetIds = new Set([...outlines[0].querySelectorAll('[data-outline-item]')].map((item) => item.dataset.outlineSlug));
    const targets = outlines.some((outline) => outline.classList.contains('content-outline--condensed'))
      ? allTargets
      : allTargets.filter((target) => listedTargetIds.has(target.id));
    if (!targets.length) return undefined;
    const targetIndex = new Map(targets.map((target, index) => [target.id, index]));
    let previousIndex = -1;

    outlines.forEach((outline) => outline.classList.add('is-enhanced'));

    const labelFor = (target) => target.dataset.outlineLabel?.trim()
      || target.textContent?.replace(/\s+/g, ' ').trim()
      || (language === 'lt' ? 'Skiltis' : 'Section');

    const update = () => {
      const siteHeader = document.querySelector('.site-header');
      const headerHeight = siteHeader?.getBoundingClientRect().height ?? 0;
      const activationLine = headerHeight + Math.min(96, window.innerHeight * 0.14);
      let currentIndex = 0;
      targets.forEach((target, index) => {
        if (target.getBoundingClientRect().top <= activationLine) currentIndex = index;
      });
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) currentIndex = targets.length - 1;

      const currentLabel = labelFor(targets[currentIndex]);
      const nextLabel = targets[currentIndex + 1]
        ? labelFor(targets[currentIndex + 1])
        : (language === 'lt' ? 'Pabaiga' : 'End of page');
      const progress = ((currentIndex + 1) / targets.length) * 100;

      outlines.forEach((outline) => {
        const items = [...outline.querySelectorAll('[data-outline-item]')];
        let currentItemIndex = 0;
        items.forEach((item, index) => {
          const indexInDocument = targetIndex.get(item.dataset.outlineSlug);
          if (indexInDocument !== undefined && indexInDocument <= currentIndex) currentItemIndex = index;
        });

        items.forEach((item, index) => {
          const link = item.querySelector('[data-outline-link]');
          const state = index < currentItemIndex ? 'past' : index === currentItemIndex ? 'current' : 'upcoming';
          item.classList.toggle('is-past', state === 'past');
          item.classList.toggle('is-current', state === 'current');
          item.classList.toggle('is-upcoming', state === 'upcoming');
          if (link) {
            if (state === 'current') link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
          }
        });

        const status = outline.querySelector('[data-outline-status]');
        if (status instanceof HTMLElement) status.hidden = false;
        const count = outline.querySelector('[data-outline-count]');
        if (count) count.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(targets.length).padStart(2, '0')}`;
        const current = outline.querySelector('[data-outline-current]');
        if (current) current.textContent = currentLabel;
        const next = outline.querySelector('[data-outline-next]');
        if (next) next.textContent = nextLabel;
        const mobileCurrent = outline.querySelector('[data-outline-mobile-current]');
        if (mobileCurrent) mobileCurrent.textContent = currentLabel;
        const mobileCount = outline.querySelector('[data-outline-mobile-count]');
        if (mobileCount) mobileCount.textContent = `${currentIndex + 1} / ${targets.length}`;
        const progressBar = outline.querySelector('[data-outline-progress]');
        progressBar?.setAttribute('aria-valuemax', String(targets.length));
        progressBar?.setAttribute('aria-valuenow', String(currentIndex + 1));
        const progressFill = outline.querySelector('[data-outline-progress-fill]');
        if (progressFill instanceof HTMLElement) progressFill.style.width = `${progress}%`;

        if (currentIndex !== previousIndex) {
          const nav = outline.querySelector('[data-outline-nav]');
          const activeItem = items[currentItemIndex];
          if (nav instanceof HTMLElement && activeItem instanceof HTMLElement && nav.offsetParent) {
            const navRect = nav.getBoundingClientRect();
            const itemRect = activeItem.getBoundingClientRect();
            const itemTop = nav.scrollTop + itemRect.top - navRect.top;
            const itemBottom = itemTop + itemRect.height;
            if (itemTop < nav.scrollTop || itemBottom > nav.scrollTop + nav.clientHeight) {
              nav.scrollTo({ top: Math.max(0, itemTop - nav.clientHeight / 3), behavior: 'auto' });
            }
          }
        }
      });
      previousIndex = currentIndex;
    };

    return { update };
  }).filter(Boolean);

  if (outlineTrackers.length) {
    let outlineFrame;
    const updateOutlines = () => {
      if (outlineFrame) return;
      outlineFrame = window.requestAnimationFrame(() => {
        outlineFrame = undefined;
        outlineTrackers.forEach((tracker) => tracker.update());
      });
    };
    window.addEventListener('scroll', updateOutlines, { passive: true });
    window.addEventListener('resize', updateOutlines, { passive: true });
    window.addEventListener('hashchange', updateOutlines);
    window.addEventListener('pageshow', updateOutlines);
    document.fonts?.ready.then(updateOutlines);
    updateOutlines();
  }

  const tableRegions = [...document.querySelectorAll('.table-scroll-region[data-table-label]')];
  if (tableRegions.length) {
    let tableFrame;
    const updateTableRegions = () => {
      if (tableFrame) return;
      tableFrame = window.requestAnimationFrame(() => {
        tableFrame = undefined;
        tableRegions.forEach((region) => {
          const overflows = region.scrollWidth > region.clientWidth + 1;
          if (overflows) {
            region.setAttribute('role', 'region');
            region.setAttribute('tabindex', '0');
            region.setAttribute('aria-label', region.dataset.tableLabel || (language === 'lt' ? 'Duomenų lentelė' : 'Data table'));
          } else {
            region.removeAttribute('role');
            region.removeAttribute('tabindex');
            region.removeAttribute('aria-label');
          }
        });
      });
    };
    window.addEventListener('resize', updateTableRegions, { passive: true });
    document.fonts?.ready.then(updateTableRegions);
    updateTableRegions();
  }

  const backToTop = document.querySelector('[data-back-to-top]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const updateBackToTop = () => backToTop?.classList.toggle('is-visible', window.scrollY > 700);
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' }));
  updateBackToTop();
})();
