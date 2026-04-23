const MODEL_URL = "https://teachablemachine.withgoogle.com/models/n7v0n5Zew/";

let model = null;
let uploadedImageEl = null;
let currentLang = 'ko';

// ── translations ────────────────────────────────
const T = {
  ko: {
    stampBadge:    'AI 관상 테스트',
    titleHTML:     '<span class="t-tofu">두부상</span><span class="vs">vs</span><span class="t-arab">아랍상</span><br/>AI 관상 테스트',
    subtitle:      '사진 한 장으로 AI가 당신의 얼굴을 분석합니다.<br/>AI 학습을 통해 이 서비스를 제공합니다.',
    tofuName:      '두부상',
    tofuDesc:      '순하고 부드러운<br/>얼굴형',
    arabName:      '아랍상',
    arabDesc:      '강렬하고 이국적인<br/>얼굴형',
    btnStart:      '지금 바로 테스트하기',
    how1:          '사진 업로드',
    how2:          'AI 분석',
    how3:          '결과 확인',
    footerDisclaimer: 'AI 학습을 통해 제공되는 관상 테스트입니다.',
    footerPhotoNote:  '업로드한 사진은 기기에서만 처리되며 저장되지 않습니다.',
    footerPrivacy: '개인정보처리방침',
    uploadTitle:   '얼굴 사진을 올려주세요',
    uploadSubtitle:'정면 사진이 가장 정확한 결과를 드려요',
    uploadIconText:'사진 선택',
    uploadDrag:    '사진을 여기에 드래그하거나',
    uploadClick:   '클릭해서 갤러리에서 선택하세요',
    tipsTitle:     '좋은 결과를 위한 팁',
    tip1:          '· 정면을 바라보는 사진',
    tip2:          '· 얼굴이 잘 보이는 밝은 사진',
    tip3:          '· 모자나 선글라스가 없는 사진',
    btnAnalyze:    'AI 분석 시작하기',
    loadingFace:   '분석중',
    loadingTitle:  'AI가 분석 중이에요...',
    step1:         '얼굴 윤곽 분석 중...',
    step2:         '이목구비 비율 측정 중...',
    step3:         '관상 패턴 매칭 중...',
    step4:         '결과 생성 중...',
    resultStamp:   '분석 완료',
    btnShare:      '결과 공유하기',
    btnCopy:       '링크 복사하기',
    btnRetry:      '다른 사진으로 다시 테스트하기',
    modelLoading:  'AI 로딩 중...',
    modelReady:    'AI 준비 완료',
    modelError:    '모델 오류',
    toastCopied:   '결과가 클립보드에 복사됐어요!',
    toastLink:     '링크가 복사됐어요!',
    shareText:     (t) => `나는 ${t}! 두부상 vs 아랍상 AI 테스트 해봐`,
    langBtn:       'EN',
    infoTitle:     '두부상 vs 아랍상이란?',
    infoDesc:      '두부상과 아랍상은 최근 한국에서 유행하고 있는 관상 테스트입니다. 얼굴의 전체적인 인상, 눈매, 이목구비 배치를 기준으로 두 가지 유형으로 나뉩니다.',
    infoTofuDesc:  '두부처럼 부드럽고 순한 인상을 가진 얼굴 유형입니다. 전체적으로 둥글고 온화한 이목구비, 편안한 눈빛이 특징입니다. 처음 만나는 사람도 쉽게 마음을 여는 친근한 매력이 있습니다.',
    infoArabDesc:  '강렬하고 이국적인 인상을 가진 얼굴 유형입니다. 뚜렷한 이목구비, 강한 눈빛, 선명한 윤곽이 특징입니다. 카리스마 넘치는 존재감으로 주위를 압도하는 매력이 있습니다.',
    infoHowTitle:  '두부상 vs 아랍상 테스트 방법',
    infoStep1:     '<strong>사진 업로드</strong> — 정면을 바라보는 밝은 얼굴 사진을 선택합니다.',
    infoStep2:     '<strong>AI 분석</strong> — AI 모델이 얼굴 특징을 자동으로 분석합니다.',
    infoStep3:     '<strong>결과 확인</strong> — 두부상과 아랍상의 비율을 확인하고 공유하세요.',
    infoDisclaimer:'AI 학습을 통해 제공되는 서비스입니다. 업로드된 사진은 서버에 저장되지 않으며 기기 내에서만 처리됩니다.',
  },
  en: {
    stampBadge:    'AI Face Type Test',
    titleHTML:     '<span class="t-tofu">Tofu</span><span class="vs">vs</span><span class="t-arab">Arab</span><br/>AI Face Test',
    subtitle:      'AI analyzes your face from a single photo.<br/>Powered by AI learning.',
    tofuName:      'Tofu Type',
    tofuDesc:      'Soft & gentle<br/>face type',
    arabName:      'Arab Type',
    arabDesc:      'Intense & exotic<br/>face type',
    btnStart:      'Start Test Now',
    how1:          'Upload Photo',
    how2:          'AI Analysis',
    how3:          'See Results',
    footerDisclaimer: 'For entertainment only. Not scientifically based.',
    footerPhotoNote:  'Your photo is processed locally and never stored.',
    footerPrivacy: 'Privacy Policy',
    uploadTitle:   'Upload Your Face Photo',
    uploadSubtitle:'Front-facing photos give the best results',
    uploadIconText:'Select Photo',
    uploadDrag:    'Drag your photo here',
    uploadClick:   'or click to select from gallery',
    tipsTitle:     'Tips for Best Results',
    tip1:          '· Face directly toward the camera',
    tip2:          '· Well-lit photo with a clear face',
    tip3:          '· No hats or sunglasses',
    btnAnalyze:    'Start AI Analysis',
    loadingFace:   'Analyzing',
    loadingTitle:  'AI is analyzing your face...',
    step1:         'Analyzing face contours...',
    step2:         'Measuring facial proportions...',
    step3:         'Matching face patterns...',
    step4:         'Generating results...',
    resultStamp:   'Analysis Complete',
    btnShare:      'Share Results',
    btnCopy:       'Copy Link',
    btnRetry:      'Try with Another Photo',
    modelLoading:  'Loading AI...',
    modelReady:    'AI Ready',
    modelError:    'Model Error',
    toastCopied:   'Result copied to clipboard!',
    toastLink:     'Link copied!',
    shareText:     (t) => `I got ${t}! Try the Tofu vs Arab AI Face Test`,
    langBtn:       '한국어',
    infoTitle:     'What is Tofu Type vs Arab Type?',
    infoDesc:      'Tofu Type and Arab Type are trending face personality tests in Korea. Your face is classified into one of two types based on overall impression, eye shape, and facial features.',
    infoTofuDesc:  'A soft and gentle face type, like tofu. Characterized by rounded, warm features and calm eyes. People feel at ease around you and open up quickly.',
    infoArabDesc:  'A sharp and intense face type. Defined features, strong gaze, and a striking silhouette are the hallmarks. You command attention with a magnetic charisma.',
    infoHowTitle:  'How the Test Works',
    infoStep1:     '<strong>Upload a Photo</strong> — Choose a well-lit, front-facing photo.',
    infoStep2:     '<strong>AI Analysis</strong> — The AI model analyzes your facial features automatically.',
    infoStep3:     '<strong>See Results</strong> — Check your Tofu vs Arab ratio and share it!',
    infoDisclaimer:'This service is powered by AI learning. Uploaded photos are never stored on a server — all processing happens on your device.',
  }
};

