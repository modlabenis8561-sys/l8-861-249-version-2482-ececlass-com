(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

    players.forEach(function (player) {
        var video = player.querySelector('video');
        var cover = player.querySelector('[data-cover]');
        var button = player.querySelector('[data-play-button]');
        var source = video ? video.getAttribute('data-video') : '';
        var loaded = false;
        var hls = null;

        function attachVideo() {
            if (!video || !source || loaded) {
                return;
            }

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }

            loaded = true;
        }

        function startPlay() {
            attachVideo();

            if (cover) {
                cover.classList.add('is-hidden');
            }

            if (video) {
                video.controls = true;
                var playResult = video.play();

                if (playResult && typeof playResult.catch === 'function') {
                    playResult.catch(function () {});
                }
            }
        }

        if (button) {
            button.addEventListener('click', startPlay);
        }

        if (cover) {
            cover.addEventListener('click', startPlay);
        }

        if (video) {
            video.addEventListener('play', function () {
                if (cover) {
                    cover.classList.add('is-hidden');
                }
            });
        }

        window.addEventListener('pagehide', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    });
})();
