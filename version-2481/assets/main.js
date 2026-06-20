(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var toggle = document.querySelector(".menu-toggle");
    var mobileNav = document.querySelector(".mobile-nav");
    if (toggle && mobileNav) {
      toggle.addEventListener("click", function () {
        var opened = mobileNav.hasAttribute("hidden");
        if (opened) {
          mobileNav.removeAttribute("hidden");
        } else {
          mobileNav.setAttribute("hidden", "");
        }
        toggle.setAttribute("aria-expanded", String(opened));
      });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var index = 0;
      var timer = null;
      function show(next) {
        if (!slides.length) {
          return;
        }
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === index);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === index);
        });
      }
      function start() {
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5200);
      }
      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          window.clearInterval(timer);
          show(Number(dot.getAttribute("data-hero-dot")) || 0);
          start();
        });
      });
      start();
    }

    var localSearch = document.querySelector(".js-local-search");
    var grid = document.querySelector(".searchable-grid");
    if (localSearch && grid) {
      var cards = Array.prototype.slice.call(grid.querySelectorAll(".movie-card"));
      localSearch.addEventListener("input", function () {
        var query = localSearch.value.trim().toLowerCase();
        cards.forEach(function (card) {
          var text = card.getAttribute("data-filter-index") || "";
          card.classList.toggle("is-filtered-out", query.length > 0 && text.indexOf(query) === -1);
        });
      });
    }
  });
})();
