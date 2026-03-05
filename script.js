// =====================
// NAV: switch panels
// =====================
const navButtons = document.querySelectorAll(".navBtn");
const panels = document.querySelectorAll(".panel");

function showPanel(id) {
  panels.forEach(p => p.classList.toggle("show", p.id === id));
  navButtons.forEach(b => b.classList.toggle("active", b.dataset.target === id));
}
navButtons.forEach(btn => btn.addEventListener("click", () => showPanel(btn.dataset.target)));
showPanel("panel-sf");

// =====================
// Helpers
// =====================
function degToRad(deg){ return deg * (Math.PI / 180); }

function nice(n){
  if (!Number.isFinite(n)) return "undefined";
  const r = Math.round(n * 1e10) / 1e10;
  return String(r);
}

function getNum(id){
  const el = document.getElementById(id);
  if (!el) return NaN;
  return Number(el.value);
}

// Button-group helper: clicks update hidden input + active style
function wireButtonGroup(groupEl, hiddenInputEl) {
  if (!groupEl || !hiddenInputEl) return;

  const buttons = Array.from(groupEl.querySelectorAll("button[data-value]"));

  function setValue(val) {
    hiddenInputEl.value = val;
    buttons.forEach(b => b.classList.toggle("active", b.dataset.value === val));
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => setValue(btn.dataset.value));
  });

  // init
  setValue(hiddenInputEl.value || (buttons[0] && buttons[0].dataset.value));
}

// =====================
// SF CALCULATOR (working)
// =====================
const sfToolBtns = document.querySelectorAll(".sfTool");
const sfForm = document.getElementById("sfForm");
const sfOut = document.getElementById("sfOut");
const sfCalc = document.getElementById("sfCalc");
const sfClear = document.getElementById("sfClear");

let currentSF = "arith_n";

function inputHTML(id, label, placeholder){
  return `
    <div>
      <label>${label}</label>
      <input id="${id}" type="number" step="any" placeholder="${placeholder}" />
    </div>`;
}

function renderSF(tool){
  currentSF = tool;
  sfToolBtns.forEach(b => b.classList.toggle("active", b.dataset.tool === tool));
  sfOut.textContent = "—";

  let html = "";

  if (tool === "arith_n"){
    html =
      inputHTML("a1","a₁ (first term)","e.g. 5") +
      inputHTML("d","d (difference)","e.g. 2") +
      `<div class="span2">` +
      `<label>n (term number)</label><input id="n" type="number" step="1" placeholder="e.g. 10" />` +
      `</div>`;
  }

  if (tool === "arith_s"){
    html =
      inputHTML("a1","a₁ (first term)","e.g. 5") +
      inputHTML("d","d (difference)","e.g. 2") +
      `<div class="span2">` +
      `<label>n (number of terms)</label><input id="n" type="number" step="1" placeholder="e.g. 10" />` +
      `</div>`;
  }

  if (tool === "geo_n"){
    html =
      inputHTML("a1","a₁ (first term)","e.g. 3") +
      inputHTML("r","r (ratio)","e.g. 2") +
      `<div class="span2">` +
      `<label>n (term number)</label><input id="n" type="number" step="1" placeholder="e.g. 6" />` +
      `</div>`;
  }

  if (tool === "geo_s"){
    html =
      inputHTML("a1","a₁ (first term)","e.g. 3") +
      inputHTML("r","r (ratio)","e.g. 2") +
      `<div class="span2">` +
      `<label>n (number of terms)</label><input id="n" type="number" step="1" placeholder="e.g. 6" />` +
      `</div>`;
  }

  if (tool === "geo_inf"){
    html =
      inputHTML("a1","a₁ (first term)","e.g. 4") +
      inputHTML("r","r (ratio)","e.g. 0.5") +
      `<div class="span2"><div class="muted tiny">Only works if |r| &lt; 1</div></div>`;
  }

  if (tool === "harm_n"){
    html =
      inputHTML("a","a (numerator)","e.g. 1") +
      inputHTML("b","b (start denominator)","e.g. 1") +
      `<div class="span2">` +
      `<label>n (term number)</label><input id="n" type="number" step="1" placeholder="e.g. 5" />` +
      `<div class="muted tiny">Term: a / (b + (n-1))</div>` +
      `</div>`;
  }

  if (tool === "quad_n"){
    html =
      inputHTML("a","a (quadratic coefficient)","e.g. 2") +
      inputHTML("b","b (linear coefficient)","e.g. 3") +
      `<div class="span2">` +
      `<label>c (constant)</label><input id="c" type="number" step="any" placeholder="e.g. 1" />` +
      `</div>` +
      `<div class="span2">` +
      `<label>n (term number)</label><input id="n" type="number" step="1" placeholder="e.g. 4" />` +
      `<div class="muted tiny">Term: a·n² + b·n + c</div>` +
      `</div>`;
  }

  sfForm.innerHTML = html;
}

