// Local illustrative text-generation walkthrough.
(() => {
  const tokens = ['The', ' sky', ' is', ' cloud', 'less', '.'];
  document.querySelectorAll('[data-llm-demo]').forEach((demo) => {
    const output = demo.querySelector('[data-token-output]');
    const status = demo.querySelector('[data-token-status]');
    const controls = demo.querySelector('[data-token-controls]');
    const next = demo.querySelector('[data-next-token]');
    const reset = demo.querySelector('[data-reset-tokens]');
    if (!output || !status || !controls || !next || !reset) return;
    let count = 0;

    function updateStatus() {
      next.disabled = count === tokens.length;
      status.textContent = `${count} / ${tokens.length} tokens · ${count === tokens.length ? 'Complete' : count === 0 ? 'Ready' : 'Generating'}`;
    }

    function restart() {
      count = 0;
      output.replaceChildren();
      updateStatus();
    }

    next.addEventListener('click', () => {
      if (count === tokens.length) return;
      const token = document.createElement('span');
      token.className = 'generated-token';
      token.textContent = tokens[count++];
      output.append(token);
      updateStatus();
    });
    reset.addEventListener('click', restart);
    restart();
    controls.hidden = false;
  });
})();
