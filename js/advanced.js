import { appState, $, COMMON_STATS, STAT_LABELS, data } from "./constants_data.js";
import { makeId, save } from "./main.js";
import { readImage, renderAll } from "./rendering.js";
import { showToast, screenEffect } from "./combat.js";
import { addLog, esc, escAttr } from "./creation.js";

export function bindAdvancedSystems() {
  $("playCutsceneBtn")?.addEventListener("click", addAndPlayCutscene);
  $("addSfxBtn")?.addEventListener("click", addSfx);
  $("addFearRuleBtn")?.addEventListener("click", addFearRule);
  $("addCurseBtn")?.addEventListener("click", addCurse);
  $("addDeityBtn")?.addEventListener("click", addDeity);
  $("addResourceBtn")?.addEventListener("click", addResource);
  $("addBossPhaseBtn")?.addEventListener("click", addBossPhase);
  $("addBossPartBtn")?.addEventListener("click", addBossPart);
  $("addInspectBtn")?.addEventListener("click", addInspection);
  $("addDungeonNodeBtn")?.addEventListener("click", addDungeonNode);
  $("addEnvironmentBtn")?.addEventListener("click", addEnvironment);
  $("addCampBtn")?.addEventListener("click", addCamp);
  $("addTimerBtn")?.addEventListener("click", addTimer);
  $("addWorldChangeBtn")?.addEventListener("click", addWorldChange);
  $("addRecipeBtn")?.addEventListener("click", addRecipe);
  $("addSetBtn")?.addEventListener("click", addSet);
  $("addPersonalQuestBtn")?.addEventListener("click", addPersonalQuest);
  $("addMemoryBtn")?.addEventListener("click", addMemory);
  $("addEndingBtn")?.addEventListener("click", addEnding);
  $("runtimePlayCutsceneBtn")?.addEventListener("click", () => {
    const c = data.advanced.cutscenes.find(x => x.id === $("runtimeCutsceneSelect")?.value);
    if (c) playCutscene(c);
  });
  $("runtimeRevealInspectBtn")?.addEventListener("click", revealInspection);
  $("runtimeFearCheckBtn")?.addEventListener("click", runFearCheck);
  $("runtimeCampBtn")?.addEventListener("click", runCamp);
  $("exportSessionBtn")?.addEventListener("click", exportSessionTxt);
  $("closeCutsceneBtn")?.addEventListener("click", () => $("cutsceneOverlay")?.classList.add("hidden"));
  fillFearStatSelect();
}

export function renderAdvancedSystems() {
  fillAdvancedSelects();
  renderAdvancedLists();
  renderTimerView();
}

export function fillAdvancedSelects() {
  fillNpcPortraitSelect();
  fillPhaseBossSelect();
  fillRuntimeCutsceneSelect();
  fillRuntimeInspectSelect();
  fillRuntimeFearSelect();
  fillRuntimeCampSelect();
  fillFearTargetSelect();
}

export function fillFearStatSelect() {
  const s = $("fearStat");
  if (!s || s.options.length) return;
  COMMON_STATS.forEach(stat => s.add(new Option(STAT_LABELS[stat], stat)));
}

export function fillNpcPortraitSelect() {
  const s = $("cutscenePortraitNpc");
  if (!s) return;
  const prev = s.value;
  s.innerHTML = `<option value="">초상화 없음</option>`;
  data.npcs.forEach(n => s.add(new Option(n.name, n.id)));
  if (prev) s.value = prev;
}

export function fillPhaseBossSelect() {
  const s = $("phaseBossSelect");
  if (!s) return;
  const prev = s.value;
  s.innerHTML = "";
  data.bosses.forEach(b => s.add(new Option(b.name, b.id)));
  if (prev) s.value = prev;
}

export function fillRuntimeCutsceneSelect() {
  const s = $("runtimeCutsceneSelect");
  if (!s) return;
  const prev = s.value;
  s.innerHTML = "";
  data.advanced.cutscenes.forEach(c => s.add(new Option(c.speaker || "컷신", c.id)));
  if (prev) s.value = prev;
}

export function fillRuntimeInspectSelect() {
  const s = $("runtimeInspectSelect");
  if (!s) return;
  const prev = s.value;
  s.innerHTML = "";
  data.advanced.inspections.forEach(i => s.add(new Option(i.name, i.id)));
  if (prev) s.value = prev;
}

export function fillRuntimeFearSelect() {
  const s = $("runtimeFearSelect");
  if (!s) return;
  const prev = s.value;
  s.innerHTML = "";
  data.advanced.fearRules.forEach(f => s.add(new Option(f.name, f.id)));
  if (prev) s.value = prev;
}

