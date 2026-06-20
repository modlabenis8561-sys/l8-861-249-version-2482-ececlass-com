(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileNav = document.querySelector("[data-mobile-nav]");
    if (menuButton && mobileNav) {
      menuButton.addEventListener("click", function () {
        mobileNav.classList.toggle("is-open");
      });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var index = 0;
      var timer = null;
      var show = function (nextIndex) {
        if (!slides.length) {
          return;
        }
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach(function (slide, current) {
          slide.classList.toggle("is-active", current === index);
        });
        dots.forEach(function (dot, current) {
          dot.classList.toggle("is-active", current === index);
        });
      };
      var start = function () {
        timer = window.setInterval(function () {
          show(index + 1);
        }, 5200);
      };
      dots.forEach(function (dot, current) {
        dot.addEventListener("click", function () {
          window.clearInterval(timer);
          show(current);
          start();
        });
      });
      show(0);
      start();
    }

    var redirectForms = Array.prototype.slice.call(document.querySelectorAll("[data-site-search]"));
    redirectForms.forEach(function (form) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var input = form.querySelector("input");
        var query = input ? input.value.trim() : "";
        if (query) {
          window.location.href = "./all-movies.html?q=" + encodeURIComponent(query);
        } else {
          window.location.href = "./all-movies.html";
        }
      });
    });

    var searchInput = document.querySelector("[data-search-input]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
    var chips = Array.prototype.slice.call(document.querySelectorAll("[data-filter-chip]"));
    var empty = document.querySelector("[data-empty-state]");
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q") || "";
    var activeFilter = "all";

    function applyFilters() {
      var query = normalize(searchInput ? searchInput.value : "");
      var visible = 0;
      cards.forEach(function (card) {
        var text = normalize(card.getAttribute("data-title") + " " + card.getAttribute("data-genre") + " " + card.getAttribute("data-tags") + " " + card.getAttribute("data-region") + " " + card.getAttribute("data-year"));
        var category = card.getAttribute("data-category") || "";
        var matchedText = !query || text.indexOf(query) !== -1;
        var matchedFilter = activeFilter === "all" || category === activeFilter;
        var showCard = matchedText && matchedFilter;
        card.style.display = showCard ? "" : "none";
        if (showCard) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle("is-visible", visible === 0);
      }
    }

    if (searchInput) {
      if (initialQuery) {
        searchInput.value = initialQuery;
      }
      searchInput.addEventListener("input", applyFilters);
      applyFilters();
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        activeFilter = chip.getAttribute("data-filter-chip") || "all";
        chips.forEach(function (item) {
          item.classList.toggle("is-active", item === chip);
        });
        applyFilters();
      });
    });
  });

  window.initPlayer = function (mediaUrl) {
    ready(function () {
      var shell = document.querySelector("[data-player]");
      if (!shell) {
        return;
      }
      var video = shell.querySelector("video");
      var layer = shell.querySelector("[data-play]");
      var loaded = false;
      var hlsInstance = null;

      function attach() {
        if (!video || loaded) {
          return;
        }
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = mediaUrl;
        } else if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(mediaUrl);
          hlsInstance.attachMedia(video);
          video.hlsInstance = hlsInstance;
        } else {
          video.src = mediaUrl;
        }
        loaded = true;
      }

      function play() {
        attach();
        if (layer) {
          layer.classList.add("is-hidden");
        }
        video.controls = true;
        var request = video.play();
        if (request && typeof request.catch === "function") {
          request.catch(function () {});
        }
      }

      if (layer) {
        layer.addEventListener("click", play);
      }
      shell.addEventListener("click", function (event) {
        if (event.target === shell) {
          play();
        }
      });
      video.addEventListener("click", function () {
        if (video.paused) {
          play();
        }
      });
      video.addEventListener("play", function () {
        if (layer) {
          layer.classList.add("is-hidden");
        }
      });
    });
  };
})();
