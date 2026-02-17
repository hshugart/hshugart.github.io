function norm(value) {
  return (value || "").toString().trim().toLowerCase();
}

function sortPublications(publications, mode) {
  const copy = [...publications];
  if (mode === "yearAsc") return copy.sort((a, b) => (a.year || 0) - (b.year || 0));
  if (mode === "titleAsc") return copy.sort((a, b) => norm(a.title).localeCompare(norm(b.title)));
  return copy.sort((a, b) => (b.year || 0) - (a.year || 0));
}

function publicationMatches(publication, query) {
  if (!query) return true;
  const haystack = [publication.title, publication.authors, publication.venue, publication.year]
    .map(norm)
    .join(" ");
  return haystack.includes(query);
}

function renderPublications() {
  const list = document.getElementById("pubList");
  const search = document.getElementById("pubSearch");
  const sort = document.getElementById("pubSort");

  if (!list || !search || !sort) return;

  const query = norm(search.value);
  const mode = sort.value;

  const publications = sortPublications(window.PUBLICATIONS || [], mode).filter((pub) =>
    publicationMatches(pub, query)
  );

  list.innerHTML = "";

  if (!publications.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No publications match your search.";
    list.appendChild(empty);
    return;
  }

  for (const publication of publications) {
    const item = document.createElement("article");
    item.className = "pub";

    const title = document.createElement("h3");
    title.className = "pub-title";
    title.textContent = publication.title;

    const meta = document.createElement("p");
    meta.className = "pub-meta";
    meta.textContent = `${publication.authors} • ${publication.venue} • ${publication.year}`;

    const links = document.createElement("div");
    links.className = "pub-links";

    for (const link of publication.links || []) {
      const anchor = document.createElement("a");
      anchor.className = "pill";
      anchor.href = link.url;
      anchor.textContent = link.label;
      anchor.target = "_blank";
      anchor.rel = "noreferrer";
      links.appendChild(anchor);
    }

    item.append(title, meta, links);
    list.appendChild(item);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const search = document.getElementById("pubSearch");
  const sort = document.getElementById("pubSort");

  if (search && sort) {
    search.addEventListener("input", renderPublications);
    sort.addEventListener("change", renderPublications);
    renderPublications();
  }
});