export function fillRuntimeCampSelect() {
  const s = $("runtimeCampSelect");
  if (!s) return;
  const prev = s.value;
  s.innerHTML = "";
  data.advanced.camps.forEach(c => s.add(new Option(c.name, c.id)));
  if (prev) s.value = prev;
}

export function fillFearTargetSelect() {
  const s = $("runtimeFearTarget");
  if (!s) return;
  const prev = s.value;
  s.innerHTML = "";
  data.players.forEach(p => s.add(new Option(p.name, p.id)));
  if (prev) s.value = prev;
}

export function addAndPlayCutscene() {
  const npc = data.npcs.find(n => n.id === $("cutscenePortraitNpc")?.value);
  const c = {
    id: makeId(),
    speaker: $("cutsceneSpeaker")?.value || npc?.name || "???",
    text: $("cutsceneText")?.value || "",
    portrait: npc?.portrait || ""
  };
  data.advanced.cutscenes.push(c);
  addLog(`컷신 저장: ${c.speaker}`);
  save(); renderAdvancedSystems(); playCutscene(c); showToast("컷신 저장 완료");
}

export function playCutscene(c) {
  $("cutsceneSpeakerView").textContent = c.speaker || "???";
  $("cutsceneTextView").textContent = c.text || "";
  if (c.portrait) {
    $("cutscenePortrait").src = c.portrait;
    $("cutscenePortrait").classList.remove("hidden");
  } else {
    $("cutscenePortrait").classList.add("hidden");
  }
  $("cutsceneOverlay").classList.remove("hidden");
  data.advanced.sessionNotes.push(`[컷신] ${c.speaker}: ${c.text}`);
  save();
}

export function addSfx() { data.advanced.sfx.push({ id: makeId(), name: $("sfxName")?.value || "효과음", url: $("sfxUrl")?.value || "" }); save(); renderAdvancedSystems(); }
export function addFearRule() { data.advanced.fearRules.push({ id: makeId(), name: $("fearName")?.value || "공포 판정", stat: $("fearStat")?.value || "MND", difficulty: Number($("fearDifficulty")?.value || 10), madnessGain: Number($("fearMadnessGain")?.value || 1) }); save(); renderAdvancedSystems(); }
export function addCurse() { data.advanced.curses.push({ id: makeId(), name: $("curseName")?.value || "저주", madnessPerTurn: Number($("curseMadnessPerTurn")?.value || 0), hpPerTurn: Number($("curseHpPerTurn")?.value || 0) }); save(); renderAdvancedSystems(); }
export function addDeity() { data.advanced.deities.push({ id: makeId(), name: $("deityName")?.value || "이름 없는 신", faithReq: Number($("deityFaithReq")?.value || 0), blessing: $("deityBlessing")?.value || "" }); save(); renderAdvancedSystems(); }
export function addResource() { data.advanced.resources.push({ id: makeId(), name: $("resourceName")?.value || "자원", value: Number($("resourceDefault")?.value || 0) }); save(); renderAdvancedSystems(); }
export function addBossPhase() { data.advanced.bossPhases.push({ id: makeId(), bossId: $("phaseBossSelect")?.value || "", hpPercent: Number($("phaseHpPercent")?.value || 50), name: $("phaseName")?.value || "페이즈", bgm: $("phaseBgm")?.value || "", effect: $("phaseEffect")?.value || "" }); save(); renderAdvancedSystems(); }
export function addBossPart() { data.advanced.bossParts.push({ id: makeId(), bossId: $("phaseBossSelect")?.value || "", name: $("bossPartName")?.value || "부위", hp: Number($("bossPartHp")?.value || 10), effect: $("bossPartEffect")?.value || "" }); save(); renderAdvancedSystems(); }
export function addInspection() { data.advanced.inspections.push({ id: makeId(), name: $("inspectName")?.value || "조사 포인트", public: $("inspectPublic")?.value || "", secret: $("inspectSecret")?.value || "" }); save(); renderAdvancedSystems(); }
export function addDungeonNode() { data.advanced.dungeonNodes.push({ id: makeId(), name: $("dungeonNodeName")?.value || "노드", choices: ($("dungeonChoices")?.value || "").split("\n").filter(Boolean) }); save(); renderAdvancedSystems(); }
export function addEnvironment() { data.advanced.environments.push({ id: makeId(), name: $("environmentName")?.value || "환경 오브젝트", effect: $("environmentEffect")?.value || "" }); save(); renderAdvancedSystems(); }
export function addCamp() { data.advanced.camps.push({ id: makeId(), name: $("campName")?.value || "휴식", hp: Number($("campHp")?.value || 0), mp: Number($("campMp")?.value || 0) }); save(); renderAdvancedSystems(); }
export function addTimer() { data.advanced.timers.push({ id: makeId(), name: $("timerName")?.value || "타이머", turns: Number($("timerTurns")?.value || 1), remaining: Number($("timerTurns")?.value || 1) }); save(); renderAdvancedSystems(); }
export function addWorldChange() { data.advanced.worldChanges.push({ id: makeId(), name: $("worldChangeName")?.value || "월드 변화", desc: $("worldChangeDesc")?.value || "" }); save(); renderAdvancedSystems(); }
export function addRecipe() { data.advanced.recipes.push({ id: makeId(), name: $("recipeName")?.value || "제작법", materials: ($("recipeMaterials")?.value || "").split("\n").filter(Boolean), result: $("recipeResult")?.value || "" }); save(); renderAdvancedSystems(); }
export function addSet() { data.advanced.sets.push({ id: makeId(), name: $("setName")?.value || "세트", pieces: Number($("setPieces")?.value || 2), effect: $("setEffect")?.value || "" }); save(); renderAdvancedSystems(); }
export function addPersonalQuest() { data.advanced.personalQuests.push({ id: makeId(), owner: $("personalQuestOwner")?.value || "", title: $("personalQuestTitle")?.value || "개인 퀘스트", desc: $("personalQuestDesc")?.value || "" }); save(); renderAdvancedSystems(); }
export function addMemory() { data.advanced.memories.push({ id: makeId(), title: $("memoryTitle")?.value || "기억 파편", text: $("memoryText")?.value || "" }); save(); renderAdvancedSystems(); }
export function addEnding() { data.advanced.endings.push({ id: makeId(), name: $("endingName")?.value || "엔딩", condition: $("endingCondition")?.value || "" }); save(); renderAdvancedSystems(); }

