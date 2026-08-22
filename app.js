const state = { step: 0, selections: {} };
const builderView = document.getElementById('builderView');
const resultView = document.getElementById('resultView');
const promptOutput = document.getElementById('promptOutput');
const stepLabel = document.getElementById('stepLabel');
const stepTitle = document.getElementById('stepTitle');
const progressBar = document.getElementById('progressBar');
const progressDots = document.getElementById('progressDots');

function getStep() { return STEPS[state.step]; }
function allSections() { return [...STEPS.flatMap(s => s.sections), ...EXTRA_SECTIONS.flatMap(s => s.groups || [s])]; }
function getSection(id) { return allSections().find(s => s.id === id); }
function visibleExtraSections() { return EXTRA_SECTIONS.filter(section => !section.visibleWhen || SECTION_RULES[section.visibleWhen]?.({ selections: state.selections })); }
function visibleSectionsForStep(step) {
  return step.sections.concat(
    step.id === 'character' ? visibleExtraSections().filter(s => s.id === 'fantasyTraits') : [],
    step.id === 'clothing' ? visibleExtraSections().filter(s => ['outfitColorRoles','upperClothing','lowerClothing'].includes(s.id)) : [],
    step.id === 'background' ? visibleExtraSections().filter(s => s.id === 'composition') : []
  );
}
function init() {
  renderStep();
  document.getElementById('resetButton').addEventListener('click', reset);
  document.getElementById('copyButton').addEventListener('click', copyPrompt);
  document.getElementById('editButton').addEventListener('click', () => { resultView.classList.add('hidden'); builderView.classList.remove('hidden'); renderStep(); });
  document.getElementById('newButton').addEventListener('click', reset);
}
function renderDots() {
  progressDots.innerHTML = STEPS.map((step, i) => `<button class="progress-dot ${i === state.step ? 'active' : ''} ${i < state.step ? 'done' : ''}" data-step="${i}" aria-label="${step.title}">${i + 1}</button>`).join('');
  progressDots.querySelectorAll('.progress-dot').forEach(btn => btn.addEventListener('click', () => { const target = Number(btn.dataset.step); if (target <= state.step) { state.step = target; renderStep(); } }));
}
function renderStep() {
  const step = getStep();
  stepLabel.textContent = `STEP ${state.step + 1} / ${STEPS.length}`;
  stepTitle.textContent = step.title;
  progressBar.style.width = `${((state.step + 1) / STEPS.length) * 100}%`;
  renderDots();
  const sections = visibleSectionsForStep(step);
  builderView.innerHTML = `<div class="step-intro"><p class="eyebrow">${String(state.step + 1).padStart(2,'0')}</p><h2>${step.title}</h2><p>${step.description}</p></div><div class="sections">${sections.map(renderSection).join('')}</div><div class="navigation"><button id="backButton" class="secondary-button" type="button" ${state.step === 0 ? 'disabled' : ''}>戻る</button><button id="nextButton" class="primary-button" type="button">${state.step === STEPS.length - 1 ? 'プロンプトを完成' : '決定して次へ'}</button></div>`;
  builderView.querySelectorAll('.option').forEach(el => el.addEventListener('click', () => selectOption(el)));
  builderView.querySelectorAll('.role-option').forEach(el => el.addEventListener('click', () => selectRoleColor(el)));
  document.getElementById('backButton').addEventListener('click', () => { if (state.step > 0) { state.step--; renderStep(); } });
  document.getElementById('nextButton').addEventListener('click', nextStep);
}
function renderSection(section) {
  if (section.mode === 'roleColor') return `<article class="selection-section"><div class="section-heading"><h3>${section.title}</h3><span>各2色まで</span></div>${section.roles.map(role => `<div class="role-block"><h4>${role.title}</h4><div class="options-grid">${role.options.map(([id,label,english]) => { const selected = (state.selections[section.id]?.[role.id] || []).includes(id); return `<button type="button" class="option role-option ${selected ? 'selected' : ''}" data-section="${section.id}" data-role="${role.id}" data-id="${id}"><span class="option-label">${label}</span><span class="option-sub">${english}</span></button>`; }).join('')}</div></div>`).join('')}</article>`;
  if (section.mode === 'collection') return `<article class="selection-section"><div class="section-heading"><h3>${section.title}</h3><span>項目ごとに選択</span></div>${section.groups.map(renderSection).join('')}</article>`;
  const selected = state.selections[section.id] || [];
  return `<article class="selection-section"><div class="section-heading"><h3>${section.title}</h3><span>${section.mode === 'multi' ? '複数選択可' : '1つ選択'}</span></div><div class="options-grid">${section.options.map(([id,label,english]) => `<button type="button" class="option ${selected.includes(id) ? 'selected' : ''}" data-section="${section.id}" data-id="${id}" data-mode="${section.mode}"><span class="option-label">${label}</span><span class="option-sub">${id !== 'none' ? english : '指定なし'}</span></button>`).join('')}</div></article>`;
}
function selectOption(button) {
  const sectionId = button.dataset.section, id = button.dataset.id, mode = button.dataset.mode;
  let selected = [...(state.selections[sectionId] || [])];
  if (mode === 'single') selected = selected.includes(id) ? [] : [id];
  else if (id === 'none') selected = selected.includes('none') ? [] : ['none'];
  else { selected = selected.filter(v => v !== 'none'); selected = selected.includes(id) ? selected.filter(v => v !== id) : [...selected, id]; }
  state.selections[sectionId] = selected;
  if (sectionId === 'fantasy' && !selected.includes('fantasy')) delete state.selections.fantasyTraits;
  renderStep();
}
function selectRoleColor(button) {
  const sectionId = button.dataset.section, role = button.dataset.role, id = button.dataset.id;
  const values = { ...(state.selections[sectionId] || {}) }, selected = [...(values[role] || [])];
  values[role] = selected.includes(id) ? selected.filter(v => v !== id) : selected.length < 2 ? [...selected, id] : selected;
  state.selections[sectionId] = values;
  renderStep();
}
function nextStep() { if (state.step < STEPS.length - 1) { state.step++; renderStep(); } else { promptOutput.value = buildPrompt(); builderView.classList.add('hidden'); resultView.classList.remove('hidden'); } }
function selectedEnglish(sectionId) { const section = getSection(sectionId); if (!section?.options) return []; const selected = state.selections[sectionId] || []; return section.options.filter(o => selected.includes(o[0]) && o[0] !== 'none').map(o => o[2]); }
function selectedIds(sectionId) { return (state.selections[sectionId] || []).filter(id => id !== 'none'); }
function buildPrompt() {
  const parts = ['anime illustration'];
  parts.push(...selectedEnglish('animeStyle'), ...selectedEnglish('fantasy'), ...selectedEnglish('gender'), ...selectedEnglish('age'), ...selectedEnglish('hairPresence'), ...selectedEnglish('hairLength'), ...selectedEnglish('hairColor'), ...selectedEnglish('hairTexture'));
  if (selectedIds('fantasy').includes('fantasy')) {
    parts.push('fantasy character design');
    const traits = selectedIds('fantasyTraits');
    const rule = PROMPT_RULES.find(r => r.when(traits));
    if (rule) parts.push(rule.phrase); else parts.push(...selectedEnglish('fantasyTraits'));
  }
  parts.push(...selectedEnglish('outfitType'), ...selectedEnglish('clothingTexture'), ...selectedEnglish('clothingColor'), ...selectedEnglish('clothingSize'), ...selectedEnglish('specialClothing'), ...selectedEnglish('upperClothing'), ...selectedEnglish('lowerClothing'));
  const colors = state.selections.outfitColorRoles || {};
  if (colors.main?.length) parts.push(`${colors.main.map(colorWord).join(' and ')} as the main colors`);
  if (colors.sub?.length) parts.push(`${colors.sub.map(colorWord).join(' and ')} as secondary colors`);
  if (colors.accent?.length) parts.push(`${colors.accent.map(colorWord).join(' and ')} as accent colors`);
  const right = selectedEnglish('rightEye'), left = selectedEnglish('leftEye');
  if (right.length && left.length && right[0] !== left[0]) parts.push(`heterochromatic eyes, right eye ${right[0]}, left eye ${left[0]}`); else parts.push(...right, ...left);
  parts.push(...selectedEnglish('eyeExpression'), ...selectedEnglish('item'), ...selectedEnglish('expression'), ...selectedEnglish('height'), ...selectedEnglish('job'), ...resolveCombination(['overallMood','lineMood','colorMood'].flatMap(selectedIds), COMBINATION_RULES), ...selectedEnglish('background'), ...selectedEnglish('pose'), ...selectedEnglish('gaze'), ...selectedEnglish('framing'), ...selectedEnglish('angle'));
  return clean(parts).join(', ') + ' --niji 7';
}
function colorWord(id) { return {white:'white',cream:'cream',black:'black',pink:'pink',blue:'blue',lavender:'lavender'}[id] || id; }
function resolveCombination(ids, rules) { const phrases=[], consumed=new Set(); for (const rule of [...rules].sort((a,b)=>b.ids.length-a.ids.length)) if (rule.ids.every(id=>ids.includes(id))) { phrases.push(rule.phrase); rule.ids.forEach(id=>consumed.add(id)); } for (const id of ids.filter(id=>!consumed.has(id))) { const match=STEPS.flatMap(s=>s.sections).flatMap(s=>s.options||[]).find(o=>o[0]===id); if(match?.[2]) phrases.push(match[2]); } return phrases; }
function clean(parts) { return parts.filter(Boolean).map(p => p.trim()).filter((p,i,a)=>a.indexOf(p)===i); }
async function copyPrompt() { try { await navigator.clipboard.writeText(promptOutput.value); document.getElementById('copyButton').textContent='コピーしました'; setTimeout(()=>document.getElementById('copyButton').textContent='コピー',1400); } catch { promptOutput.select(); document.execCommand('copy'); } }
function reset() { state.step=0; state.selections={}; resultView.classList.add('hidden'); builderView.classList.remove('hidden'); renderStep(); }
init();
