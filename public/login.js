(() => {
  'use strict';

  const boxes = Array.from(document.querySelectorAll('.pin-box'));
  const form = document.getElementById('loginForm');
  const errorEl = document.getElementById('loginError');
  const submitBtn = document.getElementById('loginSubmit');

  // Already logged in? skip straight to the app.
  fetch('/api/session').then((r) => r.json()).then((d) => {
    if (d.authed) window.location.replace('/');
  }).catch(() => {});

  function currentPin() {
    return boxes.map((b) => b.value).join('');
  }
  function setError(msg) {
    errorEl.textContent = msg || '';
  }
  function clearBoxes(focusFirst) {
    boxes.forEach((b) => { b.value = ''; });
    if (focusFirst) boxes[0].focus();
  }
  function shake() {
    form.classList.remove('shake');
    // eslint-disable-next-line no-unused-expressions
    void form.offsetWidth;
    form.classList.add('shake');
  }

  boxes.forEach((box, i) => {
    box.addEventListener('input', () => {
      box.value = box.value.replace(/[^0-9]/g, '').slice(0, 1);
      setError('');
      if (box.value && i < boxes.length - 1) boxes[i + 1].focus();
      if (i === boxes.length - 1 && currentPin().length === 8) submit();
    });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !box.value && i > 0) boxes[i - 1].focus();
      if (e.key === 'ArrowLeft' && i > 0) boxes[i - 1].focus();
      if (e.key === 'ArrowRight' && i < boxes.length - 1) boxes[i + 1].focus();
    });
    box.addEventListener('paste', (e) => {
      const text = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
      if (!text) return;
      e.preventDefault();
      text.slice(0, 8).split('').forEach((ch, k) => { if (boxes[k]) boxes[k].value = ch; });
      const next = Math.min(text.length, 8) - 1;
      if (boxes[next]) boxes[next].focus();
      if (text.length >= 8) submit();
    });
  });

  async function submit() {
    const pin = currentPin();
    if (pin.length !== 8) { setError('Entrez les 8 chiffres'); shake(); return; }
    submitBtn.disabled = true;
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Code incorrect');
        shake();
        clearBoxes(true);
        return;
      }
      if (data.created) sessionStorage.setItem('cv_justCreated', '1');
      window.location.href = '/';
    } catch {
      setError('Connexion impossible — réessayez');
      shake();
    } finally {
      submitBtn.disabled = false;
    }
  }

  form.addEventListener('submit', (e) => { e.preventDefault(); submit(); });
})();
