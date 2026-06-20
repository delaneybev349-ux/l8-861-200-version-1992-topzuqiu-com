(function () {
  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
      return;
    }
    document.addEventListener("DOMContentLoaded", callback);
  }

  ready(function () {
    var toggle = document.querySelector(".menu-toggle");
    var panel = document.querySelector(".mobile-panel");
    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        var open = panel.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var current = 0;
      var timer = null;

      function show(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("is-active", i === current);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("is-active", i === current);
        });
      }

      function play() {
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5200);
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          window.clearInterval(timer);
          show(Number(dot.getAttribute("data-hero-dot")) || 0);
          play();
        });
      });

      if (slides.length > 1) {
        play();
      }
    }

    var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
    scopes.forEach(function (scope) {
      var input = scope.querySelector("[data-filter-input]");
      var sortSelect = scope.querySelector("[data-sort-select]");
      var list = scope.querySelector("[data-card-list]");
      var cards = list ? Array.prototype.slice.call(list.querySelectorAll(".movie-card")) : [];
      var category = "all";

      if (!list || cards.length === 0) {
        return;
      }

      var params = new URLSearchParams(window.location.search);
      var initialQuery = params.get("q");
      if (initialQuery && input) {
        input.value = initialQuery;
      }

      function apply() {
        var text = input ? input.value.trim().toLowerCase() : "";
        cards.forEach(function (card) {
          var searchable = (card.getAttribute("data-search") || "").toLowerCase();
          var cardCategory = card.getAttribute("data-category") || "";
          var matchText = !text || searchable.indexOf(text) !== -1;
          var matchCategory = category === "all" || category === cardCategory;
          card.classList.toggle("is-hidden", !(matchText && matchCategory));
        });
      }

      function sortCards(mode) {
        var sorted = cards.slice();
        if (mode === "views") {
          sorted.sort(function (a, b) {
            return Number(b.getAttribute("data-views") || 0) - Number(a.getAttribute("data-views") || 0);
          });
        }
        if (mode === "year") {
          sorted.sort(function (a, b) {
            return Number(b.getAttribute("data-year") || 0) - Number(a.getAttribute("data-year") || 0);
          });
        }
        sorted.forEach(function (card) {
          list.appendChild(card);
        });
        cards = sorted;
      }

      if (input) {
        input.addEventListener("input", apply);
      }

      if (sortSelect) {
        sortSelect.addEventListener("change", function () {
          sortCards(sortSelect.value);
          apply();
        });
      }

      scope.querySelectorAll("[data-filter-category]").forEach(function (button) {
        button.addEventListener("click", function () {
          category = button.getAttribute("data-filter-category") || "all";
          scope.querySelectorAll("[data-filter-category]").forEach(function (item) {
            item.classList.toggle("is-active", item === button);
          });
          apply();
        });
      });

      apply();
    });
  });
})();
