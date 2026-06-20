import { H as Hls } from './video-dru42stk.js';

document.querySelectorAll('[data-video-player]').forEach(function (shell) {
  var video = shell.querySelector('video');
  var startButton = shell.querySelector('[data-video-start]');
  var message = shell.querySelector('[data-video-message]');
  var source = shell.getAttribute('data-video-src');
  var hlsInstance = null;
  var isReady = false;

  function showMessage(text) {
    if (!message) {
      return;
    }

    message.textContent = text;
    message.classList.add('show');
    window.setTimeout(function () {
      message.classList.remove('show');
    }, 4200);
  }

  function attachSource() {
    if (isReady || !video || !source) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      isReady = true;
      return;
    }

    if (Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      isReady = true;
      return;
    }

    video.src = source;
    isReady = true;
  }

  function startPlayback() {
    attachSource();
    shell.classList.add('is-playing');

    var playPromise = video.play();

    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        showMessage('浏览器阻止了自动播放，请再次点击播放器上的播放按钮。');
      });
    }
  }

  if (startButton) {
    startButton.addEventListener('click', startPlayback);
  }

  if (video) {
    video.addEventListener('play', function () {
      shell.classList.add('is-playing');
    });

    video.addEventListener('error', function () {
      showMessage('当前播放源暂时无法加载，请稍后重试或切换网络环境。');
    });
  }

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
});
