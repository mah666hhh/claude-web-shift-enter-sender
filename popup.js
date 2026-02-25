const options = document.querySelectorAll('.option');
const radios = document.querySelectorAll('input[name="sendKey"]');
const saved = document.getElementById('saved');

function updateSelected(value) {
  options.forEach(opt => {
    opt.classList.toggle('selected', opt.dataset.value === value);
  });
}

// 設定を読み込み
chrome.storage.sync.get({ sendKey: 'shift' }, (data) => {
  const radio = document.querySelector(`input[value="${data.sendKey}"]`);
  if (radio) radio.checked = true;
  updateSelected(data.sendKey);
});

// 変更時に保存
radios.forEach(radio => {
  radio.addEventListener('change', () => {
    chrome.storage.sync.set({ sendKey: radio.value });
    updateSelected(radio.value);
    saved.classList.add('show');
    setTimeout(() => saved.classList.remove('show'), 1200);
  });
});
