(function () {
  const demo = document.querySelector('[data-injection-demo]');
  if (!demo) return;

  const log = demo.querySelector('[data-log]');
  const messages = {
    unguarded: [
      '1. The mock read tool returns the pretend document.',
      '2. The document contains untrusted instructions.',
      '3. In this illustrative unsafe design, the model proposes the mock send-message tool.',
      '4. A missing authorization check would be the flaw. Simulation stopped here: no message was sent and no tool ran.'
    ],
    guarded: [
      '1. The mock read tool returns the pretend document.',
      '2. The document contains untrusted instructions; treat them as data, not authority.',
      '3. A proposed send-message action reaches the application authorization gate.',
      '4. The gate denies the unapproved action. No message was sent and no tool ran.'
    ]
  };

  demo.querySelectorAll('button[data-run]').forEach(function (button) {
    button.addEventListener('click', function () {
      log.replaceChildren();
      messages[button.dataset.run].forEach(function (message) {
        const item = document.createElement('li');
        item.textContent = message;
        log.appendChild(item);
      });
    });
  });
})();