sfToolBtns.forEach(b => b.addEventListener("click", () => renderSF(b.dataset.tool)));
renderSF("arith_n");

sfCalc.addEventListener("click", () => {
  try{
    let res;

    if (currentSF === "arith_n"){
      const a1 = getNum("a1"), d = getNum("d"), n = getNum("n");
      if (!Number.isFinite(a1) || !Number.isFinite(d) || !Number.isFinite(n) || n <= 0) throw new Error("Fill a₁, d, n (n > 0).");
      res = a1 + (n - 1) * d;
      sfOut.textContent = `aₙ = ${nice(res)}`;
      return;
    }

    if (currentSF === "arith_s"){
      const a1 = getNum("a1"), d = getNum("d"), n = getNum("n");
      if (!Number.isFinite(a1) || !Number.isFinite(d) || !Number.isFinite(n) || n <= 0) throw new Error("Fill a₁, d, n (n > 0).");
      res = (n / 2) * (2 * a1 + (n - 1) * d);
      sfOut.textContent = `Sₙ = ${nice(res)}`;
      return;
    }

    if (currentSF === "geo_n"){
      const a1 = getNum("a1"), r = getNum("r"), n = getNum("n");
      if (!Number.isFinite(a1) || !Number.isFinite(r) || !Number.isFinite(n) || n <= 0) throw new Error("Fill a₁, r, n (n > 0).");
      res = a1 * (r ** (n - 1));
      sfOut.textContent = `aₙ = ${nice(res)}`;
      return;
    }

    if (currentSF === "geo_s"){
      const a1 = getNum("a1"), r = getNum("r"), n = getNum("n");
      if (!Number.isFinite(a1) || !Number.isFinite(r) || !Number.isFinite(n) || n <= 0) throw new Error("Fill a₁, r, n (n > 0).");
      if (r === 1){
        res = a1 * n;
      } else {
        res = a1 * (1 - (r ** n)) / (1 - r);
      }
      sfOut.textContent = `Sₙ = ${nice(res)}`;
      return;
    }

    if (currentSF === "geo_inf"){
      const a1 = getNum("a1"), r = getNum("r");
      if (!Number.isFinite(a1) || !Number.isFinite(r)) throw new Error("Fill a₁ and r.");
      if (Math.abs(r) >= 1) throw new Error("Infinite sum only works if |r| < 1.");
      res = a1 / (1 - r);
      sfOut.textContent = `S∞ = ${nice(res)}`;
      return;
    }

    if (currentSF === "harm_n"){
      const a = getNum("a"), b = getNum("b"), n = getNum("n");
      if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(n) || n <= 0) throw new Error("Fill a, b, n (n > 0).");
      res = a / (b + (n - 1));
      sfOut.textContent = `aₙ = ${nice(res)}`;
      return;
    }

    if (currentSF === "quad_n"){
      const a = getNum("a"), b = getNum("b"), c = getNum("c"), n = getNum("n");
      if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c) || !Number.isFinite(n) || n <= 0) throw new Error("Fill a, b, c, n (n > 0).");
      res = a * (n ** 2) + b * n + c;
      sfOut.textContent = `aₙ = ${nice(res)}`;
      return;
    }

    sfOut.textContent = "Pick a calculation.";
  } catch(err){
    sfOut.textContent = err.message || "Error";
  }
});

sfClear.addEventListener("click", () => {
  sfOut.textContent = "—";
  sfForm.querySelectorAll("input").forEach(i => i.value = "");
});