export function revealInspection() {
  const i = data.advanced.inspections.find(x => x.id === $("runtimeInspectSelect")?.value);
  if (!i) return;
  const msg = `[조사] ${i.name}\n공개: ${i.public}\n마스터 비밀: ${i.secret}`;
  addLog(msg);
  $("statCheckResult").textContent = msg;
}

export function runFearCheck() {
  const rule = data.advanced.fearRules.find(x => x.id === $("runtimeFearSelect")?.value);
  const p = data.players.find(x => x.id === $("runtimeFearTarget")?.value);
  if (!rule || !p) return alert("공포 규칙/대상 선택");
  const roll = Math.floor(Math.random() * 20) + 1;
  const stat = Number(p.stats?.[rule.stat] || 0);
  const total = roll + stat;
  let msg = `[공포 판정] ${p.name}: d20(${roll}) + ${STAT_LABELS[rule.stat]}(${stat}) = ${total}`;
  if (total < rule.difficulty) {
    p.madness = Number(p.madness || 0) + rule.madnessGain;
    msg += ` / 실패: 광기 +${rule.madnessGain}`;
    screenEffect("danger");
  } else {
    msg += " / 성공";
  }
  addLog(msg); save(); renderAll();
}

export function runCamp() {
  const camp = data.advanced.camps.find(x => x.id === $("runtimeCampSelect")?.value);
  if (!camp) return;
  data.players.forEach(p => {
    p.hp = Math.min(p.maxHp, p.hp + camp.hp);
    p.mp = Math.min(p.maxMp, p.mp + camp.mp);
  });
  addLog(`[휴식] ${camp.name}: HP +${camp.hp}, MP +${camp.mp}`);
  save(); renderAll();
}

