// =========================
// 자기효능감 진단(초5) - GitHub Pages + Google Sheets 저장
// =========================

// ====== 0) 여기만 너 값으로 바꾸면 됨 ======
const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbzMquZyik2REh8R5MnhfsGtVvCVAatNUMk0dBMqvehMJX-J_RkdbaBAz-SJgMB7dgCrFA/exec";
const SHEETS_TOKEN = "wkrlgysmdrka0215"; // Code.gs의 WRITE_TOKEN과 동일하게
// =========================================

// ====== 1) 기본 설정 ======
const SCALE = [
  { score: 1, emoji: "😟", label: "전혀 아니에요" },
  { score: 2, emoji: "🙁", label: "아니에요" },
  { score: 3, emoji: "😐", label: "보통이에요" },
  { score: 4, emoji: "🙂", label: "그래요" },
  { score: 5, emoji: "😄", label: "매우 그래요" },
];

const DOMAINS = {
  s: { name: "도전", desc: "새로운 일도 한 번 해보려는 마음이에요." },
  t: { name: "전략", desc: "방법을 생각하고 바꿔가며 해결하려는 힘이에요." },
  h: { name: "회복", desc: "답답해도 다시 마음을 다잡고 이어가는 힘이에요." },
  r: { name: "관계", desc: "필요할 때 도움을 구하고 함께 해내는 힘이에요." },
};

// ====== 2) 문항(24) ======
const ITEMS = [
  // --- s: 도전(6) ---
  { id: "s1", domain: "s", text: "새로운 활동이더라도 한 번 해보려고 해요.", reverse: false, weight: 1, intent: "새로운 일을 시도한다" },
  { id: "s2", domain: "s", text: "처음엔 어렵게 느껴져도 조금씩 해보면 된다고 생각해요.", reverse: false, weight: 1, intent: "처음의 어려움을 견딘다" },
  { id: "s3", domain: "s", text: "실수할까 봐 시작하기 전에 미루는 편이에요.", reverse: true,  weight: 1, intent: "실수 두려움으로 미룬다(역)" },
  { id: "s4", domain: "s", text: "일단 마음 먹었으면 어려워 보여도 도전해보려 해요.", reverse: false, weight: 1, intent: "결심 후 도전한다" },
  { id: "s5", domain: "s", text: "잘 안 되더라도 다시 해보려는 마음이 있어요.", reverse: false, weight: 1, intent: "재도전한다" },
  { id: "s6", domain: "s", text: "친구가 잘하면 나는 시작하기가 더 싫어져요.", reverse: true,  weight: 1, intent: "비교 때문에 회피한다(역)" },

  // --- t: 전략(6) ---
  { id: "t1", domain: "t", text: "문제를 풀 때, 먼저 중요한 것부터 골라볼 수 있어요.", reverse: false, weight: 1, intent: "핵심을 정한다" },
  { id: "t2", domain: "t", text: "어떻게 하면 문제가 해결될지 순서를 생각해볼 수 있어요.", reverse: false, weight: 1, intent: "해결 순서를 세운다" },
  { id: "t3", domain: "t", text: "문제를 풀다 막히더라도 같은 방법만 계속 반복해요.", reverse: true,  weight: 1, intent: "방법을 바꾸지 못한다(역)" },
  { id: "t4", domain: "t", text: "필요한 정보가 있으면 찾아보거나 물어보며 해결해요.", reverse: false, weight: 1, intent: "정보를 찾아 해결한다" },
  { id: "t5", domain: "t", text: "내가 한 방법이 안 되면 다른 방법도 떠올려 볼 수 있어요.", reverse: false, weight: 1, intent: "대안을 생각한다" },
  { id: "t6", domain: "t", text: "한 번 틀리면 바로 포기하고 싶어져요.", reverse: true,  weight: 1, intent: "실패 후 포기한다(역)" },

  // --- h: 회복(6) ---
  { id: "h1", domain: "h", text: "답답해도 ‘지금 할 수 있는 한 걸음’을 찾으려 해요.", reverse: false, weight: 1, intent: "다음 한 걸음을 찾는다" },
  { id: "h2", domain: "h", text: "답답할 때는 잠깐 쉬고 다시 시작해요.", reverse: false, weight: 1, intent: "쉬고 재시작한다" },
  { id: "h3", domain: "h", text: "기분이 상하면 하루 종일 아무것도 하기 싫어져요.", reverse: true,  weight: 1, intent: "기분 때문에 멈춘다(역)" },
  { id: "h4", domain: "h", text: "내 기분을 말로 설명할 수 있어요.", reverse: false, weight: 1, intent: "감정을 말로 표현한다" },
  { id: "h5", domain: "h", text: "힘든 일이 있으면 ‘나는 원래 못해’라고 생각해요.", reverse: true,  weight: 1, intent: "능력으로 단정한다(역)" },
  { id: "h6", domain: "h", text: "“어떤 도움이 필요해요”라고 구체적으로 말할 수 있어요.", reverse: false, weight: 1, intent: "필요한 도움을 구체화한다" },

  // --- r: 관계(6) ---
  { id: "r1", domain: "r", text: "모르는 게 있으면 질문해서 해결하려 해요.", reverse: false, weight: 1, intent: "질문으로 해결한다" },
  { id: "r2", domain: "r", text: "도움이 필요해도 혼자 참고 넘어가요.", reverse: true,  weight: 1, intent: "도움을 참고 숨긴다(역)" },
  { id: "r3", domain: "r", text: "내가 잘한 점을 친구나 선생님에게 말해볼 수 있어요.", reverse: false, weight: 1, intent: "성공을 공유한다" },
  { id: "r4", domain: "r", text: "친구와 함께 하면 더 잘할 수 있다고 느낄 때가 있어요.", reverse: false, weight: 1, intent: "협력의 힘을 느낀다" },
  { id: "r5", domain: "r", text: "틀리면 창피해서 말하고 싶지 않아요.", reverse: true,  weight: 1, intent: "창피함 때문에 숨긴다(역)" },
  { id: "r6", domain: "r", text: "친구에게 부탁할 때, 어떤 도움인지 짧게 말할 수 있어요.", reverse: false, weight: 1, intent: "도움을 구체적으로 요청한다" },
];

