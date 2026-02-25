let dispatching = false;

// チャット入力欄（ProseMirror）
function isChatInput(el) {
  return el.closest('[data-testid="chat-input"], .ProseMirror');
}

// 編集フォームのtextarea
function isEditTextarea(el) {
  return el.tagName === 'TEXTAREA' && el.closest('form');
}

['keydown', 'keyup', 'keypress'].forEach(type => {
  document.addEventListener(type, (e) => {
    if (dispatching) return;
    if (e.key !== 'Enter') return;

    const el = e.target;
    const inChat = isChatInput(el);
    const inEdit = isEditTextarea(el);
    if (!inChat && !inEdit) return;

    if (e.isComposing) {
      e.stopImmediatePropagation();
      return;
    }

    e.preventDefault();
    e.stopImmediatePropagation();

    if (type !== 'keydown') return;

    if (e.shiftKey) {
      // Shift+Enter → 送信
      if (inChat) {
        const sendBtn = document.querySelector('button[aria-label="メッセージを送信"]');
        if (sendBtn && !sendBtn.disabled) sendBtn.click();
      } else {
        const form = el.closest('form');
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn && !submitBtn.disabled) submitBtn.click();
      }
    } else {
      // Enter → 改行
      if (inChat) {
        dispatching = true;
        el.dispatchEvent(new KeyboardEvent('keydown', {
          key: 'Enter', code: 'Enter', keyCode: 13,
          shiftKey: true, bubbles: true, cancelable: true
        }));
        dispatching = false;
      } else {
        // textareaは直接改行を挿入
        const start = el.selectionStart;
        el.value = el.value.slice(0, start) + '\n' + el.value.slice(el.selectionEnd);
        el.selectionStart = el.selectionEnd = start + 1;
        el.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  }, true);
});

document.addEventListener('beforeinput', (e) => {
  if (!isChatInput(e.target)) return;
  if (e.inputType === 'insertParagraph') {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
}, true);
