// Constants & State
const THEME_KEY = "hshugart-theme";

// Utility: Normalize text for search
function norm(value) {
  return (value || "").toString().trim().toLowerCase();
}

// Sorting logic
function sortPublications(publications, mode) {
  const copy = [...publications];
  if (mode === "yearAsc") return copy.sort((a, b) => (a.year || 0) - (b.year || 0));
  if (mode === "titleAsc") return copy.sort((a, b) => norm(a.title).localeCompare(norm(b.title)));
  // Default: yearDesc
  return copy.sort((a, b) => (b.year || 0) - (a.year || 0));
}

// Matching logic
function publicationMatches(publication, query) {
  if (!query) return true;
  const haystack = [
    publication.title,
    publication.authors,
    publication.venue,
    publication.year
  ].map(norm).join(" ");
  return haystack.includes(query);
}

// Core Rendering
function renderPublications() {
  const list = document.getElementById("pubList");
  const search = document.getElementById("pubSearch");
  const sort = document.getElementById("pubSort");

  if (!list) return;

  const query = search ? norm(search.value) : "";
  const mode = sort ? sort.value : "yearDesc";

  const publicationData = Array.isArray(window.PUBLICATIONS) ? window.PUBLICATIONS : [];
  const publications = sortPublications(publicationData, mode).filter((pub) =>
    publicationMatches(pub, query)
  );

  list.innerHTML = "";

  if (!publications.length) {
    list.innerHTML = `<p class="empty-state">No publications match your search.</p>`;
    return;
  }

  publications.forEach((pub) => {
    const item = document.createElement("article");
    item.className = "pub";

    // Highlight user's name in the author list (optional but professional)
    const authorsHtml = pub.authors.replace(
      "Henry Shugart",
      "<strong>Henry Shugart</strong>"
    );

    item.innerHTML = `
      <h3 class="pub-title">${pub.title}</h3>
      <p class="pub-meta">
        ${authorsHtml} <br>
        <em>${pub.venue}</em>, ${pub.year}
      </p>
      <div class="pub-links">
        ${(pub.links || []).map(link => `
          <a href="${link.url}" class="pill" target="_blank" rel="noopener noreferrer">${link.label}</a>
        `).join("")}
      </div>
    `;
    list.appendChild(item);
  });
}

// Theme Management
function initTheme() {
  const toggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem(THEME_KEY);
  
  // Check preference: saved > system
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const currentTheme = savedTheme || (prefersDark ? "dark" : "light");

  document.documentElement.setAttribute("data-theme", currentTheme);

  if (toggle) {
    toggle.addEventListener("click", () => {
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      const newTheme = isDark ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem(THEME_KEY, newTheme);
    });
  }
}

// Initialization
function initializePage() {
  // Set current year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Setup theme
  initTheme();

  // Setup publication listeners
  const search = document.getElementById("pubSearch");
  const sort = document.getElementById("pubSort");

  if (search) search.addEventListener("input", renderPublications);
  if (sort) sort.addEventListener("change", renderPublications);

  // Initial render
  renderPublications();
}

// Run on load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializePage);
} else {
  initializePage();
}
