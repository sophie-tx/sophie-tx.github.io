// public/app.js
const app = document.getElementById("app");
const FESTIVALS = window.FESTIVALS || [];

let view = "festival"; // "festival" | "thanks"
let index = 0;

function sel() {
  return FESTIVALS[index] || FESTIVALS[0];
}

function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

function nextFestival() {
  index = (index + 1) % FESTIVALS.length;
  render();
}
function prevFestival() {
  index = (index - 1 + FESTIVALS.length) % FESTIVALS.length;
  render();
}

function renderMedia(media, label) {
  if (!media || !media.type || !media.src) {
    return el(`
      <div class="media-frame fade-swap">
        <div class="media-box">
          <div class="placeholder">
            <div class="big">MEDIA PLACEHOLDER</div>
            <div style="margin-top:6px; opacity:.85;">${label || ""}</div>
            <div style="margin-top:8px; opacity:.65;">Add mainMedia/sideMedia in data.js</div>
          </div>
        </div>
      </div>
    `);
  }

  if (media.type === "image") {
    return el(`
      <div class="media-frame fade-swap">
        <div class="media-box">
          <img src="${media.src}" alt="${label || "Festival image"}" />
        </div>
      </div>
    `);
  }

  // VIDEO ✅ sound allowed + stop/reset when finished
  const wrap = el(`
    <div class="media-frame fade-swap">
      <div class="media-box">
        <video controls preload="metadata" playsinline>
          <source src="${media.src}" type="video/mp4" />
        </video>
      </div>
    </div>
  `);

  const v = wrap.querySelector("video");
  v.muted = false;
  v.loop = false;

  v.addEventListener("ended", () => {
    v.pause();
    v.currentTime = 0;
  });

  return wrap;
}

function renderSidebar() {
  const s = el(`<section class="card"><div class="pad"></div></section>`);
  const pad = s.querySelector(".pad");

  pad.appendChild(el(`<div class="pill">☸︎ 12 festivals</div>`));

  const listEl = el(`<div class="list"></div>`);
  FESTIVALS.forEach((f, i) => {
    const btn = el(`
      <button class="item-btn ${i === index ? "active" : ""}">
        <div>${f.title}</div>
        <div class="sub">${f.month}</div>
      </button>
    `);
    btn.addEventListener("click", () => {
      index = i;
      render();
    });
    listEl.appendChild(btn);
  });

  pad.appendChild(listEl);
  return s;
}

function renderFestivalPage() {
  const wrap = el(`<div class="grid"></div>`);
  const f = sel();

  // Left sidebar
  wrap.appendChild(renderSidebar());

  // Center ONLY (big media + text under it + small media next to text)
  const center = el(`<section class="card"><div class="pad center-stack"></div></section>`);
  const cp = center.querySelector(".pad");

  // 1) BIG media
  cp.appendChild(renderMedia(f.mainMedia, `BIG media: ${f.title}`));

  // 2) Under it: text + small media on the right
  const below = el(`<div class="below-row"></div>`);

  const textBox = el(`
    <div>
      <div class="h2">${f.title}</div>
      <div class="muted">${f.month}</div>
      <div class="p">${f.about || ""}</div>

      <div class="btn-row">
        <button class="btn">← Previous</button>
        <button class="btn primary">Next festival →</button>
        <button class="btn">Thank you →</button>
      </div>
    </div>
  `);

  const [prevBtn, nextBtn, thanksBtn] = textBox.querySelectorAll("button");
  prevBtn.addEventListener("click", prevFestival);
  nextBtn.addEventListener("click", nextFestival);
  thanksBtn.addEventListener("click", () => {
    view = "thanks";
    render();
  });

  const smallBox = el(`<div class="small-media"></div>`);
  smallBox.appendChild(renderMedia(f.sideMedia, `Small media: ${f.title}`));

  below.appendChild(textBox);
  below.appendChild(smallBox);

  cp.appendChild(below);

  wrap.appendChild(center);
  return wrap;
}

function renderThanksPage() {
  const box = el(`
    <section class="card">
      <div class="pad center-text">
        <h1>Thank you 🪷</h1>
        <p>
          Burmese festivals are deeply connected to Buddhism, community, and tradition across the 12 lunar months.
          <p>
           Thank you for listening,
            && “May all beings be happy and free from suffering.” </p>
        </p>
        <div class="btn-row" style="justify-content:center; margin-top:14px;">
          <button class="btn primary">Back to festivals →</button>
        </div>
      </div>
    </section>
  `);

  box.querySelector("button").addEventListener("click", () => {
    view = "festival";
    render();
  });

  const wrap = el(`<div class="grid" style="grid-template-columns:1fr;"></div>`);
  wrap.appendChild(box);
  return wrap;
}

function render() {
  app.innerHTML = "";
  app.appendChild(view === "thanks" ? renderThanksPage() : renderFestivalPage());
}

render();
