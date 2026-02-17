function norm(s) {
  return (s || "").toString().toLowerCase().trim();
}

function sortPubs(pubs, mode) {
  const arr = [...pubs];
  if (mode === "yearAsc") arr.sort((a, b) => (a.year ?? 0) - (b.year ?? 0));
  else if (mode === "titleAsc") arr.sort((a, b) => norm(a.title).localeCompare(norm(b.title)));
  else arr.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  return arr;
}

function matches(pub, q) {
  if (!q) return true;
  const hay = [
    pub.title,
    pub.authors,
    pub.venue,
    String(pub.year ?? "")
  ].map(norm).join(" ");
  return hay.includes(q);
}

function render() {
  const listEl = document.getElementById("pubList");
  const q = norm(document.getElementById("pubSearch").value);
  const sortMode = document.getElementById("pubSort").value;

  const pubs = sortPubs(window.PUBLICATIONS || [], sortMode).filter(p => matches(p, q));

  listEl.innerHTML = "";

  if (pubs.length === 0) {
    const empty = document.createElement("div");
    empty.className = "card";
    empty.textContent = "No publications match your search.";
    listEl.appendChild(empty);
    return;
  }

  for (const p of pubs) {
    const card = document.createElement("div");
    card.className = "card pub";

    const title = document.createElement("h3");
    title.className = "pub-title";
    title.textContent = p.title || "Untitled";
    card.appendChild(title);

    const meta = document.createElement("p");
    meta.className = "pub-meta";
    const bits = [];
    if (p.authors) bits.push(p.authors);
    if (p.venue) bits.push(p.venue);
    if (p.year) bits.push(String(p.year));
    meta.textContent = bits.join(" • ");
    card.appendChild(meta);

    const links = document.createElement("div");
    links.className = "pub-links";
    (p.links || []).forEach(l => {
      const a = document.createElement("a");
      a.className = "pill";
      a.href = l.url;
      a.target = "_blank";
      a.rel = "noreferrer";
      a.textContent = l.label || "Link";
      links.appendChild(a);
    });
    card.appendChild(links);

    listEl.appendChild(card);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  document.getElementById("pubSearch").addEventListener("input", render);
  document.getElementById("pubSort").addEventListener("change", render);

  render();
});
