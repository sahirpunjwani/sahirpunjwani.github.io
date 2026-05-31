/* =============================================
   TERMINAL PORTFOLIO — index.js
   ============================================= */

// ── CONFIG ────────────────────────────────────
const CONFIG = {
  username: "YOUR_USERNAME",          // ← Replace with your GitHub username
  tagline_phrases: [
    "building things that matter.",
    "open source enthusiast.",
    "turning coffee into commits.",
    "shipping projects, not just ideas.",
  ],
  // Manually pin repos to show first (optional, use exact repo names)
  pinned: [],
  // Repos to hide (e.g. forked or irrelevant)
  exclude: ["YOUR_USERNAME"],         // GitHub auto-creates this — usually hidden
};

// ── MATRIX RAIN ───────────────────────────────
(function initMatrix() {
  const canvas = document.getElementById("matrix-canvas");
  const ctx = canvas.getContext("2d");
  const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノ01アイウエオ{}[]<>/\\|#$%&*";
  let cols, drops;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    cols  = Math.floor(canvas.width / 16);
    drops = Array(cols).fill(1);
  }

  function draw() {
    ctx.fillStyle = "rgba(10, 12, 15, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#00ff41";
    ctx.font = "14px JetBrains Mono, monospace";
    drops.forEach((y, i) => {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * 16, y * 16);
      if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
  }

  resize();
  window.addEventListener("resize", resize);
  setInterval(draw, 50);
})();

// ── TYPING EFFECT ────────────────────────────
(function initTyping() {
  const el = document.getElementById("typed-tagline");
  const phrases = CONFIG.tagline_phrases;
  let pIdx = 0, cIdx = 0, deleting = false;

  function tick() {
    const phrase = phrases[pIdx];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++cIdx);
      if (cIdx === phrase.length) { deleting = true; setTimeout(tick, 2200); return; }
    } else {
      el.textContent = phrase.slice(0, --cIdx);
      if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 40 : 75);
  }
  setTimeout(tick, 800);
})();

// ── LIVE CLOCK ───────────────────────────────
(function initClock() {
  const el = document.getElementById("live-time");
  function update() {
    const now = new Date();
    el.textContent = now.toUTCString().replace("GMT", "UTC");
  }
  update();
  setInterval(update, 1000);
})();

// ── YEAR IN FOOTER ───────────────────────────
document.getElementById("year").textContent = new Date().getFullYear();

// ── LANGUAGE HELPERS ─────────────────────────
function getLangClass(lang) {
  const map = {
    "JavaScript": "lang-js",
    "TypeScript": "lang-ts",
    "Python":     "lang-py",
    "HTML":       "lang-html",
    "CSS":        "lang-css",
    "Go":         "lang-go",
    "Rust":       "lang-rust",
    "Shell":      "lang-shell",
  };
  return map[lang] || "lang-other";
}

function getRepoIcon(repo) {
  const name = (repo.name + " " + (repo.description || "")).toLowerCase();
  if (name.includes("bot"))      return "🤖";
  if (name.includes("api"))      return "🔌";
  if (name.includes("cli"))      return "⌨️";
  if (name.includes("web") || name.includes("site") || name.includes("html")) return "🌐";
  if (name.includes("game"))     return "🎮";
  if (name.includes("lib") || name.includes("util") || name.includes("tool")) return "🔧";
  if (name.includes("data") || name.includes("ml") || name.includes("ai"))    return "🧠";
  if (name.includes("mobile") || name.includes("app"))                        return "📱";
  if (repo.language === "Python") return "🐍";
  if (repo.language === "Rust")   return "⚙️";
  return "📦";
}

// ── SKELETON CARDS ───────────────────────────
function renderSkeletons(n = 6) {
  const grid = document.getElementById("projects-grid");
  grid.innerHTML = Array(n).fill(`
    <div class="skel-card">
      <div class="skeleton skel-line" style="width:40%;height:10px;margin-bottom:16px"></div>
      <div class="skeleton skel-line" style="width:70%;height:14px;margin-bottom:8px"></div>
      <div class="skeleton skel-line" style="width:90%"></div>
      <div class="skeleton skel-line" style="width:60%"></div>
    </div>
  `).join("");
}

