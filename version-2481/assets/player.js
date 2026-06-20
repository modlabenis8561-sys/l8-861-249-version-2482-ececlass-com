(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var wrap = document.querySelector("[data-player]");
    if (!wrap) {
      return;
    }
    var video = wrap.querySelector("video");
    var layer = wrap.querySelector(".play-layer");
    if (!video) {
      return;
    }
    var stream = video.getAttribute("data-stream");
    var prepared = false;
    var hls = null;

    function prepare() {
      if (prepared || !stream) {
        return;
      }
      prepared = true;
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = stream;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(stream);
        hls.attachMedia(video);
      } else {
        video.src = stream;
      }
    }

    function play() {
      prepare();
      if (layer) {
        layer.classList.add("is-hidden");
      }
      video.controls = true;
      var action = video.play();
      if (action && action.catch) {
        action.catch(function () {
          if (layer) {
            layer.classList.remove("is-hidden");
          }
        });
      }
    }

    if (layer) {
      layer.addEventListener("click", play);
    }
    video.addEventListener("click", function () {
      if (video.paused) {
        play();
      }
    });
    window.addEventListener("pagehide", function () {
      if (hls) {
        hls.destroy();
      }
    });
  });
})();
