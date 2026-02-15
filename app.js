// =========================
// 자기효능감 진단(초5) - GitHub Pages + Google Sheets 저장
// =========================

// ====== 0) 여기만 너 값으로 바꾸면 됨 ======
const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbxano2LWOLUGmF1ReY8KO-5XvfxI1uhF1Y89BXWYF-yT8ZLN2vfd96yR0aHayviWDmznA/exec";
const SHEETS_TOKEN = "wkrlgysmdrka0215"; // Code.gs의 WRITE_TOKEN과 동일하게
// =========================================

// 1) 데이터 정의
const DOMAINS = [
  { key: "시작/도전", desc: "새로운 일도 한 번 해보려고 마음을 내는 힘" },
  { key: "노력/지속", desc: "어렵더라도 조금씩 계속 해보는 힘" },
  { key: "전략/문제해결", desc: "방법을 바꿔 보며 해결책을 찾는 힘" },
  { key: "도움요청/정서조절", desc: "마음을 가라앉히고 필요한 도움을 말로 부탁하는 힘" },
];

const ITEMS = [
  // 시작/도전
  { id:"S1", domain:"시작/도전", text:"새로운 활동이더라도 한 번 해보려고 해요.", reverse:false, weight:1, intent:"시작 의지" },
  { id:"S2", domain:"시작/도전", text:"처음 해보는 일도 “일단 시작”을 할 수 있어요.", reverse:false, weight:1, intent:"시작 행동" },
  { id:"S3", domain:"시작/도전", text:"잘 못할까 봐 아예 시작을 미룰 때가 많아요.", reverse:true, weight:1, intent:"회피 경향" },
  { id:"S4", domain:"시작/도전", text:"일단 마음 먹었으면 어려워 보여도 도전해보려 해요.", reverse:false, weight:1, intent:"도전 동기" },
  { id:"S5", domain:"시작/도전", text:"시작하기 전에 걱정이 커져서 손이 잘 안 가요.", reverse:true, weight:1, intent:"걱정으로 멈춤" },
  { id:"S6", domain:"시작/도전", text:"“해보자!”라고 스스로 말하고 움직일 때가 있어요.", reverse:false, weight:1, intent:"자기 격려" },

  // 노력/지속
  { id:"P1", domain:"노력/지속", text:"하다가 힘들어도 조금 더 해보려고 해요.", reverse:false, weight:1, intent:"지속 의지" },
  { id:"P2", domain:"노력/지속", text:"매일 조금씩이라도 꾸준히 하려 해요.", reverse:false, weight:1, intent:"꾸준함" },
  { id:"P3", domain:"노력/지속", text:"한 번 틀리면 바로 그만하고 싶어져요.", reverse:true, weight:1, intent:"실패 후 중단" },
  { id:"P4", domain:"노력/지속", text:"목표가 있으면 끝까지 해내고 싶어요.", reverse:false, weight:1, intent:"완수 지향" },
  { id:"P5", domain:"노력/지속", text:"잘 안 되면 “난 원래 못해”라고 생각해요.", reverse:true, weight:1, intent:"능력 고정 해석" },
  { id:"P6", domain:"노력/지속", text:"조금씩 좋아지는 걸 보면 더 해볼 힘이 나요.", reverse:false, weight:1, intent:"성장 신호 포착" },

  // 전략/문제해결
  { id:"T1", domain:"전략/문제해결", text:"안 되면 다른 방법을 찾아서 해봐요.", reverse:false, weight:1, intent:"전략 전환" },
  { id:"T2", domain:"전략/문제해결", text:"어떻게 하면 문제가 해결될지 순서를 생각해볼 수 있어요.", reverse:false, weight:1, intent:"계획/절차" },
  { id:"T3", domain:"전략/문제해결", text:"문제를 풀다 막히더라도 같은 방법만 계속 반복해요.", reverse:true, weight:1, intent:"고착" },
  { id:"T4", domain:"전략/문제해결", text:"필요한 정보가 있으면 찾아보거나 물어보며 해결해요.", reverse:false, weight:1, intent:"정보 활용" },
  { id:"T5", domain:"전략/문제해결", text:"어려운 문제를 보면 머릿속이 하얘져요.", reverse:true, weight:1, intent:"인지 마비" },
  { id:"T6", domain:"전략/문제해결", text:"작은 힌트를 얻으면 다시 시도할 수 있어요.", reverse:false, weight:1, intent:"힌트 기반 재시도" },

  // 도움요청/정서조절
  { id:"H1", domain:"도움요청/정서조절", text:"혼자 안 되면 도움을 부탁할 수 있어요.", reverse:false, weight:1, intent:"도움요청" },
  { id:"H2", domain:"도움요청/정서조절", text:"답답할 때는 잠깐 쉬고 다시 시작해요.", reverse:false, weight:1, intent:"감정 조절" },
  { id:"H3", domain:"도움요청/정서조절", text:"모르면 물어보는 게 창피하다고 느껴요.", reverse:true, weight:1, intent:"도움요청 회피" },
  { id:"H4", domain:"도움요청/정서조절", text:"내 기분을 말로 설명할 수 있어요.", reverse:false, weight:1, intent:"감정 언어화" },
  { id:"H5", domain:"도움요청/정서조절", text:"속상하면 말이 안 나오고 그냥 참고 있어요.", reverse:true, weight:1, intent:"억눌림" },
  { id:"H6", domain:"도움요청/정서조절", text:"“어떤 도움이 필요해요”라고 구체적으로 말할 수 있어요.", reverse:false, weight:1, intent:"구체적 요청" },
];

