(function() {
    var body = document.body;
    var navToggle = document.querySelector("[data-nav-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");

    if (navToggle && mobileNav) {
        navToggle.addEventListener("click", function() {
            mobileNav.classList.toggle("is-open");
            body.classList.toggle("nav-open", mobileNav.classList.contains("is-open"));
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));

    if (slides.length > 1) {
        var activeIndex = 0;

        var setSlide = function(index) {
            activeIndex = index;

            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === activeIndex);
            });

            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === activeIndex);
            });
        };

        dots.forEach(function(dot, index) {
            dot.addEventListener("click", function() {
                setSlide(index);
            });
        });

        window.setInterval(function() {
            setSlide((activeIndex + 1) % slides.length);
        }, 5600);
    }

    var normalize = function(value) {
        return String(value || "").trim().toLowerCase();
    };

    var applyFilter = function(scope) {
        var input = scope.querySelector("[data-search-input]");
        var activeChip = scope.querySelector("[data-filter-value].is-active");
        var keyword = input ? normalize(input.value) : "";
        var filterValue = activeChip ? normalize(activeChip.getAttribute("data-filter-value")) : "";
        var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));
        var visible = 0;

        cards.forEach(function(card) {
            var haystack = normalize([
                card.getAttribute("data-title"),
                card.getAttribute("data-region"),
                card.getAttribute("data-year"),
                card.getAttribute("data-genre"),
                card.getAttribute("data-tags")
            ].join(" "));
            var keywordMatch = !keyword || haystack.indexOf(keyword) !== -1;
            var filterMatch = !filterValue || haystack.indexOf(filterValue) !== -1;
            var show = keywordMatch && filterMatch;

            card.style.display = show ? "" : "none";

            if (show) {
                visible += 1;
            }
        });

        var empty = scope.querySelector("[data-no-results]");

        if (empty) {
            empty.classList.toggle("is-visible", visible === 0);
        }
    };

    Array.prototype.slice.call(document.querySelectorAll("[data-search-scope]")).forEach(function(scope) {
        var input = scope.querySelector("[data-search-input]");

        if (input) {
            input.addEventListener("input", function() {
                applyFilter(scope);
            });
        }

        Array.prototype.slice.call(scope.querySelectorAll("[data-filter-value]")).forEach(function(button) {
            button.addEventListener("click", function() {
                Array.prototype.slice.call(scope.querySelectorAll("[data-filter-value]")).forEach(function(item) {
                    item.classList.remove("is-active");
                });

                button.classList.add("is-active");
                applyFilter(scope);
            });
        });
    });

    window.initPlayer = function(streamUrl) {
        var video = document.getElementById("videoPlayer");
        var layer = document.querySelector(".player-layer");
        var button = document.querySelector("[data-play-button]");
        var prepared = false;

        if (!video || !streamUrl) {
            return;
        }

        var prepare = function() {
            if (prepared) {
                return;
            }

            prepared = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });

                hls.loadSource(streamUrl);
                hls.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
        };

        var start = function() {
            prepare();

            if (layer) {
                layer.classList.add("is-hidden");
            }

            var playRequest = video.play();

            if (playRequest && playRequest.catch) {
                playRequest.catch(function() {});
            }
        };

        if (button) {
            button.addEventListener("click", start);
        }

        video.addEventListener("click", function() {
            if (video.paused) {
                start();
            }
        });
    };
})();
