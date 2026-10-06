(() => {
'use strict';

  for (const root of document.querySelectorAll('[data-enquiry]')) {
    const lt = root.dataset.language === 'lt';
    const editor = root.querySelector('[data-enquiry-editor]');
    const output = root.querySelector('[data-enquiry-output]');
    const status = root.querySelector('[data-enquiry-status]');
    const draft = root.querySelector('[data-draft]');
    const email = root.querySelector('[data-open-email]');
    const fields = [...root.querySelectorAll('[data-field]')];
    editor.hidden = false;
    const topics = lt ? ['Žvalgyba už indikatorių ribų', 'Vienas scam domenas retai būna vienas', 'Užpuolikai ieško žmonių'] : ['Intelligence beyond indicators', 'One scam domain is rarely alone', 'Attackers are looking for people'];
    const requested = new URLSearchParams(location.search).get('talk');
    if (requested !== null && /^[0-2]$/.test(requested)) {
      root.querySelector('[data-field="topic"]').value = topics[Number(requested)];
      editor.open = true;
    }
    root.addEventListener('input', () => { output.hidden = true; status.textContent = ''; });
    root.querySelector('[data-prepare]').addEventListener('click', () => {
      const kind = fields[0];
      const subject = kind.selectedOptions[0].textContent ?? '';
      const body = fields.slice(1).map(field => `${field.parentElement.firstChild.textContent.trim()}: ${field.value.trim()}`).join('\n');
      draft.value = `${subject}\n\n${body}`;
      email.href = `mailto:info@hecavex.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      output.hidden = false;
      status.textContent = lt ? 'Juodraštis parengtas. Nieko neišsiųsta.' : 'Draft prepared. Nothing has been sent.';
      draft.focus();
    });
  }

})();