const SCALE = [
  { value: 1, face:"😟", label:"전혀 아니에요" },
  { value: 2, face:"🙁", label:"아니에요" },
  { value: 3, face:"😐", label:"보통이에요" },
  { value: 4, face:"🙂", label:"그래요" },
  { value: 5, face:"😄", label:"매우 그래요" },
];

// 2) 상태
let currentIndex = 0;
let answers = Object.fromEntries(ITEMS.map(it => [it.id, null]));

// 3) 요소
const $start = document.getElementById("screen-start");
const $survey = document.getElementById("screen-survey");
const $result = document.getElementById("screen-result");

const $btnStart = document.getElementById("btn-start");
const $btnExit = document.getElementById("btn-exit");
const $btnPrev = document.getElementById("btn-prev");
const $btnNext = document.getElementById("btn-next");

const $progressText = document.getElementById("progressText");
const $progressBar = document.getElementById("progressBar");
const $domainPill = document.getElementById("domainPill");
const $questionText = document.getElementById("questionText");
const $emojiGroup = document.getElementById("emojiGroup");

const $summaryLine = document.getElementById("summaryLine");
const $totalLine = document.getElementById("totalLine");
const $missingLine = document.getElementById("missingLine");
const $metaLine = document.getElementById("metaLine");
const $saveState = document.getElementById("saveState");

const $domainTableWrap = document.getElementById("domainTableWrap");
const $strengthList = document.getElementById("strengthList");
const $growthList = document.getElementById("growthList");
const $actionList = document.getElementById("actionList");
const $helpSentenceList = document.getElementById("helpSentenceList");
const $adultNote = document.getElementById("adultNote");
const $btnRestart = document.getElementById("btn-restart");

const $studentName = document.getElementById("studentName");
const $birthDate = document.getElementById("birthDate");
const $phaseSelect = document.getElementById("phaseSelect");

// 4) 유틸
function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }
function round1(n){ return Math.round(n * 10) / 10; }

function todayYMD(){
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const day = String(d.getDate()).padStart(2,"0");
  return `${y}-${m}-${day}`;
}

function showScreen(name){
  $start.classList.toggle("hidden", name !== "start");
  $survey.classList.toggle("hidden", name !== "survey");
  $result.classList.toggle("hidden", name !== "result");
}

function getItem(idx){ return ITEMS[idx]; }

function domainRank(domainObj){
  const arr = Object.entries(domainObj).map(([k,v]) => ({ k, v }));
  arr.sort((a,b)=> b.v - a.v);
  return arr;
}

function getGrade(total){
  if (total >= 96) return "높음";
  if (total >= 72) return "보통";
  return "도움필요";
}

