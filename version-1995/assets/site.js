(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  document.querySelectorAll('.poster-img, .hero-image').forEach(function (image) {
    image.addEventListener('error', function () {
      var holder = image.closest('.poster-frame, .hero-bg, .detail-backdrop, .category-thumbs, .category-cover');
      if (holder) {
        holder.classList.add('image-missing');
      }
      image.remove();
    });
  });

  var slider = document.querySelector('[data-hero-slider]');

  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === index);
      });
    }

    function startTimer() {
      stopTimer();
      timer = window.setInterval(function () {
        showSlide(index + 1);
      }, 5200);
    }

    function stopTimer() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        startTimer();
      });
    });

    slider.addEventListener('mouseenter', stopTimer);
    slider.addEventListener('mouseleave', startTimer);
    showSlide(0);
    startTimer();
  }

  var filterPanel = document.querySelector('[data-filter-panel]');
  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-movie-card]'));
  var emptyState = document.querySelector('[data-empty-state]');

  if (filterPanel && cards.length) {
    var searchInput = filterPanel.querySelector('[data-local-search]');
    var typeSelect = filterPanel.querySelector('[data-filter-type]');
    var yearSelect = filterPanel.querySelector('[data-filter-year]');
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';

    if (document.querySelector('[data-search-page]') && query && searchInput) {
      searchInput.value = query;
    }

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function matchesYear(cardYear, selectedYear) {
      if (!selectedYear) {
        return true;
      }

      if (selectedYear === '2020') {
        var numericYear = Number(cardYear);
        return Number.isFinite(numericYear) && numericYear <= 2020;
      }

      return cardYear.indexOf(selectedYear) !== -1;
    }

    function applyFilters() {
      var keyword = normalize(searchInput ? searchInput.value : '');
      var selectedType = normalize(typeSelect ? typeSelect.value : '');
      var selectedYear = normalize(yearSelect ? yearSelect.value : '');
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize(card.getAttribute('data-search'));
        var cardType = normalize(card.getAttribute('data-type'));
        var cardYear = normalize(card.getAttribute('data-year'));
        var ok = true;

        if (keyword && haystack.indexOf(keyword) === -1) {
          ok = false;
        }

        if (selectedType && cardType.indexOf(selectedType) === -1 && haystack.indexOf(selectedType) === -1) {
          ok = false;
        }

        if (!matchesYear(cardYear, selectedYear)) {
          ok = false;
        }

        card.classList.toggle('is-hidden', !ok);
        if (ok) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('show', visible === 0);
      }
    }

    [searchInput, typeSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    applyFilters();
  }
})();