const CONTENT = {
  ko: {
    tofu: {
      tagline: "두부처럼 순하고 부드러운 얼굴을 가졌군요!\n온화하고 착한 인상이 물씬 풍깁니다.",
      title:   "두부상의 매력 포인트",
      body1:   "당신은 보는 사람으로 하여금 편안함과 신뢰감을 주는 얼굴을 가졌습니다. 처음 만나는 사람도 금세 마음을 열게 되는 따뜻한 인상이에요. 두부처럼 하얗고 부드러운 피부 톤과 온화한 눈빛이 특징입니다.",
      body2:   "첫인상이 중요한 자리에서 항상 좋은 평가를 받으며, 사람들이 자연스럽게 다가오는 매력이 있습니다.",
      traits:  ["순한 인상", "신뢰감", "온화함", "친근미", "깨끗한 이미지"],
      typeName: "두부상"
    },
    arab: {
      tagline: "강렬하고 이국적인 매력을 가졌군요!\n눈빛 하나로 사람을 사로잡는 타입입니다.",
      title:   "아랍상의 매력 포인트",
      body1:   "당신은 강렬한 눈빛과 뚜렷한 이목구비로 주위를 압도하는 존재감을 가졌습니다. 어딜 가든 시선을 한몸에 받는 카리스마 넘치는 얼굴이에요. 이국적인 매력이 사람들의 시선을 잡아끕니다.",
      body2:   "모델이나 배우처럼 카메라 앞에서 빛나는 타입으로, 강렬한 첫인상을 남기는 얼굴입니다.",
      traits:  ["강렬한 눈빛", "카리스마", "이국적 매력", "존재감", "독보적 외모"],
      typeName: "아랍상"
    }
  },
  en: {
    tofu: {
      tagline: "You have a soft and gentle face like tofu!\nYou radiate warmth and trustworthiness.",
      title:   "Tofu Type Highlights",
      body1:   "You have a face that makes people feel comfortable and at ease. Even strangers open up to you quickly — you radiate a warm and approachable energy. Your soft features and gentle gaze are your signature.",
      body2:   "You always make a great first impression, and people naturally gravitate toward you.",
      traits:  ["Gentle vibe", "Trustworthy", "Warm", "Approachable", "Clean-cut"],
      typeName: "Tofu Type"
    },
    arab: {
      tagline: "You have intense, exotic appeal!\nOne look from you is enough to captivate anyone.",
      title:   "Arab Type Highlights",
      body1:   "You have a powerful presence with sharp features and an intense gaze. Wherever you go, all eyes are on you — you carry a magnetic charisma that turns heads.",
      body2:   "You shine in front of cameras like a model or actor, and always leave a strong first impression.",
      traits:  ["Intense gaze", "Charisma", "Exotic appeal", "Presence", "Standout looks"],
      typeName: "Arab Type"
    }
  }
};

