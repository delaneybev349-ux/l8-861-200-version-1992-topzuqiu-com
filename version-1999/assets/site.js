(function () {
    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function initMenu() {
        var button = document.querySelector('[data-menu-toggle]');
        var menu = document.querySelector('[data-mobile-menu]');
        if (!button || !menu) {
            return;
        }
        button.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    function initHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = selectAll('[data-hero-slide]', hero);
        var dots = selectAll('[data-hero-dot]', hero);
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === index);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === index);
            });
        }

        function start() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, i) {
            dot.addEventListener('click', function () {
                show(i);
                start();
            });
        });
        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }
        show(0);
        start();
    }

    function normalize(text) {
        return String(text || '').toLowerCase().replace(/\s+/g, '');
    }

    function initSearch() {
        selectAll('[data-live-search]').forEach(function (input) {
            var target = document.querySelector(input.getAttribute('data-target'));
            if (!target) {
                return;
            }
            var cards = selectAll('[data-card]', target);
            input.addEventListener('input', function () {
                var keyword = normalize(input.value);
                cards.forEach(function (card) {
                    var haystack = normalize(card.getAttribute('data-search'));
                    card.classList.toggle('hide-card', keyword && haystack.indexOf(keyword) === -1);
                });
            });
        });
    }

    function initPlayers() {
        selectAll('[data-player]').forEach(function (player) {
            var video = player.querySelector('video');
            var overlay = player.querySelector('[data-play-overlay]');
            if (!video) {
                return;
            }
            var stream = video.getAttribute('data-stream');
            if (stream) {
                if (window.Hls && window.Hls.isSupported() && stream.indexOf('.m3u8') !== -1) {
                    var hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                    player.hlsInstance = hls;
                } else {
                    video.src = stream;
                }
            }

            function hideOverlay() {
                if (overlay) {
                    overlay.classList.add('is-hidden');
                }
            }

            function showOverlay() {
                if (overlay && video.paused) {
                    overlay.classList.remove('is-hidden');
                }
            }

            function playVideo() {
                var pending = video.play();
                hideOverlay();
                if (pending && typeof pending.catch === 'function') {
                    pending.catch(function () {
                        showOverlay();
                    });
                }
            }

            if (overlay) {
                overlay.addEventListener('click', function () {
                    playVideo();
                });
            }
            video.addEventListener('play', hideOverlay);
            video.addEventListener('pause', showOverlay);
            video.addEventListener('ended', showOverlay);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMenu();
        initHero();
        initSearch();
        initPlayers();
    });
})();
