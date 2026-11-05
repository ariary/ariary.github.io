const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { runInNewContext } = require('node:vm');

// Minimal DOM boundary: execute the real browser script, including event handlers.
function element(text = '') {
  return {
    textContent: text, hidden: false, disabled: false, children: [], handlers: {},
    addEventListener(type, handler) { this.handlers[type] = handler; },
    replaceChildren(...nodes) { this.children = nodes; this.textContent = ''; },
    append(node) { this.children.push(node); },
    click() { if (!this.disabled) this.handlers.click?.(); },
  };
}

function setup(present = true) {
  const output = element('The sky is cloudless.');
  const status = element('Example output');
  const controls = element();
  controls.hidden = true;
  const next = element();
  const reset = element();
  const nodes = {
    '[data-token-output]': output, '[data-token-status]': status,
    '[data-token-controls]': controls, '[data-next-token]': next,
    '[data-reset-tokens]': reset,
  };
  const demo = { querySelector: (selector) => nodes[selector] };
  const document = {
    querySelectorAll: () => present ? [demo] : [],
    createElement: () => element(),
  };
  runInNewContext(readFileSync('assets/js/llm-demo.js', 'utf8'), { document });
  return { output, status, controls, next, reset };
}

test('initialization enables controls and prepares empty output', () => {
  const { output, status, controls, next } = setup();
  assert.equal(controls.hidden, false);
  assert.equal(output.textContent, '');
  assert.equal(status.textContent, '0 / 6 tokens · Ready');
  assert.equal(next.disabled, false);
});

test('each click appends exactly one illustrative token, including word fragments', () => {
  const { output, next } = setup();
  next.click();
  assert.deepEqual(output.children.map((node) => node.textContent), ['The']);
  for (let i = 0; i < 4; i++) next.click();
  assert.deepEqual(output.children.map((node) => node.textContent), ['The', ' sky', ' is', ' cloud', 'less']);
});

test('completion disables stepping without duplicating output', () => {
  const { output, next, status } = setup();
  for (let i = 0; i < 10; i++) next.click();
  assert.equal(output.children.length, 6);
  assert.equal(output.children.map((node) => node.textContent).join(''), 'The sky is cloudless.');
  assert.equal(next.disabled, true);
  assert.equal(status.textContent, '6 / 6 tokens · Complete');
});

for (const steps of [2, 6]) {
  test(`reset after ${steps} steps restarts generation`, () => {
    const { output, next, reset, status } = setup();
    for (let i = 0; i < steps; i++) next.click();
    reset.click();
    assert.equal(output.children.length, 0);
    assert.equal(next.disabled, false);
    assert.equal(status.textContent, '0 / 6 tokens · Ready');
    next.click();
    assert.equal(output.children[0].textContent, 'The');
  });
}

test('pages without walkthrough initialize safely', () => {
  assert.doesNotThrow(() => setup(false));
});