// ====== 3) DOM ======
const $screenStart = document.getElementById("screen-start");
const $screenSurvey = document.getElementById("screen-survey");
const $screenResult = document.getElementById("screen-result");

const $studentName = document.getElementById("studentName");
const $birthDate = document.getElementById("birthDate");
const $phaseSelect = document.getElementById("phaseSelect");

const $btnStart = document.getElementById("btn-start");
const $btnExit = document.getElementById("btn-exit");
const $btnPrev = document.getElementById("btn-prev");
const $btnNext = document.getElementById("btn-next");
const $btnRestart = document.getElementById("btn-restart");

const $progressText = document.getElementById("progressText");
const $progressBar = document.getElementById("progressBar");
const $domainPill = document.getElementById("domainPill");
const $questionText = document.getElementById("questionText");
const $emojiGroup = document.getElementById("emojiGroup");

const $summaryLine = document.getElementById("summaryLine");
const $totalLine = document.getElementById("totalLine");
const $missingLine = document.getElementById("missingLine");
const $metaLine = document.getElementById("metaLine");
const $domainTableWrap = document.getElementById("domainTableWrap");
const $strengthList = document.getElementById("strengthList");
const $growthList = document.getElementById("growthList");
const $actionList = document.getElementById("actionList");
const $helpSentenceList = document.getElementById("helpSentenceList");
const $adultNote = document.getElementById("adultNote");
const $saveState = document.getElementById("saveState");

// ====== 4) 상태 ======
let currentIndex = 0;
let answers = {}; // { [itemId]: 1~5 or null }
let didAutoSave = false;

