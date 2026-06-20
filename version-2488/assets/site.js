(function () {
    var menuButton = document.querySelector("[data-menu-toggle]");
    var mobilePanel = document.querySelector("[data-mobile-panel]");

    if (menuButton && mobilePanel) {
        menuButton.addEventListener("click", function () {
            mobilePanel.classList.toggle("is-open");
        });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dots] button"));
        var index = 0;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                showSlide(dotIndex);
            });
        });

        window.setInterval(function () {
            showSlide(index + 1);
        }, 5600);
    }

    var params = new URLSearchParams(window.location.search);
    var query = params.get("q") || "";
    var heroSearchInput = document.getElementById("hero-search-input");
    var pageSearch = document.getElementById("page-search");
    var grid = document.querySelector("[data-filterable]");
    var activeFilter = "all";

    if (heroSearchInput) {
        heroSearchInput.value = query;
    }

    if (pageSearch) {
        pageSearch.value = query;
    }

    function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
    }

    function applyFilter() {
        if (!grid) {
            return;
        }

        var text = normalize(pageSearch ? pageSearch.value : query);
        var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-movie-card]"));

        cards.forEach(function (card) {
            var haystack = normalize(card.getAttribute("data-search"));
            var filterValue = normalize(activeFilter);
            var matchesText = !text || haystack.indexOf(text) !== -1;
            var matchesFilter = filterValue === "all" || haystack.indexOf(filterValue) !== -1;
            card.classList.toggle("is-hidden", !(matchesText && matchesFilter));
        });
    }

    if (pageSearch) {
        pageSearch.addEventListener("input", applyFilter);
    }

    Array.prototype.slice.call(document.querySelectorAll(".filter-chip")).forEach(function (chip) {
        chip.addEventListener("click", function () {
            activeFilter = chip.getAttribute("data-filter") || "all";
            Array.prototype.slice.call(document.querySelectorAll(".filter-chip")).forEach(function (item) {
                item.classList.toggle("is-active", item === chip);
            });
            applyFilter();
        });
    });

    applyFilter();
}());
