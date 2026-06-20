(function () {
  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var params = new URLSearchParams(window.location.search);
    var query = (params.get("q") || "").trim();
    var input = document.getElementById("search-page-input");
    var summary = document.getElementById("search-summary");
    var results = document.getElementById("search-results");
    var source = window.MOVIE_SEARCH_INDEX || [];
    if (input) {
      input.value = query;
    }
    if (!summary || !results) {
      return;
    }
    var words = query.toLowerCase().split(/\s+/).filter(Boolean);
    var matches = source.filter(function (item) {
      if (!words.length) {
        return false;
      }
      var text = [
        item.title,
        item.region,
        item.type,
        item.year,
        item.genre,
        (item.tags || []).join(" "),
        item.oneLine,
        item.summary
      ].join(" ").toLowerCase();
      return words.every(function (word) {
        return text.indexOf(word) !== -1;
      });
    }).slice(0, 120);
    if (!query) {
      summary.textContent = "请输入关键词开始搜索。";
      results.innerHTML = "";
      return;
    }
    summary.textContent = "为你找到 " + matches.length + " 个相关结果。";
    results.innerHTML = matches.map(function (item) {
      var tags = (item.tags || []).slice(0, 3).map(function (tag) {
        return "<span>" + escapeHtml(tag) + "</span>";
      }).join("");
      return "<a class=\"movie-card\" href=\"" + escapeHtml(item.url) + "\">" +
        "<span class=\"poster-frame\">" +
          "<img src=\"" + escapeHtml(item.poster) + "\" alt=\"" + escapeHtml(item.title) + "\" loading=\"lazy\">" +
          "<span class=\"poster-shade\"></span>" +
          "<span class=\"poster-play\">▶</span>" +
          "<span class=\"poster-type\">" + escapeHtml(item.type) + "</span>" +
        "</span>" +
        "<span class=\"card-body\">" +
          "<strong>" + escapeHtml(item.title) + "</strong>" +
          "<span class=\"card-meta\">" + escapeHtml(item.region) + " · " + escapeHtml(item.year) + "</span>" +
          "<span class=\"card-tags\">" + tags + "</span>" +
          "<p class=\"card-desc\">" + escapeHtml(item.oneLine) + "</p>" +
        "</span>" +
      "</a>";
    }).join("");
  });
})();