function makeSummaryLine(grade){
  if (grade === "높음") return "지금의 나는 ‘해볼 수 있어!’ 쪽에 가까워요 😄";
  if (grade === "보통") return "대체로 괜찮지만, 상황에 따라 흔들릴 때도 있어요 🙂";
  return "지금은 연습과 도움이 붙으면 금방 좋아질 수 있어요 🌱";
}

function makeHelpSentences(){
  return [
    "지금 여기서 막혔어요. 힌트 하나만 부탁해요.",
    "제가 해본 방법은 ○○인데요, 다음 한 걸음이 뭐일까요?"
  ];
}

function makeActions(lowDomains){
  const set = new Set(lowDomains);
  const list = [];

  if (set.has("시작/도전")) list.push("시작이 어려울 때는 “2분만 해보기”로 딱 2분만 해요.");
  if (set.has("노력/지속")) list.push("오늘 할 일을 ‘가장 쉬운 한 조각’으로 쪼개서 1개만 끝내요.");
  if (set.has("전략/문제해결")) list.push("안 되면 방법 바꾸기 1번: 순서 바꾸기/예시 보기/힌트 찾기 중 하나.");
  if (set.has("도움요청/정서조절")) list.push("답답하면 10초 숨 고르고, “힌트 하나만요”라고 말해요.");

  const fallback = [
    "끝나면 스스로에게 한마디: “방금 한 건 진짜 시작이야.”",
    "내일을 위해 ‘다음 한 걸음’만 메모해요(예: 1번만 다시 보기).",
    "도움이 필요하면 ‘어디가 어려운지’ 한 문장으로 말해요."
  ];
  for (const f of fallback) {
    if (list.length >= 3) break;
    list.push(f);
  }
  return list.slice(0,3);
}

// 5) 설문 UI
function renderEmojiButtons(selectedValue){
  $emojiGroup.innerHTML = "";

  SCALE.forEach((s, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "emoji";
    btn.dataset.value = String(s.value);
    btn.setAttribute("role", "radio");
    btn.setAttribute("aria-checked", selectedValue === s.value ? "true" : "false");

    const isTab0 = (selectedValue === s.value) || (selectedValue == null && i === 0);
    btn.tabIndex = isTab0 ? 0 : -1;

    btn.innerHTML = `
      <span class="face" aria-hidden="true">${s.face}</span>
      <span class="label">${s.label}</span>
    `;

    btn.addEventListener("click", () => selectValue(s.value));
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectValue(s.value);
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        const dir = e.key === "ArrowRight" ? 1 : -1;
        const next = clamp(i + dir, 0, SCALE.length - 1);
        const nextBtn = $emojiGroup.querySelectorAll(".emoji")[next];
        nextBtn.focus();
      }
    });

    $emojiGroup.appendChild(btn);
  });
}

function updateRovingTabIndex(selectedValue){
  const btns = [...$emojiGroup.querySelectorAll(".emoji")];
  btns.forEach((b, i) => {
    const v = Number(b.dataset.value);
    b.setAttribute("aria-checked", v === selectedValue ? "true" : "false");
    if (selectedValue == null) b.tabIndex = i === 0 ? 0 : -1;
    else b.tabIndex = v === selectedValue ? 0 : -1;
  });
}

function selectValue(value){
  const item = getItem(currentIndex);
  answers[item.id] = value;
  updateRovingTabIndex(value);
}

function renderQuestion(){
  const item = getItem(currentIndex);
  const selected = answers[item.id];

  $progressText.textContent = `${currentIndex + 1} / ${ITEMS.length}`;
  const pct = ((currentIndex + 1) / ITEMS.length) * 100;
  $progressBar.style.width = `${pct}%`;

  $domainPill.textContent = item.domain;
  $questionText.textContent = item.text;

  $emojiGroup.setAttribute("aria-label", `${currentIndex + 1}번 문항 답하기`);
  renderEmojiButtons(selected);

  $btnPrev.disabled = currentIndex === 0;
  $btnNext.textContent = currentIndex === ITEMS.length - 1 ? "결과 보기" : "다음";
}

function countMissing(){
  return Object.values(answers).filter(v => v == null).length;
}

