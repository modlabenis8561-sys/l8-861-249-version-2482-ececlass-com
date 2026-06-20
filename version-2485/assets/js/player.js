import { H as Hls } from './hls-bbsaiqh1.js';

function setupPlayer(root) {
  var video = root.querySelector('video[data-src]');
  var button = root.querySelector('[data-play-button]');

  if (!video) {
    return;
  }

  var source = video.getAttribute('data-src');
  var hls = null;
  var loaded = false;

  function loadSource() {
    if (loaded || !source) {
      return;
    }

    loaded = true;

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(source);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, function (event, data) {
        if (!data || !data.fatal) {
          return;
        }

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
          return;
        }

        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
          return;
        }

        hls.destroy();
      });
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    }
  }

  function playVideo() {
    loadSource();
    var promise = video.play();

    if (promise && typeof promise.catch === 'function') {
      promise.catch(function () {});
    }
  }

  loadSource();

  if (button) {
    button.addEventListener('click', playVideo);
  }

  video.addEventListener('play', function () {
    if (button) {
      button.classList.add('is-hidden');
    }
  });

  video.addEventListener('pause', function () {
    if (button && video.currentTime === 0) {
      button.classList.remove('is-hidden');
    }
  });

  window.addEventListener('pagehide', function () {
    if (hls) {
      hls.destroy();
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {
  Array.prototype.slice.call(document.querySelectorAll('[data-player]')).forEach(setupPlayer);
});
