(function () {
  var params = new URLSearchParams(window.location.search);
  var keyword = (params.get('q') || '').trim();
  var input = document.getElementById('searchInput');
  var title = document.getElementById('searchTitle');
  var results = document.getElementById('searchResults');

  if (input) {
    input.value = keyword;
  }

  var renderCard = function (movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return [
      '<article class="movie-card movie-card-compact">',
      '<a class="poster-frame" href="' + escapeHtml(movie.url) + '" aria-label="' + escapeHtml(movie.title) + '">',
      '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy" decoding="async" onerror="this.style.display=\'none\'">',
      '<span class="card-category">' + escapeHtml(movie.category) + '</span>',
      '</a>',
      '<div class="card-body">',
      '<h3><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h3>',
      '<p>' + escapeHtml(movie.oneLine) + '</p>',
      '<div class="meta-line"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
      '<div class="tag-row">' + tags + '</div>',
      '</div>',
      '</article>'
    ].join('');
  };

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }

  if (!results) {
    return;
  }

  var list = Array.isArray(window.MOVIE_SEARCH_INDEX) ? window.MOVIE_SEARCH_INDEX : MOVIE_SEARCH_INDEX;
  var normalized = keyword.toLowerCase();
  var matches = normalized ? list.filter(function (movie) {
    var haystack = [
      movie.title,
      movie.category,
      movie.year,
      movie.region,
      movie.type,
      movie.genre,
      (movie.tags || []).join(' '),
      movie.oneLine
    ].join(' ').toLowerCase();
    return haystack.indexOf(normalized) !== -1;
  }) : list.slice(0, 60);

  if (title) {
    title.textContent = keyword ? '与“' + keyword + '”相关' : '热门影片';
  }

  results.innerHTML = matches.slice(0, 120).map(renderCard).join('');
})();
