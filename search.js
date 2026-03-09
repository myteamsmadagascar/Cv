// search.js — SmartSearch global (simple + efficace)
(function () {
  const holder = document.querySelector("[data-smartsearch]");
  if (!holder) return;

  holder.innerHTML = `
    <div class="ssWrap">
      <div class="ssIcon"></div>
      <input id="ssInput" type="search" placeholder="Rechercher : développeur, télévente, assistant, chinois, ES01..." />
      <button id="ssBtn">Rechercher</button>
      <div class="ssResults" id="ssResults"></div>
    </div>
  `;

  const input = document.getElementById("ssInput");
  const btn = document.getElementById("ssBtn");
  const resultsBox = document.getElementById("ssResults");

  // Pages suggérées (recherche “intelligente”)
  const pageHints = [
    { k: ["dev", "développeur", "developer", "it", "informatique", "web", "java", "react", "django"], href: "freelancer1.html", t: "Page 1 — Experts / Informaticiens" },
    { k: ["anglais", "anglophone", "english", "customer care", "support"], href: "freelancer2.html", t: "Page 2 — Profils anglophones" },
    { k: ["espagnol", "hispano", "hispanophone", "spanish", "es"], href: "freelancer3.html", t: "Page 3 — Profils hispanophones" },
    { k: ["chinois", "chinophone", "chinophones", "mandarin", "chinese", "cn"], href: "freelancer4.html", t: "Page 4 — Profils parlant chinois" },
  ];

  function norm(s) {
    return (s || "")
      .toString()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  function collectCards() {
    // index = .card ; pages profils = .profile
    const cards = Array.from(document.querySelectorAll(".card, .profile"));
    return cards.map((el) => {
      const text = norm(el.innerText);
      const id = el.id || "";
      const ref = (el.querySelector(".badge")?.innerText || "").trim();
      const title = (el.querySelector(".job")?.innerText || el.querySelector(".role")?.innerText || "").trim();
      return { el, text, id, ref, title };
    });
  }

  const cards = collectCards();

  function showResults(items) {
    if (!items.length) {
      resultsBox.style.display = "block";
      resultsBox.innerHTML = `<div class="ssEmpty">Aucun résultat.</div>`;
      return;
    }
    resultsBox.style.display = "block";
    resultsBox.innerHTML = items
      .slice(0, 12)
      .map((x) => {
        const label = (x.ref || x.id || "Profil").replace("Réf :", "").trim();
        const sub = x.title ? x.title : "Ouvrir";
        const href = x.href || (x.id ? `#${x.id}` : "#profils");
        return `<a class="ssItem" href="${href}">
          <b>${label}</b>
          <span>${sub}</span>
        </a>`;
      })
      .join("");
  }

  function applySearch() {
    const q = norm(input.value);
    if (!q) {
      resultsBox.style.display = "none";
      // remettre visible
      cards.forEach(({ el }) => (el.style.display = ""));
      return;
    }

    // 1) Filtre cartes (texte complet)
    cards.forEach(({ el, text }) => {
      el.style.display = text.includes(q) ? "" : "none";
    });

    // 2) Suggestions de pages (si ça matche)
    const hints = pageHints
      .filter(p => p.k.some(word => norm(word).includes(q) || q.includes(norm(word)) || norm(word).includes(q)))
      .map(p => ({ href: p.href, ref: "Page", title: p.t }));

    // 3) Résultats “cliquables” sur page
    const onPage = cards
      .filter(c => c.text.includes(q))
      .map(c => ({ id: c.id, ref: c.ref || c.id, title: c.title }));

    showResults([...hints, ...onPage]);
  }

  btn.addEventListener("click", applySearch);
  input.addEventListener("input", applySearch);

  document.addEventListener("click", (e) => {
    if (!holder.contains(e.target)) resultsBox.style.display = "none";
  });
})();