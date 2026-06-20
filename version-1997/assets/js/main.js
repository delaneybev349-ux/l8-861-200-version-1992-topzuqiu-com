(function () {
  var header = document.querySelector('.site-header');
  var menuToggle = document.querySelector('.menu-toggle');
  var mobilePanel = document.querySelector('.mobile-panel');

  if (menuToggle && mobilePanel) {
    menuToggle.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  window.addEventListener('scroll', function () {
    if (!header) {
      return;
    }
    if (window.scrollY > 16) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  });

  var slider = document.querySelector('[data-hero-slider]');
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
    var current = 0;
    var timer = null;

    var showSlide = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    };

    var start = function () {
      if (timer || slides.length < 2) {
        return;
      }
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5600);
    };

    var stop = function () {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    };

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        stop();
        showSlide(index);
        start();
      });
    });

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    start();
  }

  var areas = Array.prototype.slice.call(document.querySelectorAll('[data-filter-area]'));
  areas.forEach(function (area) {
    var search = area.querySelector('[data-grid-search]');
    var buttons = Array.prototype.slice.call(area.querySelectorAll('[data-filter]'));
    var grid = document.querySelector('[data-movie-grid]');
    if (!grid) {
      return;
    }
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
    var currentFilter = 'all';

    var applyFilter = function () {
      var keyword = search ? search.value.trim().toLowerCase() : '';
      cards.forEach(function (card) {
        var category = card.getAttribute('data-category') || '';
        var haystack = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-tags') || ''
        ].join(' ').toLowerCase();
        var passCategory = currentFilter === 'all' || category === currentFilter;
        var passKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        card.classList.toggle('is-hidden', !(passCategory && passKeyword));
      });
    };

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        currentFilter = button.getAttribute('data-filter') || 'all';
        buttons.forEach(function (item) {
          item.classList.toggle('is-active', item === button);
        });
        applyFilter();
      });
    });

    if (search) {
      search.addEventListener('input', applyFilter);
    }
  });

  var backTop = document.querySelector('.back-top');
  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
