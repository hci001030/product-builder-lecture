const MODEL_URL = "https://teachablemachine.withgoogle.com/models/n7v0n5Zew/";

let model = null;
let uploadedImageEl = null;

const CONTENT = {
  tofu: {
    emoji: "🫙",
    tagline: "두부처럼 순하고 부드러운 얼굴을 가졌군요!\n온화하고 착한 인상이 물씬 풍깁니다.",
    title: "두부상의 매력 포인트",
    body1: "당신은 보는 사람으로 하여금 편안함과 신뢰감을 주는 얼굴을 가졌습니다. 처음 만나는 사람도 금세 마음을 열게 되는 따뜻한 인상이에요. 두부처럼 하얗고 부드러운 피부 톤과 온화한 눈빛이 특징입니다.",
    body2: "첫인상이 중요한 자리에서 항상 좋은 평가를 받으며, 사람들이 자연스럽게 다가오는 매력이 있습니다.",
    traits: ["순한 인상", "신뢰감", "온화함", "친근미", "깨끗한 이미지"]
  },
  arab: {
    emoji: "🧣",
    tagline: "강렬하고 이국적인 매력을 가졌군요!\n눈빛 하나로 사람을 사로잡는 타입입니다.",
    title: "아랍상의 매력 포인트",
    body1: "당신은 강렬한 눈빛과 뚜렷한 이목구비로 주위를 압도하는 존재감을 가졌습니다. 어딜 가든 시선을 한몸에 받는 카리스마 넘치는 얼굴이에요. 이국적인 매력이 사람들의 시선을 잡아끕니다.",
    body2: "모델이나 배우처럼 카메라 앞에서 빛나는 타입으로, 강렬한 첫인상을 남기는 얼굴입니다.",
    traits: ["강렬한 눈빛", "카리스마", "이국적 매력", "존재감", "독보적 외모"]
  }
};

// ── model loading ──────────────────────────────
async function loadModel() {
  try {
    model = await window.tmImage.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json");
    setModelStatus(true);
  } catch (e) {
    console.error("모델 로딩 실패:", e);
    setModelStatus(false);
  }
}

function setModelStatus(ready) {
  const el = document.getElementById("model-status");
  const txt = document.getElementById("model-status-text");
  if (ready) {
    el.classList.add("ready");
    txt.textContent = "AI 준비 완료";
    setTimeout(() => { el.style.display = "none"; }, 2000);
  } else {
    txt.textContent = "모델 오류";
  }
}

// ── screen navigation ──────────────────────────
function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  window.scrollTo(0, 0);
}

// ── file upload / preview ──────────────────────
document.getElementById("btn-to-upload").addEventListener("click", () => showScreen("screen-upload"));

const uploadArea = document.getElementById("upload-area");
const fileInput  = document.getElementById("file-input");
const previewWrapper = document.getElementById("preview-wrapper");
const previewImg     = document.getElementById("preview-img");

uploadArea.addEventListener("click", () => fileInput.click());
uploadArea.addEventListener("dragover", e => { e.preventDefault(); uploadArea.classList.add("drag-over"); });
uploadArea.addEventListener("dragleave", () => uploadArea.classList.remove("drag-over"));
uploadArea.addEventListener("drop", e => {
  e.preventDefault();
  uploadArea.classList.remove("drag-over");
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) handleFile(file);
});

fileInput.addEventListener("change", () => {
  if (fileInput.files[0]) handleFile(fileInput.files[0]);
});

document.getElementById("remove-btn").addEventListener("click", () => {
  previewWrapper.style.display = "none";
  uploadArea.style.display     = "block";
  document.getElementById("btn-analyze").style.display = "none";
  uploadedImageEl = null;
  fileInput.value = "";
});