export function exportSessionTxt() {
  const lines = [
    "TRPG SESSION LOG",
    "================",
    "",
    "[전투/시스템 로그]",
    ...(data.diceLog || []),
    "",
    "[컷신/세션 노트]",
    ...(data.advanced.sessionNotes || []),
    "",
    "[월드 변화]",
    ...(data.advanced.worldChanges || []).map(w => `${w.name}: ${w.desc}`),
    "",
    "[엔딩 후보]",
    ...(data.advanced.endings || []).map(e => `${e.name}: ${e.condition}`)
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "trpg-session-log.txt";
  a.click();
  URL.revokeObjectURL(url);
}

export function renderAdvancedLists() {
  const set = (id, html) => { const box = $(id); if (box) box.innerHTML = html; };
  set("cutsceneList", data.advanced.cutscenes.map(c => `<div class="list-item"><div class="row-title">${esc(c.speaker)}</div><div class="row-meta">${esc(c.text).slice(0, 120)}</div></div>`).join(""));
  set("sfxList", data.advanced.sfx.map(s => `<div class="list-item"><div class="row-title">${esc(s.name)}</div><button class="small" data-action="play-sfx" data-url="${escAttr(s.url)}">재생</button></div>`).join(""));
  set("horrorList", [...data.advanced.fearRules.map(f => `<div class="list-item"><div class="row-title">공포: ${esc(f.name)}</div><div class="row-meta">${STAT_LABELS[f.stat]} / 난이도 ${f.difficulty} / 광기 +${f.madnessGain}</div></div>`), ...data.advanced.curses.map(c => `<div class="list-item"><div class="row-title">저주: ${esc(c.name)}</div><div class="row-meta">광기 +${c.madnessPerTurn}/턴, HP -${c.hpPerTurn}/턴</div></div>`)].join(""));
  set("faithResourceList", [...data.advanced.deities.map(d => `<div class="list-item"><div class="row-title">${esc(d.name)}</div><div class="row-meta">요구 신앙 ${d.faithReq}<br>${esc(d.blessing)}</div></div>`), ...data.advanced.resources.map(r => `<div class="list-item"><div class="row-title">${esc(r.name)}</div><div class="row-meta">기본값 ${r.value}</div></div>`)].join(""));
  set("bossAdvancedList", [...data.advanced.bossPhases.map(p => `<div class="list-item"><div class="row-title">페이즈 ${esc(p.name)}</div><div class="row-meta">HP ${p.hpPercent}% 이하<br>${esc(p.effect)}</div></div>`), ...data.advanced.bossParts.map(p => `<div class="list-item"><div class="row-title">부위 ${esc(p.name)}</div><div class="row-meta">HP ${p.hp}<br>${esc(p.effect)}</div></div>`)].join(""));
  set("explorationList", [...data.advanced.inspections.map(i => `<div class="list-item"><div class="row-title">조사 ${esc(i.name)}</div><div class="row-meta">${esc(i.public)}</div></div>`), ...data.advanced.dungeonNodes.map(n => `<div class="list-item"><div class="row-title">던전 ${esc(n.name)}</div><div class="row-meta">${n.choices.map(esc).join(" / ")}</div></div>`), ...data.advanced.environments.map(e => `<div class="list-item"><div class="row-title">환경 ${esc(e.name)}</div><div class="row-meta">${esc(e.effect)}</div></div>`)].join(""));
  set("worldAdvancedList", [...data.advanced.camps.map(c => `<div class="list-item"><div class="row-title">휴식 ${esc(c.name)}</div><div class="row-meta">HP +${c.hp}, MP +${c.mp}</div></div>`), ...data.advanced.timers.map(t => `<div class="list-item"><div class="row-title">타이머 ${esc(t.name)}</div><div class="row-meta">${t.remaining}/${t.turns}턴</div></div>`), ...data.advanced.worldChanges.map(w => `<div class="list-item"><div class="row-title">${esc(w.name)}</div><div class="row-meta">${esc(w.desc)}</div></div>`)].join(""));
  set("craftList", [...data.advanced.recipes.map(r => `<div class="list-item"><div class="row-title">${esc(r.name)}</div><div class="row-meta">${r.materials.map(esc).join(", ")} → ${esc(r.result)}</div></div>`), ...data.advanced.sets.map(s => `<div class="list-item"><div class="row-title">세트 ${esc(s.name)}</div><div class="row-meta">${s.pieces}개 필요<br>${esc(s.effect)}</div></div>`)].join(""));
  set("storyAdvancedList", [...data.advanced.personalQuests.map(q => `<div class="list-item"><div class="row-title">${esc(q.owner)}: ${esc(q.title)}</div><div class="row-meta">${esc(q.desc)}</div></div>`), ...data.advanced.memories.map(m => `<div class="list-item"><div class="row-title">기억 ${esc(m.title)}</div><div class="row-meta">${esc(m.text)}</div></div>`), ...data.advanced.endings.map(e => `<div class="list-item"><div class="row-title">엔딩 ${esc(e.name)}</div><div class="row-meta">${esc(e.condition)}</div></div>`)].join(""));
}

export function renderTimerView() {
  const box = $("timerView");
  if (!box) return;
  box.innerHTML = data.advanced.timers.length
    ? data.advanced.timers.map(t => `${esc(t.name)}: ${t.remaining}/${t.turns}턴`).join("<br>")
    : "진행 중인 타이머 없음";
}

export function renderAdvancedListsAndTimers() {
  renderAdvancedLists();
  renderTimerView();
}
