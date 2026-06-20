document.addEventListener("DOMContentLoaded", function() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".site-nav");

    if (toggle && nav) {
        toggle.addEventListener("click", function() {
            var open = nav.classList.toggle("open");
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
        });
    }

    var hero = document.querySelector("[data-hero-slider]");
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var prev = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var active = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            active = (index + slides.length) % slides.length;
            slides.forEach(function(slide, i) {
                slide.classList.toggle("active", i === active);
            });
            dots.forEach(function(dot, i) {
                dot.classList.toggle("active", i === active);
            });
        }

        function schedule() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function() {
                showSlide(active + 1);
            }, 5200);
        }

        dots.forEach(function(dot) {
            dot.addEventListener("click", function() {
                showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
                schedule();
            });
        });

        if (prev) {
            prev.addEventListener("click", function() {
                showSlide(active - 1);
                schedule();
            });
        }

        if (next) {
            next.addEventListener("click", function() {
                showSlide(active + 1);
                schedule();
            });
        }

        showSlide(0);
        schedule();
    }

    document.querySelectorAll("[data-filter-scope]").forEach(function(scope) {
        var input = scope.querySelector("[data-filter-input]");
        var typeSelect = scope.querySelector("[data-type-filter]");
        var sortSelect = scope.querySelector("[data-sort-filter]");
        var grid = scope.querySelector(".filter-grid");
        var empty = scope.querySelector("[data-empty-state]");
        var cards = Array.prototype.slice.call(scope.querySelectorAll(".searchable-card"));

        cards.forEach(function(card, index) {
            card.setAttribute("data-original-index", String(index));
        });

        if (scope.hasAttribute("data-url-search") && input) {
            var params = new URLSearchParams(window.location.search);
            var query = params.get("q");
            if (query) {
                input.value = query;
            }
        }

        function getCardText(card) {
            return [
                card.getAttribute("data-search") || "",
                card.getAttribute("data-title") || "",
                card.getAttribute("data-region") || "",
                card.getAttribute("data-type") || ""
            ].join(" ").toLowerCase();
        }

        function applyFilters() {
            var term = input ? input.value.trim().toLowerCase() : "";
            var selectedType = typeSelect ? typeSelect.value : "";
            var visible = 0;

            cards.forEach(function(card) {
                var text = getCardText(card);
                var type = card.getAttribute("data-type") || "";
                var ok = (!term || text.indexOf(term) !== -1) && (!selectedType || type === selectedType);
                card.hidden = !ok;
                if (ok) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        function applySort() {
            if (!grid || !sortSelect) {
                return;
            }
            var value = sortSelect.value;
            var sorted = cards.slice().sort(function(a, b) {
                if (value === "year-desc") {
                    return Number(b.getAttribute("data-year") || 0) - Number(a.getAttribute("data-year") || 0);
                }
                if (value === "year-asc") {
                    return Number(a.getAttribute("data-year") || 0) - Number(b.getAttribute("data-year") || 0);
                }
                if (value === "title-asc") {
                    return (a.getAttribute("data-title") || "").localeCompare(b.getAttribute("data-title") || "", "zh-Hans-CN");
                }
                return Number(a.getAttribute("data-original-index") || 0) - Number(b.getAttribute("data-original-index") || 0);
            });
            sorted.forEach(function(card) {
                grid.appendChild(card);
            });
        }

        if (input) {
            input.addEventListener("input", applyFilters);
        }
        if (typeSelect) {
            typeSelect.addEventListener("change", applyFilters);
        }
        if (sortSelect) {
            sortSelect.addEventListener("change", function() {
                applySort();
                applyFilters();
            });
        }
        applySort();
        applyFilters();
    });
});