// ====== 5) 유틸 ======
function todayYMD() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function showScreen(which) {
  $screenStart.classList.add("hidden");
  $screenSurvey.classList.add("hidden");
  $screenResult.classList.add("hidden");

  if (which === "start") $screenStart.classList.remove("hidden");
  if (which === "survey") $screenSurvey.classList.remove("hidden");
  if (which === "result") $screenResult.classList.remove("hidden");
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function round1(n) {
  return Math.round(n * 10) / 10;
}

function reverseScore(raw) {
  return 6 - raw; // 1~5 -> 5~1
}

function getDomainName(domainKey) {
  return DOMAINS[domainKey]?.name || "영역";
}

/* ====== ✅ 원래 CSS(.face/.label)에 맞춘 이모지 렌더 ====== */
function renderEmojiGroup(selectedScore) {
  $emojiGroup.innerHTML = "";

  SCALE.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "emoji";
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-label", `${opt.emoji} ${opt.label} (${opt.score}점)`);
    btn.dataset.score = String(opt.score);

    const isSelected = selectedScore === opt.score;
    btn.setAttribute("aria-checked", isSelected ? "true" : "false");

    // 탭 접근성: 선택된 것 우선, 없으면 첫 번째만 0
    btn.tabIndex = isSelected ? 0 : (idx === 0 && selectedScore == null ? 0 : -1);

    // ✅ 원래 CSS가 기대하는 구조
    btn.innerHTML = `
      <span class="face" aria-hidden="true">${opt.emoji}</span>
      <span class="label">${opt.label}(${opt.score})</span>
    `;

    btn.addEventListener("click", () => selectScore(opt.score));

    btn.addEventListener("keydown", (e) => {
      const key = e.key;
      if (key === "Enter" || key === " ") {
        e.preventDefault();
        selectScore(opt.score);
        return;
      }
      if (key === "ArrowRight" || key === "ArrowDown") {
        e.preventDefault();
        focusEmojiByOffset(+1);
        return;
      }
      if (key === "ArrowLeft" || key === "ArrowUp") {
        e.preventDefault();
        focusEmojiByOffset(-1);
        return;
      }
    });

    $emojiGroup.appendChild(btn);
  });
}

function focusEmojiByOffset(dir) {
  const btns = Array.from($emojiGroup.querySelectorAll(".emoji"));
  const current = document.activeElement;
  const idx = btns.indexOf(current);
  const nextIdx = idx < 0 ? 0 : clamp(idx + dir, 0, btns.length - 1);
  btns[nextIdx]?.focus();
}

function setSelectedAria(score) {
  const btns = Array.from($emojiGroup.querySelectorAll(".emoji"));
  btns.forEach((b) => {
    const s = Number(b.dataset.score);
    const isSel = s === score;
    b.setAttribute("aria-checked", isSel ? "true" : "false");
    b.tabIndex = isSel ? 0 : -1;
  });
}

// ====== 7) 설문 진행 ======
function initAnswers() {
  answers = Object.fromEntries(ITEMS.map((it) => [it.id, null]));
}

function renderQuestion() {
  const item = ITEMS[currentIndex];
  const answered = answers[item.id];

  $progressText.textContent = `${currentIndex + 1} / ${ITEMS.length}`;
  const pct = ((currentIndex + 1) / ITEMS.length) * 100;
  $progressBar.style.width = `${pct}%`;

  $domainPill.textContent = getDomainName(item.domain);
  $questionText.textContent = item.text;

  renderEmojiGroup(answered);
}

function selectScore(score) {
  const item = ITEMS[currentIndex];
  answers[item.id] = score;
  setSelectedAria(score);
  $btnNext.focus();
}

function goPrev() {
  if (currentIndex <= 0) return;
  currentIndex -= 1;
  renderQuestion();
  setTimeout(() => {
    const sel = answers[ITEMS[currentIndex].id];
    const btn = sel
      ? $emojiGroup.querySelector(`.emoji[data-score="${sel}"]`)
      : $emojiGroup.querySelector(".emoji");
    btn?.focus();
  }, 0);
}

