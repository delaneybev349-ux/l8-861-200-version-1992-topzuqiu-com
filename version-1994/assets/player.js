import { H as Hls } from './hls-module.js';

document.querySelectorAll('.player-shell').forEach(function (shell) {
  var video = shell.querySelector('.js-player');
  var cover = shell.querySelector('.js-player-cover');
  var url = shell.getAttribute('data-video');
  var ready = false;
  var hls = null;

  function loadAndPlay() {
    if (!video || !url) return;

    if (!ready) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else if (Hls && Hls.isSupported()) {
        hls = new Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(url);
        hls.attachMedia(video);
      } else {
        video.src = url;
      }
      ready = true;
    }

    if (cover) {
      cover.classList.add('is-hidden');
    }

    video.controls = true;
    var playTask = video.play();
    if (playTask && typeof playTask.catch === 'function') {
      playTask.catch(function () {});
    }
  }

  if (cover) {
    cover.addEventListener('click', loadAndPlay);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (!ready) {
        loadAndPlay();
      }
    });
    video.addEventListener('error', function () {
      if (hls) {
        hls.destroy();
        hls = null;
        ready = false;
      }
    });
  }
});