// 6) 채점/분석
function computeScores(){
  const missing = countMissing();
  if (missing >= 3) return { ok:false, reason:"missing3plus", missing };

  const domainScores = {};
  DOMAINS.forEach(d => domainScores[d.key] = []);

  const scoredById = {};
  ITEMS.forEach(it => {
    const raw = answers[it.id];
    if (raw == null) { scoredById[it.id] = null; return; }
    const scored = it.reverse ? (6 - raw) : raw;
    scoredById[it.id] = scored * it.weight;
    domainScores[it.domain].push(scoredById[it.id]);
  });

  const domainMean = {};
  DOMAINS.forEach(d => {
    const arr = domainScores[d.key];
    const mean = arr.length ? (arr.reduce((a,b)=>a+b,0) / arr.length) : 3;
    domainMean[d.key] = mean;
  });

  // 0~2개 누락은 영역 평균으로 대체
  ITEMS.forEach(it => {
    if (scoredById[it.id] == null) scoredById[it.id] = domainMean[it.domain];
  });

  const finalDomain = {};
  DOMAINS.forEach(d => {
    const arr = ITEMS.filter(it => it.domain === d.key).map(it => scoredById[it.id]);
    finalDomain[d.key] = round1(arr.reduce((a,b)=>a+b,0) / arr.length);
  });

  const total = ITEMS.reduce((sum, it) => sum + scoredById[it.id], 0);
  const totalRounded = Math.round(total);

  const grade = getGrade(totalRounded);
  return { ok:true, missing, total: totalRounded, grade, domain: finalDomain };
}

function buildAnalysis(domainObj){
  const ranked = domainRank(domainObj);
  const strengthTop2 = ranked.slice(0,2);
  const growthBottom2 = ranked.slice(-2).reverse();

  const actions = makeActions(growthBottom2.map(x=>x.k));
  const helpSentences = makeHelpSentences();

  return {
    strengthTop2: strengthTop2.map(x => ({ domain: x.k, avg: x.v })),
    growthTop2: growthBottom2.map(x => ({ domain: x.k, avg: x.v })),
    actions,
    helpSentences
  };
}

