function setupMobileNavigation() {
  const toggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-main-nav]');

  if (!toggle || !nav) {
    return;
  }

  toggle.addEventListener('click', () => {
    nav.classList.toggle('is-open');
  });
}

function setupHeroCarousel() {
  const carousel = document.querySelector('[data-hero-carousel]');

  if (!carousel) {
    return;
  }

  const slides = Array.from(carousel.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(carousel.querySelectorAll('[data-hero-dot]'));
  const prev = carousel.querySelector('[data-hero-prev]');
  const next = carousel.querySelector('[data-hero-next]');
  let index = 0;
  let timer = null;

  function showSlide(nextIndex) {
    if (slides.length === 0) {
      return;
    }

    index = (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle('active', slideIndex === index);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === index);
    });
  }

  function startTimer() {
    stopTimer();
    timer = window.setInterval(() => showSlide(index + 1), 5000);
  }

  function stopTimer() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      showSlide(Number(dot.dataset.heroDot || '0'));
      startTimer();
    });
  });

  if (prev) {
    prev.addEventListener('click', () => {
      showSlide(index - 1);
      startTimer();
    });
  }

  if (next) {
    next.addEventListener('click', () => {
      showSlide(index + 1);
      startTimer();
    });
  }

  carousel.addEventListener('mouseenter', stopTimer);
  carousel.addEventListener('mouseleave', startTimer);

  showSlide(0);
  startTimer();
}

function normalizedText(value) {
  return String(value || '').trim().toLowerCase();
}

function setupFilters() {
  const scopes = document.querySelectorAll('.filter-scope');

  scopes.forEach((scope) => {
    const input = scope.querySelector('[data-search-input]');
    const yearSelect = scope.querySelector('[data-year-filter]');
    const categoryButtons = Array.from(scope.querySelectorAll('[data-category-filter]'));
    const cards = Array.from(scope.querySelectorAll('[data-movie-card]'));
    const emptyState = scope.querySelector('[data-empty-state]');
    let activeCategory = 'all';

    if (scope.hasAttribute('data-query-from-url') && input) {
      const params = new URLSearchParams(window.location.search);
      const query = params.get('q');

      if (query) {
        input.value = query;
      }
    }

    function matchesYear(card, selectedYear) {
      if (!selectedYear || selectedYear === 'all') {
        return true;
      }

      const year = Number(card.dataset.year || '0');

      if (selectedYear === '2020') {
        return year <= 2020;
      }

      return String(year) === selectedYear;
    }

    function applyFilters() {
      const query = normalizedText(input ? input.value : '');
      const selectedYear = yearSelect ? yearSelect.value : 'all';
      let visibleCount = 0;

      cards.forEach((card) => {
        const haystack = normalizedText([
          card.dataset.title,
          card.dataset.category,
          card.dataset.year,
          card.dataset.genre,
          card.dataset.tags
        ].join(' '));
        const categoryMatches = activeCategory === 'all' || card.dataset.categorySlug === activeCategory;
        const queryMatches = !query || haystack.includes(query);
        const yearMatches = matchesYear(card, selectedYear);
        const isVisible = categoryMatches && queryMatches && yearMatches;

        card.hidden = !isVisible;

        if (isVisible) {
          visibleCount += 1;
        }
      });

      if (emptyState) {
        emptyState.hidden = visibleCount !== 0;
      }
    }

    if (input) {
      input.addEventListener('input', applyFilters);
    }

    if (yearSelect) {
      yearSelect.addEventListener('change', applyFilters);
    }

    categoryButtons.forEach((button) => {
      button.addEventListener('click', () => {
        activeCategory = button.dataset.categoryFilter || 'all';
        categoryButtons.forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        applyFilters();
      });
    });

    applyFilters();
  });
}

function setupGlobalSearchForms() {
  const forms = document.querySelectorAll('[data-global-search-form]');

  forms.forEach((form) => {
    form.addEventListener('submit', (event) => {
      const input = form.querySelector('input[name="q"]');

      if (!input) {
        return;
      }

      const query = input.value.trim();

      if (!query) {
        event.preventDefault();
        window.location.href = form.getAttribute('action') || 'search.html';
      }
    });
  });
}

async function attachVideoSource(video) {
  if (!video || video.dataset.ready === 'true') {
    return;
  }

  const source = video.dataset.videoSrc;

  if (!source) {
    return;
  }

  if (source.includes('.m3u8')) {
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else {
      try {
        const module = await import('./hls-vendor-dru42stk.js');
        const Hls = module.H || module.default || window.Hls;

        if (Hls && Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true
          });

          hls.loadSource(source);
          hls.attachMedia(video);
          hls.on(Hls.Events.ERROR, (event, data) => {
            if (!data || !data.fatal) {
              return;
            }

            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
              hls.startLoad();
              return;
            }

            if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError();
              return;
            }

            hls.destroy();
            video.src = 'https://vjs.zencdn.net/v/oceans.mp4';
          });
          video._hlsInstance = hls;
        } else {
          video.src = source;
        }
      } catch (error) {
        console.error('HLS 初始化失败，尝试使用原始播放地址。', error);
        video.src = source;
      }
    }
  } else {
    video.src = source;
  }

  video.dataset.ready = 'true';
}

function setupPlayers() {
  const shells = document.querySelectorAll('[data-player]');

  shells.forEach((shell) => {
    const video = shell.querySelector('video');
    const overlay = shell.querySelector('[data-player-overlay]');

    if (!video) {
      return;
    }

    attachVideoSource(video);

    if (overlay) {
      overlay.addEventListener('click', async () => {
        await attachVideoSource(video);

        try {
          await video.play();
        } catch (error) {
          console.error('视频播放被浏览器拦截或源暂不可用。', error);
        }
      });
    }

    video.addEventListener('play', () => {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });

    video.addEventListener('pause', () => {
      if (overlay && video.currentTime === 0) {
        overlay.classList.remove('is-hidden');
      }
    });

    video.addEventListener('ended', () => {
      if (overlay) {
        overlay.classList.remove('is-hidden');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupMobileNavigation();
  setupHeroCarousel();
  setupFilters();
  setupGlobalSearchForms();
  setupPlayers();
});