// ── language switching ─────────────────────────
function setLanguage(lang) {
  currentLang = lang;
  const t = T[lang];

  // update all data-i18n elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  // title needs special handling (spans inside)
  document.getElementById('main-title').innerHTML = t.titleHTML;

  // lang button label
  document.getElementById('lang-btn').textContent = t.langBtn;

  // model status text (only if still visible)
  const statusEl = document.getElementById('model-status');
  if (statusEl.style.display !== 'none') {
    const isReady = statusEl.classList.contains('ready');
    document.getElementById('model-status-text').textContent =
      isReady ? t.modelReady : t.modelLoading;
  }

  // update result screen if currently showing
  const resultTitle = document.getElementById('result-type-title');
  if (resultTitle && resultTitle.textContent) {
    const winner = resultTitle.classList.contains('tofu') ? 'tofu' : 'arab';
    updateResultContent(winner);
  }
}

document.getElementById('lang-btn').addEventListener('click', () => {
  setLanguage(currentLang === 'ko' ? 'en' : 'ko');
});

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
  const el  = document.getElementById("model-status");
  const txt = document.getElementById("model-status-text");
  if (ready) {
    el.classList.add("ready");
    txt.textContent = T[currentLang].modelReady;
    setTimeout(() => { el.style.display = "none"; }, 2000);
  } else {
    txt.textContent = T[currentLang].modelError;
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

const uploadArea    = document.getElementById("upload-area");
const fileInput     = document.getElementById("file-input");
const previewWrapper = document.getElementById("preview-wrapper");
const previewImg    = document.getElementById("preview-img");

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
    const img = new Image();
    img.onload = () => {
      uploadedImageEl = img;
      previewImg.src = e.target.result;
      previewWrapper.style.display = "block";
      uploadArea.style.display     = "none";
      document.getElementById("btn-analyze").style.display = "block";
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ── analysis ──────────────────────────────────
document.getElementById("btn-analyze").addEventListener("click", startAnalysis);

async function startAnalysis() {
  if (!uploadedImageEl) return;
  showScreen("screen-loading");
  try {
    await runLoadingAnimation();

    let tofuPct, arabPct;

    if (model) {
      try {
        const timeout = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 8000)
        );
        const predictions = await Promise.race([model.predict(uploadedImageEl), timeout]);
        const map = {};
        predictions.forEach(p => { map[p.className.toLowerCase()] = p.probability; });

        const tofuKey = Object.keys(map).find(k => k.includes("tofu") || k.includes("두부")) || Object.keys(map)[0];
        tofuPct = Math.round((map[tofuKey] || 0) * 100);
        arabPct = 100 - tofuPct;
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
  } catch (e) {
    console.error("분석 오류:", e);
    const tofuFallback = Math.floor(Math.random() * 41) + 30;
    showResult(tofuFallback, 100 - tofuFallback);
  }
}

async function runLoadingAnimation() {
  const steps  = document.querySelectorAll("#loading-steps li");
  const fill   = document.getElementById("progress-fill");
  const delays = [600, 700, 700, 600];

  for (let i = 0; i < steps.length; i++) {
    if (i > 0) { steps[i-1].classList.remove("active"); steps[i-1].classList.add("done"); }
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
function updateResultContent(winner) {
  const data = CONTENT[currentLang][winner];
  document.getElementById("result-type-title").textContent = data.typeName;
  document.getElementById("result-tagline").textContent    = data.tagline;
  document.getElementById("desc-title").textContent        = data.title;
  document.getElementById("desc-body-1").textContent       = data.body1;
  document.getElementById("desc-body-2").textContent       = data.body2;

  const chipsEl = document.getElementById("trait-chips");
  chipsEl.innerHTML = "";
  data.traits.forEach(t => {
    const chip = document.createElement("span");
    chip.className   = "trait-chip";
    chip.textContent = "#" + t;
    chipsEl.appendChild(chip);
  });
}

function showResult(tofuPct, arabPct) {
  const winner  = tofuPct >= arabPct ? "tofu" : "arab";

  document.getElementById("result-photo").src = previewImg.src;

  const titleEl = document.getElementById("result-type-title");
  titleEl.className = "result-type-title " + winner;

  updateResultContent(winner);
  showScreen("screen-result");

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
  const text  = T[currentLang].shareText(title);
  if (navigator.share) {
    navigator.share({ title: text, text, url: location.href }).catch(() => {});
  } else {
    copyToClipboard(text + "\n" + location.href);
    showToast(T[currentLang].toastCopied);
  }
});

document.getElementById("btn-copy").addEventListener("click", () => {
  copyToClipboard(location.href);
  showToast(T[currentLang].toastLink);
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

// ── boot ──────────────────────────────────────
loadModel();
