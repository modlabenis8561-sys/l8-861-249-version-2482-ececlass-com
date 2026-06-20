(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var carousel = document.querySelector('[data-hero-carousel]');

    if (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        function startTimer() {
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 4800);
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                if (timer) {
                    window.clearInterval(timer);
                }
                showSlide(index);
                startTimer();
            });
        });

        startTimer();
    }

    function normalize(value) {
        return String(value || '').toLowerCase().replace(/\s+/g, '');
    }

    function applyUrlQuery() {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');
        var input = document.querySelector('[data-filter-input]');

        if (query && input) {
            input.value = query;
            input.dispatchEvent(new Event('input'));
        }
    }

    var filterForms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-form]'));

    filterForms.forEach(function (form) {
        var input = form.querySelector('[data-filter-input]');
        var genreSelect = form.querySelector('[data-genre-filter]');
        var regionSelect = form.querySelector('[data-region-filter]');
        var typeSelect = form.querySelector('[data-type-filter]');
        var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));

        function matches(card) {
            var keyword = normalize(input ? input.value : '');
            var genre = normalize(genreSelect ? genreSelect.value : '');
            var region = normalize(regionSelect ? regionSelect.value : '');
            var type = normalize(typeSelect ? typeSelect.value : '');
            var haystack = normalize([
                card.getAttribute('data-title'),
                card.getAttribute('data-region'),
                card.getAttribute('data-type'),
                card.getAttribute('data-year'),
                card.getAttribute('data-genre'),
                card.getAttribute('data-category'),
                card.textContent
            ].join(' '));

            if (keyword && haystack.indexOf(keyword) === -1) {
                return false;
            }

            if (genre && haystack.indexOf(genre) === -1) {
                return false;
            }

            if (region && normalize(card.getAttribute('data-region')).indexOf(region) === -1) {
                return false;
            }

            if (type && normalize(card.getAttribute('data-type')).indexOf(type) === -1) {
                return false;
            }

            return true;
        }

        function applyFilter() {
            cards.forEach(function (card) {
                card.classList.toggle('is-hidden', !matches(card));
            });
        }

        [input, genreSelect, regionSelect, typeSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilter);
                control.addEventListener('change', applyFilter);
            }
        });
    });

    applyUrlQuery();

    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

    players.forEach(function (panel) {
        var video = panel.querySelector('video');
        var playButton = panel.querySelector('[data-play-button]');
        var stream = panel.getAttribute('data-stream');
        var started = false;
        var hlsInstance = null;

        function beginPlayback() {
            if (!video || !stream) {
                return;
            }

            if (!started) {
                started = true;
                panel.classList.add('is-playing');
                video.controls = true;

                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = stream;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(stream);
                    hlsInstance.attachMedia(video);
                    video._hls = hlsInstance;
                } else {
                    video.src = stream;
                }
            }

            var playTask = video.play();

            if (playTask && typeof playTask.catch === 'function') {
                playTask.catch(function () {});
            }
        }

        if (playButton) {
            playButton.addEventListener('click', beginPlayback);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (!started || video.paused) {
                    beginPlayback();
                }
            });
        }
    });
})();