function renderDomainTable(domainObj){
  const rows = domainRank(domainObj).map(d => {
    const desc = DOMAINS.find(x => x.key === d.k)?.desc || "";
    return `<tr>
      <td><strong>${d.k}</strong><div class="tiny">${desc}</div></td>
      <td>${d.v.toFixed(1)}</td>
    </tr>`;
  }).join("");

  $domainTableWrap.innerHTML = `
    <table aria-label="영역별 점수 표">
      <thead><tr><th>영역</th><th>평균(1~5)</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderListsFromAnalysis(analysis){
  $strengthList.innerHTML = analysis.strengthTop2
    .map(d => `<li><strong>${d.domain}</strong> (평균 ${d.avg.toFixed(1)})</li>`)
    .join("");

  $growthList.innerHTML = analysis.growthTop2
    .map(d => `<li><strong>${d.domain}</strong> (평균 ${d.avg.toFixed(1)})</li>`)
    .join("");

  $actionList.innerHTML = analysis.actions.map(a => `<li>${a}</li>`).join("");
  $helpSentenceList.innerHTML = analysis.helpSentences.map(s => `<li>“${s}”</li>`).join("");
}

function renderAdultNote(domainObj){
  const ranked = domainRank(domainObj);
  const low = ranked[ranked.length - 1];
  const msg = [
    "이 결과는 아이를 평가하기 위한 점수가 아니라, “어느 순간에 힘이 필요한지”를 찾는 지도입니다.",
    `특히 낮은 영역(${low.k})은 ‘연습하면 올라가는 기술’로 다뤄주세요.`,
    "피드백은 “잘했어/못했어”보다 “다음 한 걸음이 뭐였지?”처럼 행동과 전략을 연결해주면 좋아요."
  ];
  $adultNote.textContent = msg.join(" ");
}

// 7) Google Sheets 저장(핵심)
// ⚠️ CORS 프리플라이트 피하려고 text/plain로 보냄
async function saveToGoogleSheet(payload) {
  if (!SHEETS_ENDPOINT || SHEETS_ENDPOINT.includes("PASTE_YOUR")) {
    throw new Error("SHEETS_ENDPOINT 설정이 필요해요.");
  }

  const body = JSON.stringify({ token: SHEETS_TOKEN, data: payload });

  const res = await fetch(SHEETS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body
  });

  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "save failed");
}

function setSaveState(type, text){
  if (!$saveState) return;
  $saveState.className = "save-state" + (type ? ` ${type}` : "");
  $saveState.textContent = text;
}

// 8) 결과 렌더 + 저장
async function renderResult(){
  const res = computeScores();
  showScreen("result");

  const assessedAt = todayYMD();
  const name = ($studentName.value || "").trim();
  const birthDate = ($birthDate.value || "").trim();
  const phase = ($phaseSelect?.value || "학년초");

  $metaLine.textContent = `진단일: ${assessedAt} / 진단 시점: ${phase} / 이름: ${name || "(미입력)"} / 생년월일: ${birthDate || "(미입력)"}`;

  if (!res.ok) {
    $summaryLine.textContent = "빠진 문항이 3개 이상이라 결과를 만들 수 없어요.";
    $totalLine.textContent = "결과 산출 불가";
    $missingLine.textContent = "빠진 문항부터 다시 선택해줘요 🙂";

    $domainTableWrap.innerHTML = "";
    $strengthList.innerHTML = "";
    $growthList.innerHTML = "";
    $actionList.innerHTML = "";
    $helpSentenceList.innerHTML = "";
    $adultNote.textContent = "이번에는 빠진 문항을 먼저 채운 뒤 다시 결과를 확인해 주세요.";

    setSaveState("bad", "저장하지 않았어요(결과 산출 불가).");
    return;
  }

  const analysis = buildAnalysis(res.domain);

  $summaryLine.textContent = makeSummaryLine(res.grade);
  $totalLine.textContent = `${res.total}점 / ${res.grade}`;
  $missingLine.textContent =
    res.missing === 0 ? "모든 문항에 답했어요." : `빠진 문항 ${res.missing}개는 영역 평균으로 채워 계산했어요.`;

  renderDomainTable(res.domain);
  renderListsFromAnalysis(analysis);
  renderAdultNote(res.domain);

  // ===== 시트에 저장할 payload(요구: 이름+생년월일 포함) =====
  const payload = {
    assessedAt,
    phase,
    name,
    birthDate,
    total: res.total,
    grade: res.grade,
    domain: res.domain,
    analysis,
    answers // 원응답(원하면 나중에 빼도 됨)
  };

  // 저장 상태 UI
  setSaveState("", "저장 중…(인터넷 연결 확인)");

  try {
    await saveToGoogleSheet(payload);
    setSaveState("ok", "✅ 구글 스프레드시트에 저장 완료!");
  } catch (e) {
    setSaveState("bad", `❌ 저장 실패: ${String(e.message || e)}`);
  }
}

// 9) 이벤트
$btnStart.addEventListener("click", () => {
  // 이름/생년월일은 네 요구상 키라서, 최소한 빈칸 방지는 하는 게 좋아서 여기서 체크
  const name = ($studentName.value || "").trim();
  const birth = ($birthDate.value || "").trim();

  if (!name || !birth) {
    alert("이름과 생년월일을 먼저 입력해줘요.");
    return;
  }

  currentIndex = 0;
  answers = Object.fromEntries(ITEMS.map(it => [it.id, null]));
  showScreen("survey");
  renderQuestion();

  setTimeout(() => {
    const firstBtn = $emojiGroup.querySelector(".emoji");
    if (firstBtn) firstBtn.focus();
  }, 0);
});

$btnExit.addEventListener("click", () => {
  showScreen("start");
});

$btnPrev.addEventListener("click", () => {
  currentIndex = clamp(currentIndex - 1, 0, ITEMS.length - 1);
  renderQuestion();
});

$btnNext.addEventListener("click", () => {
  if (currentIndex < ITEMS.length - 1) {
    currentIndex += 1;
    renderQuestion();
    return;
  }
  // 마지막 문항에서 "결과 보기" → 결과 계산 + 시트 저장
  renderResult();
});

$btnRestart.addEventListener("click", () => {
  showScreen("start");
});
