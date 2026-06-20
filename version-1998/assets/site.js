(function() {
  var menuButton = document.querySelector('.mobile-menu-button');
  var navMenu = document.querySelector('.nav-menu');

  if (menuButton && navMenu) {
    menuButton.addEventListener('click', function() {
      var isOpen = navMenu.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });
  }

  document.querySelectorAll('.site-search-form').forEach(function(form) {
    form.addEventListener('submit', function(event) {
      var input = form.querySelector('input[name="q"]');
      if (!input || !input.value.trim()) {
        event.preventDefault();
        return;
      }
    });
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
  var currentSlide = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach(function(slide, slideIndex) {
      slide.classList.toggle('is-active', slideIndex === currentSlide);
    });
    dots.forEach(function(dot, dotIndex) {
      dot.classList.toggle('is-active', dotIndex === currentSlide);
    });
  }

  function startSlider() {
    if (slides.length < 2) {
      return;
    }
    timer = window.setInterval(function() {
      showSlide(currentSlide + 1);
    }, 5200);
  }

  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      window.clearInterval(timer);
      showSlide(Number(dot.getAttribute('data-slide') || 0));
      startSlider();
    });
  });

  startSlider();

  document.querySelectorAll('.filter-bar').forEach(function(bar) {
    var buttons = Array.prototype.slice.call(bar.querySelectorAll('.filter-btn'));
    var grid = bar.parentElement.querySelector('.filter-grid');
    if (!grid) {
      return;
    }
    var cards = Array.prototype.slice.call(grid.querySelectorAll('.movie-card'));
    buttons.forEach(function(button) {
      button.addEventListener('click', function() {
        var filter = button.getAttribute('data-filter') || 'all';
        buttons.forEach(function(item) {
          item.classList.toggle('is-active', item === button);
        });
        cards.forEach(function(card) {
          var haystack = card.getAttribute('data-tags') || '';
          var visible = filter === 'all' || haystack.indexOf(filter) !== -1;
          card.classList.toggle('is-hidden', !visible);
        });
      });
    });
  });

  function createResultCard(movie) {
    var tags = movie.tags.slice(0, 3).map(function(tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');
    return [
      '<article class="movie-card">',
      '<a class="movie-cover" href="' + escapeHtml(movie.file) + '" aria-label="观看' + escapeHtml(movie.title) + '">',
      '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '<span class="movie-type">' + escapeHtml(movie.type) + '</span>',
      '</a>',
      '<div class="movie-card-body">',
      '<a class="movie-title" href="' + escapeHtml(movie.file) + '">' + escapeHtml(movie.title) + '</a>',
      '<p>' + escapeHtml(movie.oneLine) + '</p>',
      '<div class="movie-meta">',
      '<span>' + escapeHtml(movie.region) + '</span>',
      '<span>' + escapeHtml(movie.year) + '</span>',
      '<span>' + escapeHtml(movie.genre) + '</span>',
      '</div>',
      '<div class="movie-tags">' + tags + '</div>',
      '</div>',
      '</article>'
    ].join('');
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function(character) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[character];
    });
  }

  var searchGrid = document.querySelector('.search-results');
  if (searchGrid && typeof MOVIE_SEARCH_INDEX !== 'undefined') {
    var status = document.querySelector('.search-status');
    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim();
    var searchInput = document.querySelector('.search-page-form input[name="q"]');
    if (searchInput) {
      searchInput.value = query;
    }
    if (query) {
      var lowered = query.toLowerCase();
      var results = MOVIE_SEARCH_INDEX.filter(function(movie) {
        return movie.searchText.toLowerCase().indexOf(lowered) !== -1;
      }).slice(0, 80);
      searchGrid.innerHTML = results.map(createResultCard).join('');
      if (status) {
        status.textContent = results.length ? '为你找到以下匹配影片。' : '没有找到匹配影片，请尝试更换关键词。';
      }
    }
  }
})();
