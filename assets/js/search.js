
document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const query = (params.get("q") || "").trim();
  const resultsContainer = document.getElementById("search-results");

  if (!resultsContainer) return;

  const pageSize = 10;
  let currentPage = 1;
  let results = [];

  if (!query) {
    resultsContainer.textContent = "请输入搜索关键词。";
    return;
  }

  function renderResults() {
    const totalPages = Math.max(1, Math.ceil(results.length / pageSize));

    // 防止切换页码后超出有效范围
    currentPage = Math.min(Math.max(currentPage, 1), totalPages);

    const start = (currentPage - 1) * pageSize;
    const pageResults = results.slice(start, start + pageSize);

    resultsContainer.replaceChildren();

    // 搜索结果网格
    const grid = document.createElement("div");
    grid.className = "archive-grid";

    pageResults.forEach(item => {
      const article = document.createElement("article");
      article.className = "search-result archive-card";

      const link = document.createElement("a");
      link.className = "archive-card-link";

      // 仅允许站内链接
      try {
        const url = new URL(item.permalink, window.location.origin);

        if (url.origin !== window.location.origin) return;

        link.href = url.href;
      } catch {
        return;
      }

      // Cover 封面
      if (item.cover) {
        const image = document.createElement("img");
        image.className = "archive-card-image";
        image.src = item.cover;
        image.alt = item.title || "";
        image.loading = "lazy";
        image.decoding = "async";
        link.appendChild(image);
      }

      // 标签
      if (item.tags && item.tags.length) {
        const tag = document.createElement("div");
        tag.className = "archive-card-tag";
        tag.textContent = item.tags[0];
        link.appendChild(tag);
      }

      // 标题
      const title = document.createElement("h2");
      title.className = "archive-card-title";
      title.textContent = item.title || "未命名文章";
      link.appendChild(title);

      // 描述
      const description = document.createElement("p");
      description.className = "archive-card-description";
      description.textContent = item.description || item.summary || "";
      link.appendChild(description);

      article.appendChild(link);
      grid.appendChild(article);
    });

    resultsContainer.appendChild(grid);

    // 分页控件
    const pagination = document.createElement("nav");
    pagination.className = "archive-pagination";
    pagination.setAttribute("aria-label", "搜索结果分页");

    if (totalPages > 1) {
      function createButton(label, targetPage, disabled) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.disabled = disabled;

        button.addEventListener("click", function () {
          currentPage = targetPage;
          renderResults();

          resultsContainer.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        });

        return button;
      }

      pagination.appendChild(
        createButton("上一页", currentPage - 1, currentPage === 1)
      );
    }

    // 即使只有一页，也显示页码
    const pageLabel = document.createElement("span");
    pageLabel.textContent = `${currentPage} / ${totalPages}`;
    pagination.appendChild(pageLabel);

    if (totalPages > 1) {
      pagination.appendChild(
        createButton("下一页", currentPage + 1, currentPage === totalPages)
      );
    }

    resultsContainer.appendChild(pagination);

    // 结果数量说明：放在分页之后
    const summary = document.createElement("p");
    summary.className = "search-result-summary";
    summary.textContent = `找到 ${results.length} 篇相关文章。`;
    resultsContainer.appendChild(summary);
  }

  fetch("/index.json")
    .then(response => {
      if (!response.ok) {
        throw new Error(`索引请求失败：${response.status}`);
      }

      return response.json();
    })
    .then(data => {
      const keyword = query.toLocaleLowerCase();

      results = data.filter(item => {
        const title = (item.title || "").toLocaleLowerCase();
        const content = (item.content || "").toLocaleLowerCase();
        const description = (item.description || "").toLocaleLowerCase();
        const summary = (item.summary || "").toLocaleLowerCase();

        return (
          title.includes(keyword) ||
          content.includes(keyword) ||
          description.includes(keyword) ||
          summary.includes(keyword)
        );
      });

      if (results.length === 0) {
        resultsContainer.textContent = "没有找到相关文章。";
        return;
      }

      renderResults();
    })
    .catch(error => {
      console.error("Search error:", error);
      resultsContainer.textContent = "搜索暂时无法使用。";
    });
});
