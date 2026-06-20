(function () {
  function createMoviePlayer(mediaUrl) {
    var player = document.querySelector("[data-player]");
    var video = document.querySelector("[data-player-video]");
    var start = document.querySelector("[data-player-start]");
    var attached = false;
    var hlsInstance = null;

    if (!player || !video || !start || !mediaUrl) {
      return;
    }

    function attachMedia() {
      if (attached) {
        return;
      }
      attached = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = mediaUrl;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(mediaUrl);
        hlsInstance.attachMedia(video);
        return;
      }

      video.src = mediaUrl;
    }

    function startPlayback() {
      attachMedia();
      start.classList.add("is-hidden");
      video.setAttribute("controls", "controls");
      var playResult = video.play();
      if (playResult && typeof playResult.catch === "function") {
        playResult.catch(function () {
          start.classList.remove("is-hidden");
        });
      }
    }

    start.addEventListener("click", startPlayback);
    video.addEventListener("click", function () {
      if (video.paused) {
        startPlayback();
      } else {
        video.pause();
      }
    });
    video.addEventListener("play", function () {
      start.classList.add("is-hidden");
    });
    video.addEventListener("pause", function () {
      if (!video.ended) {
        start.classList.remove("is-hidden");
      }
    });
    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  window.createMoviePlayer = createMoviePlayer;
})();
