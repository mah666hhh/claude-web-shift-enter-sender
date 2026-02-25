const radios = document.querySelectorAll('input[name="sendKey"]');
const saved = document.getElementById('saved');

// 設定を読み込み
chrome.storage.sync.get({ sendKey: 'shift' }, (data) => {
  const radio = document.querySelector(`input[value="${data.sendKey}"]`);
  if (radio) radio.checked = true;
});

// 変更時に保存
radios.forEach(radio => {
  radio.addEventListener('change', () => {
    chrome.storage.sync.set({ sendKey: radio.value });
    saved.classList.add('show');
    setTimeout(() => saved.classList.remove('show'), 1200);
  });
});