function handleFile(file) {
  const reader = new FileReader();
  reader.onload = e => {
    previewImg.src = e.target.result;
    previewWrapper.style.display = "block";
    uploadArea.style.display     = "none";
    document.getElementById("btn-analyze").style.display = "block";

    const img = new Image();
    img.onload = () => { uploadedImageEl = img; };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ── analysis ──────────────────────────────────
document.getElementById("btn-analyze").addEventListener("click", startAnalysis);

async function startAnalysis() {
  if (!uploadedImageEl) return;
  showScreen("screen-loading");
  await runLoadingAnimation();

  let tofuPct, arabPct;

  if (model) {
    try {
      const predictions = await model.predict(uploadedImageEl);
      const map = {};
      predictions.forEach(p => { map[p.className.toLowerCase()] = p.probability; });

      const tofuKey = Object.keys(map).find(k => k.includes("tofu") || k.includes("두부")) || Object.keys(map)[0];
      const arabKey = Object.keys(map).find(k => k.includes("arab") || k.includes("아랍")) || Object.keys(map)[1];

      tofuPct = Math.round((map[tofuKey] || 0) * 100);
      arabPct = Math.round((map[arabKey] || 0) * 100);

      // ensure sum = 100
      const total = tofuPct + arabPct;
      if (total !== 100) { arabPct = 100 - tofuPct; }
    } catch (e) {
      console.error("예측 오류:", e);
      tofuPct = Math.floor(Math.random() * 41) + 30;
      arabPct = 100 - tofuPct;
    }
  } else {
    tofuPct = Math.floor(Math.random() * 41) + 30;
    arabPct = 100 - tofuPct;
  }

  showResult(tofuPct, arabPct);
}

async function runLoadingAnimation() {
  const steps = document.querySelectorAll("#loading-steps li");
  const fill  = document.getElementById("progress-fill");
  const delays = [600, 700, 700, 600];

  for (let i = 0; i < steps.length; i++) {
    if (i > 0) steps[i - 1].classList.remove("active"), steps[i - 1].classList.add("done");
    steps[i].classList.add("active");
    fill.style.width = ((i + 1) / steps.length * 100) + "%";
    await sleep(delays[i]);
  }
  steps[steps.length - 1].classList.remove("active");
  steps[steps.length - 1].classList.add("done");
  fill.style.width = "100%";
  await sleep(300);
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ── show result ────────────────────────────────
function showResult(tofuPct, arabPct) {
  const winner = tofuPct >= arabPct ? "tofu" : "arab";
  const data   = CONTENT[winner];

  document.getElementById("result-photo").src = previewImg.src;
  document.getElementById("result-emoji").textContent = data.emoji;

  const titleEl = document.getElementById("result-type-title");
  titleEl.textContent = winner === "tofu" ? "두부상" : "아랍상";
  titleEl.className   = "result-type-title " + winner;

  document.getElementById("result-tagline").textContent = data.tagline;
  document.getElementById("desc-title").textContent  = data.title;
  document.getElementById("desc-body-1").textContent = data.body1;
  document.getElementById("desc-body-2").textContent = data.body2;

  const chipsEl = document.getElementById("trait-chips");
  chipsEl.innerHTML = "";
  data.traits.forEach(t => {
    const chip = document.createElement("span");
    chip.className   = "trait-chip";
    chip.textContent = "#" + t;
    chipsEl.appendChild(chip);
  });

  showScreen("screen-result");

  // animate bars after render
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.getElementById("bar-tofu").style.width = tofuPct + "%";
      document.getElementById("bar-arab").style.width = arabPct + "%";
      animateNumber("val-tofu", tofuPct);
      animateNumber("val-arab", arabPct);
    }, 100);
  });
}

function animateNumber(id, target) {
  const el = document.getElementById(id);
  let current = 0;
  const step  = Math.ceil(target / 30);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + "%";
    if (current >= target) clearInterval(timer);
  }, 33);
}

// ── share / copy / retry ───────────────────────
document.getElementById("btn-share").addEventListener("click", () => {
  const title = document.getElementById("result-type-title").textContent;
  const text  = `나는 ${title}! 두부상 vs 아랍상 AI 테스트 해봐 🔮`;
  if (navigator.share) {
    navigator.share({ title: "두부상 vs 아랍상 테스트", text, url: location.href }).catch(() => {});
  } else {
    copyToClipboard(text + "\n" + location.href);
    showToast("결과가 클립보드에 복사됐어요!");
  }
});

document.getElementById("btn-copy").addEventListener("click", () => {
  copyToClipboard(location.href);
  showToast("링크가 복사됐어요!");
});

document.getElementById("btn-retry").addEventListener("click", () => {
  document.getElementById("remove-btn").click();
  showScreen("screen-upload");
});

function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}
function fallbackCopy(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity  = "0";
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

// ── fake counter increment ─────────────────────
function animateCounter() {
  const el = document.getElementById("test-count");
  let base = 12847;
  el.textContent = base.toLocaleString();
  setInterval(() => {
    base += Math.floor(Math.random() * 3);
    el.textContent = base.toLocaleString();
  }, 4000);
}

// ── boot ──────────────────────────────────────
loadModel();
animateCounter();
