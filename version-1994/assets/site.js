(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileMenu = document.querySelector('[data-mobile-menu]');

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;

    function showHero(index) {
      if (!slides.length) return;
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showHero(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        showHero(current + 1);
      }, 5200);
    }
  }

  function normalize(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function applyFilters(scope) {
    var root = scope || document;
    var input = root.querySelector('[data-card-search]');
    var selects = Array.prototype.slice.call(root.querySelectorAll('[data-filter-field]'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    var query = normalize(input ? input.value : '');
    var visible = 0;

    cards.forEach(function (card) {
      var haystack = normalize(card.getAttribute('data-title'));
      var ok = !query || haystack.indexOf(query) !== -1;

      selects.forEach(function (select) {
        var field = select.getAttribute('data-filter-field');
        var value = normalize(select.value);
        var cardValue = normalize(card.getAttribute('data-' + field));
        if (value && cardValue !== value) {
          ok = false;
        }
      });

      card.style.display = ok ? '' : 'none';
      if (ok) visible += 1;
    });

    var empty = document.querySelector('[data-empty-state]');
    if (empty) {
      empty.classList.toggle('is-visible', visible === 0);
    }
  }

  var filterScopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));
  filterScopes.forEach(function (scope) {
    var input = scope.querySelector('[data-card-search]');
    var controls = Array.prototype.slice.call(scope.querySelectorAll('input, select'));
    controls.forEach(function (control) {
      control.addEventListener(control.tagName === 'SELECT' ? 'change' : 'input', function () {
        applyFilters(scope);
      });
    });

    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q && input) {
      input.value = q;
      applyFilters(scope);
    }
  });
})();