function goNext() {
  const item = ITEMS[currentIndex];
  if (answers[item.id] == null) {
    alert("이 문항에 답을 골라줘요 🙂");
    return;
  }

  if (currentIndex >= ITEMS.length - 1) {
    renderResult();
    return;
  }

  currentIndex += 1;
  renderQuestion();
  setTimeout(() => {
    const sel = answers[ITEMS[currentIndex].id];
    const btn = sel
      ? $emojiGroup.querySelector(`.emoji[data-score="${sel}"]`)
      : $emojiGroup.querySelector(".emoji");
    btn?.focus();
  }, 0);
}

// ====== 8) 채점/등급/리포트 ======
function scoreAll() {
  const scored = ITEMS.map((it) => {
    const raw = answers[it.id];
    if (raw == null) return { ...it, raw: null, score: null };
    const s = it.reverse ? reverseScore(raw) : raw;
    return { ...it, raw, score: s };
  });

  const missingCount = scored.filter((x) => x.score == null).length;
  if (missingCount >= 3) return { ok: false, reason: "missing3", missingCount };

  const byDomain = {};
  for (const key of Object.keys(DOMAINS)) {
    const rows = scored.filter((x) => x.domain === key);
    const answeredScores = rows.filter((r) => r.score != null).map((r) => r.score);
    const avg = round1(answeredScores.reduce((a, b) => a + b, 0) / answeredScores.length);
    byDomain[key] = {
      key, name: DOMAINS[key].name, desc: DOMAINS[key].desc,
      avg, answeredCount: answeredScores.length, missingInDomain: rows.length - answeredScores.length,
    };
  }

  let total = 0;
  scored.forEach((r) => {
    if (r.score != null) total += r.score;
    else total += Math.round(byDomain[r.domain].avg);
  });

  let grade = "보통";
  if (total >= 96) grade = "높음";
  if (total <= 72) grade = "도움필요";

  return { ok: true, total, grade, missingCount, byDomain, scored };
}

function getTopDomains(byDomain, n = 2, order = "desc") {
  const arr = Object.values(byDomain).slice();
  arr.sort((a, b) => (order === "desc" ? b.avg - a.avg : a.avg - b.avg));
  return arr.slice(0, n);
}

