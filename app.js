(() => {
  'use strict';
  const byId = id => document.getElementById(id);
  const esc = value => String(value).trim();
  const sampleMaterial = `Fictional sample for format preview only.\n\nA city is considering replacing part of its bus fleet with electric buses. The fictional proposal describes lower tailpipe emissions and quieter streets. A fictional resident supports the idea but asks how routes in outer neighborhoods will be served. A fictional transit worker notes that charging equipment, maintenance training, and a dependable power supply would need planning.\n\nThese points, people, and claims are invented for this demo. They are not news or verified information.`;
  const promptForm = byId('organize-form');
  const output = byId('result');
  const copyPrompt = byId('copy-result');
  const status = byId('copy-status');
  const buildPrompt = () => {
    const topic = esc(byId('topic')?.value) || 'Content summary';
    const audience = esc(byId('length')?.value) || 'General readers; concise unless a length is specified.';
    const source = esc(byId('source')?.value);
    const material = esc(byId('material')?.value);
    if (!material) {
      if (status) status.textContent = 'Paste text or a transcript first, then generate instructions.';
      byId('material')?.focus();
      return;
    }
    const instructions = [
      `Create a clear, careful summary about: ${topic}.`,
      `Audience and length: ${audience}.`,
      '',
      'Use only the source material provided below. Do not add facts from memory or imply that unverified details are confirmed.',
      'Organize the result into: a short overview; key points; facts, opinions, and recommendations (clearly separated); source clues and timestamps when present; and items that need verification.',
      'Preserve names, numbers, and meaningful context carefully. If a passage is unclear, say so instead of guessing. Flag conflicting, missing, or unverified information.',
      source ? `Source link supplied by the user: ${source}` : 'No source link was supplied.',
      '',
      'SOURCE MATERIAL',
      material
    ].join('\n');
    output.value = instructions;
    copyPrompt.disabled = false;
    if (status) status.textContent = 'Instructions created locally. Review before copying.';
  };
  promptForm?.addEventListener('submit', event => { event.preventDefault(); buildPrompt(); });
  byId('fill-example')?.addEventListener('click', () => {
    byId('topic').value = 'A city is considering electric buses';
    byId('length').value = 'General readers, about 350 words';
    byId('source').value = '';
    byId('material').value = sampleMaterial;
    byId('material').focus();
    if (status) status.textContent = 'Fictional sample loaded. No real material is included.';
  });
  const copyText = async (text, announce) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      announce('Copied to clipboard.');
    } catch {
      announce('Clipboard access is unavailable here. Select the text and copy it manually.');
    }
  };
  copyPrompt?.addEventListener('click', () => copyText(output.value, message => { if (status) status.textContent = message; }));

  const demoButton = byId('run-demo');
  const demoResult = byId('demo-result');
  const demoState = byId('demo-state');
  const copyDemo = byId('copy-demo');
  const fixedSummary = `FICTIONAL SAMPLE — NOT A REAL NEWS SUMMARY\n\nOverview\nA fictional city is considering electric buses. The sample illustrates how a report can separate stated benefits, questions, and implementation considerations.\n\nKey points\n• The fictional proposal mentions lower tailpipe emissions and quieter streets.\n• A fictional resident asks how outer-neighborhood routes will be served.\n• A fictional transit worker says charging equipment, training, and power supply would need planning.\n\nTo verify\nNo sources or timestamps are supplied. All people, claims, and scenario details are invented for this fixed demo.`;
  demoButton?.addEventListener('click', () => {
    document.querySelectorAll('.workflow-row').forEach((row, index) => {
      row.classList.toggle('complete', index < 3);
      row.classList.remove('active');
      const state = row.querySelector('span');
      if (state) state.textContent = 'Done';
    });
    if (demoState) demoState.textContent = 'Fixed sample shown';
    if (demoResult) demoResult.textContent = fixedSummary;
    if (copyDemo) copyDemo.disabled = false;
  });
  copyDemo?.addEventListener('click', () => copyText(fixedSummary, message => { if (demoState) demoState.textContent = message; }));

  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav?.classList.toggle('open', open);
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
  }));
})();