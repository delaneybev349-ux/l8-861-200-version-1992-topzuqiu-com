(function () {
  window.initMoviePlayer = function (playerId, source) {
    var player = document.getElementById(playerId);
    if (!player) {
      return;
    }
    var video = player.querySelector("video");
    var overlay = player.querySelector(".play-overlay");
    var button = player.querySelector(".big-play");
    var started = false;
    var hls = null;

    function attach() {
      if (!video || started) {
        return;
      }
      started = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function begin() {
      attach();
      if (overlay) {
        overlay.classList.add("hidden");
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {});
      }
    }

    if (button) {
      button.addEventListener("click", begin);
    }
    if (overlay) {
      overlay.addEventListener("click", begin);
    }
    if (video) {
      video.addEventListener("play", function () {
        if (overlay) {
          overlay.classList.add("hidden");
        }
      });
      video.addEventListener("click", function () {
        if (!started || video.paused) {
          begin();
        }
      });
    }
    window.addEventListener("beforeunload", function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
})();
