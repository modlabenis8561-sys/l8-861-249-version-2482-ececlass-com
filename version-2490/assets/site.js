const ready = (callback) => {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", callback);
    } else {
        callback();
    }
};

const normalize = (value) => (value || "").toString().trim().toLowerCase();

const updateCount = (root, count) => {
    const target = root.querySelector("[data-result-count]") || document.querySelector("[data-result-count]");
    if (target) {
        target.textContent = `${count} 部`;
    }
};

const initMenu = () => {
    const toggle = document.querySelector("[data-menu-toggle]");
    const panel = document.querySelector("[data-mobile-panel]");
    if (!toggle || !panel) {
        return;
    }
    toggle.addEventListener("click", () => {
        panel.classList.toggle("is-open");
        toggle.classList.toggle("is-open");
    });
};

const initSearchForms = () => {
    document.querySelectorAll("[data-search-form]").forEach((form) => {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const input = form.querySelector("input[name='q'], input[type='search']");
            const query = input ? input.value.trim() : "";
            const url = query ? `./search.html?q=${encodeURIComponent(query)}` : "./search.html";
            window.location.href = url;
        });
    });
};

const initHero = () => {
    const hero = document.querySelector("[data-hero]");
    if (!hero) {
        return;
    }
    const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(hero.querySelectorAll("[data-hero-dot]"));
    const nextButton = hero.querySelector("[data-hero-next]");
    const prevButton = hero.querySelector("[data-hero-prev]");
    if (!slides.length) {
        return;
    }
    let current = 0;
    let timer = null;
    const show = (index) => {
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle("is-active", slideIndex === current);
        });
        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle("is-active", dotIndex === current);
        });
    };
    const schedule = () => {
        window.clearInterval(timer);
        timer = window.setInterval(() => show(current + 1), 6000);
    };
    dots.forEach((dot) => {
        dot.addEventListener("click", () => {
            show(Number(dot.dataset.heroDot || 0));
            schedule();
        });
    });
    if (nextButton) {
        nextButton.addEventListener("click", () => {
            show(current + 1);
            schedule();
        });
    }
    if (prevButton) {
        prevButton.addEventListener("click", () => {
            show(current - 1);
            schedule();
        });
    }
    schedule();
};

const filterGrid = (input) => {
    const grid = document.querySelector("[data-filter-grid]");
    if (!grid) {
        return;
    }
    const cards = Array.from(grid.querySelectorAll("[data-movie-card]"));
    const query = normalize(input.value);
    let visible = 0;
    cards.forEach((card) => {
        const text = normalize(card.dataset.search || card.textContent);
        const matched = !query || text.includes(query);
        card.hidden = !matched;
        if (matched) {
            visible += 1;
        }
    });
    updateCount(document, visible);
};

const initFilters = () => {
    const input = document.querySelector("[data-page-filter]");
    if (!input) {
        return;
    }
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q") || "";
    if (input.hasAttribute("data-auto-search") && query) {
        input.value = query;
    }
    input.addEventListener("input", () => filterGrid(input));
    filterGrid(input);
};

const attachNative = (video, stream) => {
    if (video.src !== stream) {
        video.src = stream;
    }
    return Promise.resolve();
};

const attachHls = async (video, stream) => {
    const module = await import("./video-dru42stk.js");
    const Hls = module.H;
    if (!Hls || !Hls.isSupported()) {
        return attachNative(video, stream);
    }
    if (video._movieHls) {
        video._movieHls.destroy();
    }
    const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
    });
    video._movieHls = hls;
    hls.loadSource(stream);
    hls.attachMedia(video);
    return new Promise((resolve) => {
        hls.on(Hls.Events.MANIFEST_PARSED, resolve);
        window.setTimeout(resolve, 1200);
    });
};

export function initMoviePlayer(playerId, stream) {
    ready(() => {
        const video = document.getElementById(playerId);
        if (!video || !stream) {
            return;
        }
        const trigger = document.querySelector(`[data-player-trigger="${playerId}"]`);
        let started = false;
        const start = async () => {
            if (!started) {
                started = true;
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    await attachNative(video, stream);
                } else {
                    await attachHls(video, stream);
                }
            }
            if (trigger) {
                trigger.classList.add("is-hidden");
            }
            video.classList.add("is-ready");
            const playPromise = video.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(() => {});
            }
        };
        if (trigger) {
            trigger.addEventListener("click", start);
        }
        video.addEventListener("click", () => {
            if (!started) {
                start();
            }
        });
        video.addEventListener("play", () => {
            if (trigger) {
                trigger.classList.add("is-hidden");
            }
        });
    });
}

ready(() => {
    initMenu();
    initSearchForms();
    initHero();
    initFilters();
});
