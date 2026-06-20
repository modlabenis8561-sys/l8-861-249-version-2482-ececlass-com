(function () {
  var menuButton = document.querySelector("[data-menu-toggle]");
  var mobileNav = document.querySelector("[data-mobile-nav]");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("is-open");
    });
  }

  document.querySelectorAll("[data-global-search]").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var input = form.querySelector("input[name='q']");
      var value = input ? input.value.trim() : "";
      var url = "./search.html";

      if (value) {
        url += "?q=" + encodeURIComponent(value);
      }

      window.location.href = url;
    });
  });

  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
  var dotsContainer = document.querySelector("[data-hero-dots]");

  if (slides.length && dotsContainer) {
    var current = 0;
    var dots = slides.map(function (_, index) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "hero-dot" + (index === 0 ? " is-active" : "");
      button.setAttribute("aria-label", "切换推荐 " + (index + 1));
      button.addEventListener("click", function () {
        showSlide(index);
      });
      dotsContainer.appendChild(button);
      return button;
    });

    function showSlide(index) {
      slides[current].classList.remove("is-active");
      dots[current].classList.remove("is-active");
      current = index;
      slides[current].classList.add("is-active");
      dots[current].classList.add("is-active");
    }

    window.setInterval(function () {
      showSlide((current + 1) % slides.length);
    }, 5200);
  }

  var grid = document.querySelector("[data-filter-grid]");

  if (grid) {
    var searchInput = document.querySelector("[data-search-input]");
    var filters = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
    var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-movie-card]"));
    var query = new URLSearchParams(window.location.search).get("q") || "";

    if (searchInput && query) {
      searchInput.value = query;
    }

    function matchesText(card, text) {
      if (!text) {
        return true;
      }

      var value = [
        card.getAttribute("data-title"),
        card.getAttribute("data-year"),
        card.getAttribute("data-region"),
        card.getAttribute("data-type"),
        card.getAttribute("data-genre")
      ].join(" ").toLowerCase();

      return value.indexOf(text.toLowerCase()) !== -1;
    }

    function matchesFilter(card, name, value) {
      if (!value || value === "all") {
        return true;
      }

      var data = card.getAttribute("data-" + name) || "";
      return data.indexOf(value) !== -1;
    }

    function applyFilters() {
      var text = searchInput ? searchInput.value.trim() : "";

      cards.forEach(function (card) {
        var visible = matchesText(card, text);

        filters.forEach(function (filter) {
          visible = visible && matchesFilter(card, filter.getAttribute("data-filter"), filter.value);
        });

        card.classList.toggle("is-hidden", !visible);
      });
    }

    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }

    filters.forEach(function (filter) {
      filter.addEventListener("change", applyFilters);
    });

    applyFilters();
  }
})();
