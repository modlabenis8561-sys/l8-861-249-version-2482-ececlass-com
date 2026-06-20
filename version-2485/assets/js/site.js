(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero-slider]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var activeIndex = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, currentIndex) {
        slide.classList.toggle('is-active', currentIndex === activeIndex);
      });
      dots.forEach(function (dot, currentIndex) {
        dot.classList.toggle('is-active', currentIndex === activeIndex);
      });
    }

    function schedule() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(activeIndex + 1);
      }, 6200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        schedule();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(activeIndex - 1);
        schedule();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(activeIndex + 1);
        schedule();
      });
    }

    schedule();
  }

  var filterInput = document.querySelector('[data-filter-input]');
  var filterList = document.querySelector('[data-filter-list]');
  var chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter-category]'));

  if (filterInput && filterList) {
    var cards = Array.prototype.slice.call(filterList.querySelectorAll('[data-filter-text]'));
    var params = new URLSearchParams(window.location.search);
    var initialSearch = params.get('search') || '';
    var activeCategory = 'all';

    if (initialSearch) {
      filterInput.value = initialSearch;
    }

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function applyFilter() {
      var query = normalize(filterInput.value);
      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-filter-text'));
        var category = card.getAttribute('data-category') || '';
        var matchText = !query || text.indexOf(query) !== -1;
        var matchCategory = activeCategory === 'all' || category === activeCategory;
        card.classList.toggle('is-hidden', !(matchText && matchCategory));
      });
    }

    filterInput.addEventListener('input', applyFilter);

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        activeCategory = chip.getAttribute('data-filter-category') || 'all';
        chips.forEach(function (item) {
          item.classList.toggle('is-active', item === chip);
        });
        applyFilter();
      });
    });

    applyFilter();
  }
})();