// =====================
// TRIG RIGHT TRIANGLE SOLVER
// =====================
const triAngle = document.getElementById("triAngle");
const triKnownType = document.getElementById("triKnownType");
const triKnownValue = document.getElementById("triKnownValue");
const triKnownValue2 = document.getElementById("triKnownValue2");
const triSecondWrap = document.getElementById("triSecondWrap");
const triFind = document.getElementById("triFind");
const triOut = document.getElementById("triOut");
const triCalc = document.getElementById("triCalc");
const triClear = document.getElementById("triClear");

// wire the small button groups
wireButtonGroup(document.getElementById("triKnownGroup"), triKnownType);
wireButtonGroup(document.getElementById("triFindGroup"), triFind);

function updateTriMode(){
  const mode = triKnownType.value; // adj | opp | hyp | two
  const isTwoSides = mode === "two";

  // Show/hide second input
  if (triSecondWrap) triSecondWrap.style.display = isTwoSides ? "" : "none";

  // Disable angle input in two-sides mode
  if (triAngle) triAngle.disabled = isTwoSides;

  // Optional: clear angle when switching into two-sides mode
  if (isTwoSides && triAngle) triAngle.value = "";
}

updateTriMode();

// When the known-side group changes, update layout
document.getElementById("triKnownGroup")?.addEventListener("click", () => {
  updateTriMode();
});

triCalc.addEventListener("click", () => {
  const knownType = triKnownType.value; // adj | opp | hyp | two
  const v1 = Number(triKnownValue.value);
  const want = triFind.value; // all | adj | opp | hyp

  // ===== MODE: Two Sides -> Angle =====
  // Assumption: v1 = adjacent, v2 = hypotenuse
  if (knownType === "two") {
    const v2 = Number(triKnownValue2?.value);

    if (!Number.isFinite(v1) || !Number.isFinite(v2) || v1 <= 0 || v2 <= 0) {
      triOut.textContent = "Enter two side values (> 0).";
      return;
    }
    if (v1 > v2) {
      triOut.textContent = "Adjacent cannot be bigger than hypotenuse.";
      return;
    }

    const ratio = v1 / v2;
    const angle = Math.acos(ratio) * 180 / Math.PI;

    triOut.textContent = `Angle α = ${nice(angle)}°`;
    return;
  }

  // ===== NORMAL MODE: Angle + one side -> find sides =====
  const aDeg = Number(triAngle.value);
  const v = v1;

  if (!Number.isFinite(aDeg) || aDeg <= 0 || aDeg >= 90) {
    triOut.textContent = "Angle α must be between 0 and 90 degrees.";
    return;
  }
  if (!Number.isFinite(v) || v <= 0) {
    triOut.textContent = "Known side value must be > 0.";
    return;
  }

  const a = degToRad(aDeg);
  const s = Math.sin(a);
  const c = Math.cos(a);
  const t = Math.tan(a);

  let opp, adj, hyp;

  if (knownType === "adj") {
    adj = v;
    opp = adj * t;
    hyp = adj / c;
  } else if (knownType === "opp") {
    opp = v;
    adj = opp / t;
    hyp = opp / s;
  } else {
    hyp = v;
    opp = hyp * s;
    adj = hyp * c;
  }

  const lines = [];
  const showAll = want === "all";
  if (showAll || want === "opp") lines.push(`Opposite = ${nice(opp)}`);
  if (showAll || want === "adj") lines.push(`Adjacent = ${nice(adj)}`);
  if (showAll || want === "hyp") lines.push(`Hypotenuse = ${nice(hyp)}`);

  triOut.textContent = lines.join("   |   ");
});

triClear.addEventListener("click", () => {
  triAngle.value = "";
  triKnownValue.value = "";
  if (triKnownValue2) triKnownValue2.value = "";
  triOut.textContent = "—";
  updateTriMode();
});
// =====================
// NOTES SEARCH
// =====================
const notesSearch = document.getElementById("notesSearch");
const notesWrap = document.getElementById("notesWrap");

if (notesSearch && notesWrap) {
  const topics = Array.from(notesWrap.querySelectorAll(".noteTopic"));
  notesSearch.addEventListener("input", () => {
    const q = notesSearch.value.trim().toLowerCase();
    topics.forEach(t => {
      const text = (t.innerText || "").toLowerCase();
      const keys = (t.dataset.keywords || "").toLowerCase();
      const match = q === "" || text.includes(q) || keys.includes(q);
      t.style.display = match ? "" : "none";
    });
  });
}
