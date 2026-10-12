document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");

  const resultsContainer = document.getElementById("search-results");

  if (!resultsContainer) return;

  if (!query) {
    resultsContainer.innerHTML = "<p>请输入搜索关键词。</p>";
    return;
  }

  fetch("/index.json")
    .then(response => response.json())
    .then(data => {
      const keyword = query.toLowerCase();

      const results = data.filter(item => {
        const title = (item.title || "").toLowerCase();
        const content = (item.content || "").toLowerCase();
        const description = (item.description || "").toLowerCase();

        return (
          title.includes(keyword) ||
          content.includes(keyword) ||
          description.includes(keyword)
        );
      });

      if (results.length === 0) {
        resultsContainer.innerHTML =
          "<p>没有找到相关文章。</p>";
        return;
      }

      resultsContainer.innerHTML = results
        .map(item => {
          return `
            <article class="search-result archive-card">
              <a class="archive-card-link" href="${item.permalink}">
                ${
                  item.tags && item.tags.length
                    ? `<div class="archive-card-tag">${item.tags[0]}</div>`
                    : ""
                }

                <h2 class="archive-card-title">
                  ${item.title}
                </h2>

                <p class="archive-card-description">
                  ${item.description || ""}
                </p>
              </a>
            </article>
          `;
        })
        .join("");
    })
    .catch(error => {
      console.error("Search error:", error);

      resultsContainer.innerHTML =
        "<p>搜索暂时无法使用。</p>";
    });
});