// ── RENDER CARDS ─────────────────────────────
function renderCards(repos) {
  const grid = document.getElementById("projects-grid");
  document.getElementById("project-count").textContent = `${repos.length} REPOS LOADED`;

  if (!repos.length) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="big">🕳️</div>
        <p>No projects found. Check your username or internet connection.</p>
      </div>`;
    return;
  }

  grid.innerHTML = repos.map((repo, i) => {
    const langClass = getLangClass(repo.language);
    const icon      = getRepoIcon(repo);
    const desc      = repo.description || "<span style='color:#3a4a3a'>// no description provided</span>";
    const topics    = (repo.topics || []).slice(0, 4);
    const delay     = Math.min(i * 0.04, 0.6);

    return `
      <div class="card" data-tags="${topics.join(",")}" style="animation-delay:${delay}s">
        <div class="card-top">
          <span class="card-icon">${icon}</span>
          ${repo.language ? `<span class="card-lang ${langClass}">${repo.language}</span>` : ""}
        </div>
        <div class="card-name">
          <a href="${repo.html_url}" target="_blank" rel="noopener">${repo.name}</a>
        </div>
        <div class="card-desc">${desc}</div>
        ${topics.length ? `
          <div class="card-tags">
            ${topics.map(t => `<span class="card-tag" data-filter="${t}">#${t}</span>`).join("")}
          </div>
        ` : ""}
        <div class="card-footer">
          <div class="card-link-info">
            <span class="card-link-name">📁 ${repo.name}</span>
            <span class="card-link-url">${repo.html_url.replace("https://", "")}</span>
          </div>
          <div class="card-actions">
            <a class="card-btn btn-gh" href="${repo.html_url}" target="_blank" rel="noopener" title="View on GitHub">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </a>
            ${repo.homepage ? `
            <a class="card-btn btn-site" href="${repo.homepage}" target="_blank" rel="noopener" title="View Live Site">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              Live Site
            </a>
            ` : `
            <span class="card-btn btn-site disabled" title="No live site set">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              No Site
            </span>
            `}
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Click on card tag → filter
  grid.querySelectorAll(".card-tag").forEach(tag => {
    tag.addEventListener("click", e => {
      e.stopPropagation();
      applyFilter(e.target.dataset.filter);
    });
  });
}

// ── BUILD TAG FILTERS ─────────────────────────
function buildFilters(repos) {
  const allTopics = new Set();
  repos.forEach(r => (r.topics || []).forEach(t => allTopics.add(t)));

  const container = document.getElementById("tag-filters");
  const sorted = [...allTopics].sort();

  sorted.forEach(topic => {
    const btn = document.createElement("button");
    btn.className = "tag";
    btn.dataset.tag = topic;
    btn.textContent = topic;
    btn.addEventListener("click", () => applyFilter(topic));
    container.appendChild(btn);
  });
}

// ── FILTER LOGIC ─────────────────────────────
function applyFilter(tag) {
  const buttons = document.querySelectorAll(".tag");
  buttons.forEach(b => b.classList.toggle("active", b.dataset.tag === tag));

  const cards = document.querySelectorAll(".card");
  cards.forEach(card => {
    if (tag === "all") {
      card.classList.remove("hidden");
    } else {
      const tags = (card.dataset.tags || "").split(",");
      card.classList.toggle("hidden", !tags.includes(tag));
    }
  });
}

// Set up "all" button
document.querySelector(".tag[data-tag='all']").addEventListener("click", () => applyFilter("all"));


// ── RENDER LINKS LIST ────────────────────────
function renderLinksList(repos) {
  const list = document.getElementById("links-list");
  const count = document.getElementById("links-count");
  if (!list) return;

  count.textContent = `— ${repos.length} projects`;

  list.innerHTML = repos.map((repo, i) => `
    <div class="link-row" style="animation-delay:${Math.min(i * 0.03, 0.8)}s">
      <div class="link-row-left">
        <span class="link-index">${String(i + 1).padStart(2, "0")}</span>
        <div class="link-info">
          <span class="link-name">${repo.name}</span>
          <span class="link-url">${repo.html_url.replace("https://", "")}</span>
        </div>
      </div>
      <div class="link-row-right">
        <a class="link-btn btn-gh" href="${repo.html_url}" target="_blank" rel="noopener">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          GitHub
        </a>
        ${repo.homepage
          ? `<a class="link-btn btn-site" href="${repo.homepage}" target="_blank" rel="noopener">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              Live Site
            </a>`
          : `<span class="link-btn btn-site disabled">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              No Site
            </span>`
        }
      </div>
    </div>
  `).join("");
}

// ── FETCH REPOS ───────────────────────────────
async function fetchRepos() {
  renderSkeletons();

  try {
    // Fetch up to 100 repos (non-fork, sorted by stars)
    const res = await fetch(
      `https://api.github.com/users/${CONFIG.username}/repos?per_page=100&sort=updated&type=owner`,
      { headers: { Accept: "application/vnd.github+json" } }
    );

    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

    let repos = await res.json();

    // Filter out forks and excluded names
    repos = repos.filter(r =>
      !r.fork &&
      !CONFIG.exclude.includes(r.name)
    );

    // Sort: pinned first, then by stars
    repos.sort((a, b) => {
      const aPin = CONFIG.pinned.indexOf(a.name);
      const bPin = CONFIG.pinned.indexOf(b.name);
      if (aPin !== -1 && bPin !== -1) return aPin - bPin;
      if (aPin !== -1) return -1;
      if (bPin !== -1) return 1;
      return b.stargazers_count - a.stargazers_count;
    });

    buildFilters(repos);
    renderCards(repos);
    renderLinksList(repos);

  } catch (err) {
    console.error(err);
    document.getElementById("projects-grid").innerHTML = `
      <div class="empty-state">
        <div class="big">💥</div>
        <p style="color:#ff3b3b">ERROR: ${err.message}</p>
        <p style="margin-top:8px">Make sure you updated <code>CONFIG.username</code> in index.js</p>
      </div>`;
    document.getElementById("project-count").textContent = "FETCH FAILED";
  }
}

fetchRepos();