function domainTableHTML(byDomain) {
  const rows = Object.values(byDomain)
    .map((d) => `
      <tr>
        <td>${d.name}</td>
        <td><strong>${d.avg.toFixed(1)}</strong></td>
        <td class="tiny">${d.desc}</td>
      </tr>
    `).join("");

  return `
    <table>
      <thead>
        <tr>
          <th>영역</th>
          <th>평균</th>
          <th>설명</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function buildActions(strengthTop, growthTop) {
  const g1 = growthTop[0]?.key;
  const g2 = growthTop[1]?.key;
  const actions = [];
  const pushUnique = (t) => { if (!actions.includes(t)) actions.push(t); };

  const ACTION_BANK = {
    s: [
      "새로운 일은 ‘1분만 해보기’로 시작해요.",
      "오늘은 ‘한 번 더’만 해보고 멈춰도 괜찮아요.",
      "시작이 어려우면 ‘첫 단계만’ 정해서 해봐요.",
    ],
    t: [
      "막히면 ‘다른 방법 1개’만 떠올려 바꿔봐요.",
      "해결 순서를 1→2→3으로 짧게 적어봐요.",
      "필요한 정보를 ‘찾기/물어보기’ 중 하나로 바로 해봐요.",
    ],
    h: [
      "답답하면 30초 쉬고, 다시 ‘한 걸음’만 해봐요.",
      "기분을 ‘지금 ○○해서 ○○해요’처럼 말로 붙여봐요.",
      "실수해도 ‘방법이 어려웠던 거야’라고 말해줘요.",
    ],
    r: [
      "도움이 필요하면 ‘어떤 부분이 막혔는지’ 한 문장으로 말해봐요.",
      "질문할 때 ‘지금 ○번에서 막혔어요’라고 구체적으로 말해봐요.",
      "친구와 함께 할 때 ‘내가 할 일/너가 할 일’을 나눠봐요.",
    ],
  };

  (ACTION_BANK[g1] || []).slice(0, 2).forEach(pushUnique);
  const pickThirdKey = g2 || strengthTop[0]?.key || "t";
  (ACTION_BANK[pickThirdKey] || []).slice(0, 1).forEach(pushUnique);

  return actions.slice(0, 3);
}

function buildHelpSentences() {
  return [
    "선생님, 제가 지금 ○○에서 막혔어요. 다음에 뭘 하면 좋을까요?",
    "친구야, ○○를 하는데 ○○가 어려워. 이 부분만 같이 해줄 수 있어?",
  ];
}

function buildAdultNote(grade) {
  if (grade === "높음") {
    return "현재는 ‘해보려는 마음(도전)–방법 찾기(전략)–다시 시작(회복)–도움 요청(관계)’ 흐름이 비교적 잘 이어지고 있어요. 성공의 이유를 ‘내 전략/내 노력’로 연결해주면 더 단단해져요.";
  }
  if (grade === "도움필요") {
    return "지금은 ‘시작/전환/도움 요청’에서 멈추는 구간이 있을 수 있어요. 결과는 낙인이 아니라 ‘지금 필요한 도구’를 찾는 신호예요. 과제를 더 작게 쪼개고, 막힐 때 쓸 질문 1개를 고정해주면 회복이 빨라져요.";
  }
  return "현재는 기본 힘은 있는데 상황에 따라 흔들릴 수 있어요. 강점은 유지하고, 낮게 나온 영역은 ‘작게 자주’ 연습하면 좋아요. 특히 막힐 때 말로 정리하기와 도움 요청 문장을 함께 연습해보세요.";
}

function renderResult() {
  const name = ($studentName.value || "").trim();
  const birthDate = ($birthDate.value || "").trim();
  const phase = ($phaseSelect.value || "").trim();
  const assessedAt = todayYMD();

  const res = scoreAll();
  showScreen("result");

  $saveState.textContent = "";
  didAutoSave = false;

  if (!res.ok) {
    $summaryLine.textContent = "아직 답이 부족해서 결과를 만들 수 없어요.";
    $totalLine.textContent = "결과 산출 불가";
    $missingLine.textContent = `누락 문항: ${res.missingCount}개 (3개 이상이면 다시 응답이 필요해요.)`;
    $metaLine.textContent = `이름: ${name || "(미입력)"} / 생년월일: ${birthDate || "(미입력)"} / 진단 시점: ${phase || "(미입력)"} / 진단일: ${assessedAt}`;
    $domainTableWrap.innerHTML = "";
    $strengthList.innerHTML = "";
    $growthList.innerHTML = "";
    $actionList.innerHTML = "";
    $helpSentenceList.innerHTML = "";
    $adultNote.textContent = "";
    return;
  }

  const grade = res.grade;
  const total = res.total;

  const gradeMsg =
    grade === "높음" ? "지금은 ‘해볼 수 있어!’ 힘이 꽤 탄탄해요."
    : grade === "도움필요" ? "지금은 ‘도움 받으며 다시 해보기’ 연습이 필요해요."
    : "지금은 ‘할 수 있어’ 힘이 자라는 중이에요.";

  $summaryLine.textContent = gradeMsg;
  $totalLine.textContent = `${total}점 / ${grade}`;
  $missingLine.textContent = res.missingCount > 0 ? `누락 문항: ${res.missingCount}개 (영역 평균으로 보정했어요.)` : "";
  $metaLine.textContent = `이름: ${name || "(미입력)"} / 생년월일: ${birthDate || "(미입력)"} / 진단 시점: ${phase || "(미입력)"} / 진단일: ${assessedAt}`;

  $domainTableWrap.innerHTML = domainTableHTML(res.byDomain);

  const strengthTop = getTopDomains(res.byDomain, 2, "desc");
  const growthTop = getTopDomains(res.byDomain, 2, "asc");

  $strengthList.innerHTML = strengthTop
    .map((d) => `<li><strong>${d.name}</strong> (${d.avg.toFixed(1)}) - ${d.desc}</li>`)
    .join("");

  $growthList.innerHTML = growthTop
    .map((d) => `<li><strong>${d.name}</strong> (${d.avg.toFixed(1)}) - 조금씩 연습하면 더 좋아져요.</li>`)
    .join("");

  const actions = buildActions(strengthTop, growthTop);
  $actionList.innerHTML = actions.map((t) => `<li>${t}</li>`).join("");

  const helps = buildHelpSentences();
  $helpSentenceList.innerHTML = helps.map((t) => `<li>${t}</li>`).join("");

  $adultNote.textContent = buildAdultNote(grade);

  const payload = {
    key: `${name}|${birthDate}`,
    name,
    birthDate,
    phase,
    assessedAt,
    total,
    grade,
    domainAvg: Object.fromEntries(Object.values(res.byDomain).map((d) => [d.key, d.avg])),
    analysis: {
      summary: gradeMsg,
      strengths: strengthTop.map((d) => ({ domain: d.key, name: d.name, avg: d.avg })),
      growth: growthTop.map((d) => ({ domain: d.key, name: d.name, avg: d.avg })),
      actions,
      helpSentences: helps,
    },
    answers,
  };

  autoSaveOnce(payload);
}

async function autoSaveOnce(payload) {
  if (didAutoSave) return;
  didAutoSave = true;

  if (!SHEETS_ENDPOINT || SHEETS_ENDPOINT.includes("PASTE_")) {
    $saveState.textContent = "저장 설정이 아직 안 되어 있어요. (SHEETS_ENDPOINT 확인)";
    $saveState.className = "save-state";
    return;
  }
  if (!SHEETS_TOKEN || SHEETS_TOKEN.includes("PASTE_")) {
    $saveState.textContent = "저장 설정이 아직 안 되어 있어요. (SHEETS_TOKEN 확인)";
    $saveState.className = "save-state";
    return;
  }

  $saveState.textContent = "저장 중...";
  $saveState.className = "save-state";

  try {
    const res = await fetch(SHEETS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: SHEETS_TOKEN, data: payload }),
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.ok === false) {
      const msg = json?.error || `HTTP ${res.status}`;
      throw new Error(msg);
    }

    $saveState.textContent = "✅ 저장 완료!";
    $saveState.className = "save-state ok";
  } catch (e) {
    $saveState.textContent = `❌ 저장 실패: ${String(e.message || e)}`;
    $saveState.className = "save-state bad";
  }
}

// ====== 9) 이벤트 ======
$btnStart.addEventListener("click", () => {
  const name = ($studentName.value || "").trim();
  const birth = ($birthDate.value || "").trim();
  const phase = ($phaseSelect.value || "").trim();

  if (!name || !birth || !phase) {
    alert("이름, 생년월일, 진단 시점을 모두 입력해줘요.");
    return;
  }

  currentIndex = 0;
  initAnswers();
  showScreen("survey");
  renderQuestion();

  setTimeout(() => {
    const firstBtn = $emojiGroup.querySelector(".emoji");
    firstBtn?.focus();
  }, 0);
});

$btnExit.addEventListener("click", () => {
  const ok = confirm("설문을 그만하고 처음 화면으로 돌아갈까요?");
  if (!ok) return;
  showScreen("start");
});

$btnPrev.addEventListener("click", goPrev);
$btnNext.addEventListener("click", goNext);

$btnRestart.addEventListener("click", () => {
  currentIndex = 0;
  initAnswers();
  didAutoSave = false;
  showScreen("start");
});

// 처음 진입
showScreen("start");
initAnswers();

