(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    var header = document.querySelector("[data-header]");
    var toggle = document.querySelector("[data-menu-toggle]");
    var panel = document.querySelector("[data-mobile-panel]");

    function refreshHeader() {
      if (!header) {
        return;
      }
      if (window.scrollY > 12) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }

    refreshHeader();
    window.addEventListener("scroll", refreshHeader, { passive: true });

    if (toggle && panel) {
      toggle.addEventListener("click", function () {
        panel.classList.toggle("open");
      });
    }

    document.querySelectorAll("[data-search-form]").forEach(function (form) {
      form.addEventListener("submit", function (event) {
        var input = form.querySelector("input[name='q']");
        if (!input || !input.value.trim()) {
          return;
        }
        event.preventDefault();
        window.location.href = "./search.html?q=" + encodeURIComponent(input.value.trim());
      });
    });

    var searchParams = new URLSearchParams(window.location.search);
    var initialQuery = searchParams.get("q") || "";
    var filterInput = document.querySelector("[data-filter-input]");
    if (filterInput && initialQuery) {
      filterInput.value = initialQuery;
    }

    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
    var resultNote = document.querySelector("[data-result-note]");
    var empty = document.querySelector("[data-empty]");
    var selects = Array.prototype.slice.call(document.querySelectorAll("[data-filter-select]"));
    var reset = document.querySelector("[data-filter-reset]");

    function normalize(value) {
      return String(value || "").toLowerCase().trim();
    }

    function matches(card, query, filters) {
      var text = [
        card.getAttribute("data-title"),
        card.getAttribute("data-region"),
        card.getAttribute("data-type"),
        card.getAttribute("data-year"),
        card.getAttribute("data-genre")
      ].join(" ").toLowerCase();
      if (query && text.indexOf(query) === -1) {
        return false;
      }
      return filters.every(function (item) {
        if (!item.value) {
          return true;
        }
        return normalize(card.getAttribute("data-" + item.key)).indexOf(normalize(item.value)) !== -1;
      });
    }

    function applyFilters() {
      if (!cards.length) {
        return;
      }
      var query = normalize(filterInput ? filterInput.value : "");
      var filters = selects.map(function (select) {
        return {
          key: select.getAttribute("data-filter-select"),
          value: select.value
        };
      });
      var shown = 0;
      cards.forEach(function (card) {
        var ok = matches(card, query, filters);
        card.style.display = ok ? "" : "none";
        if (ok) {
          shown += 1;
        }
      });
      if (resultNote) {
        resultNote.textContent = shown ? "已筛选出 " + shown + " 部影片" : "没有匹配的影片";
      }
      if (empty) {
        empty.classList.toggle("show", shown === 0);
      }
    }

    if (filterInput) {
      filterInput.addEventListener("input", applyFilters);
    }
    selects.forEach(function (select) {
      select.addEventListener("change", applyFilters);
    });
    if (reset) {
      reset.addEventListener("click", function () {
        if (filterInput) {
          filterInput.value = "";
        }
        selects.forEach(function (select) {
          select.value = "";
        });
        applyFilters();
      });
    }
    applyFilters();
  });
})();
