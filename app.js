const state = { step: 0, selections: {} };

const builderView = document.getElementById('builderView');
const resultView = document.getElementById('resultView');
const promptOutput = document.getElementById('promptOutput');
const stepLabel = document.getElementById('stepLabel');
const stepTitle = document.getElementById('stepTitle');
const progressBar = document.getElementById('progressBar');
const progressDots = document.getElementById('progressDots');

function getStep() { return STEPS[state.step]; }

function init() {
  renderDots();
  renderStep();
  document.getElementById('resetButton').addEventListener('click', reset);
  document.getElementById('copyButton').addEventListener('click', copyPrompt);
  document.getElementById('editButton').addEventListener('click', () => {
    resultView.classList.add('hidden');
    builderView.classList.remove('hidden');
    renderStep();
  });
  document.getElementById('newButton').addEventListener('click', reset);
}

function renderDots() {
  progressDots.innerHTML = STEPS.map((step, i) => `<button class="progress-dot ${i === state.step ? 'active' : ''} ${i < state.step ? 'done' : ''}" data-step="${i}" aria-label="${step.title}">${i + 1}</button>`).join('');
  progressDots.querySelectorAll('.progress-dot').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = Number(btn.dataset.step);
      if (target <= state.step) { state.step = target; renderStep(); }
    });
  });
}

function renderStep() {
  const step = getStep();
  stepLabel.textContent = `STEP ${state.step + 1} / ${STEPS.length}`;
  stepTitle.textContent = step.title;
  progressBar.style.width = `${((state.step + 1) / STEPS.length) * 100}%`;
  renderDots();

  builderView.innerHTML = `
    <div class="step-intro">
      <p class="eyebrow">${String(state.step + 1).padStart(2, '0')}</p>
      <h2>${step.title}</h2>
      <p>${step.description}</p>
    </div>
    <div class="sections">
      ${step.sections.map(renderSection).join('')}
    </div>
    <div class="navigation">
      <button id="backButton" class="secondary-button" type="button" ${state.step === 0 ? 'disabled' : ''}>戻る</button>
      <button id="nextButton" class="primary-button" type="button">${state.step === STEPS.length - 1 ? 'プロンプトを完成' : '決定して次へ'}</button>
    </div>
  `;

  builderView.querySelectorAll('.option').forEach(option => option.addEventListener('click', () => selectOption(option)));
  document.getElementById('backButton').addEventListener('click', () => { if (state.step > 0) { state.step--; renderStep(); } });
  document.getElementById('nextButton').addEventListener('click', nextStep);
}

function renderSection(section) {
  const selected = state.selections[section.id] || [];
  return `
    <article class="selection-section">
      <div class="section-heading">
        <h3>${section.title}</h3>
        <span>${section.mode === 'multi' ? '複数選択可' : '1つ選択'}</span>
      </div>
      <div class="options-grid">
        ${section.options.map(([id, label, english]) => `
          <button type="button" class="option ${selected.includes(id) ? 'selected' : ''}" data-section="${section.id}" data-id="${id}" data-mode="${section.mode}">
            <span class="option-label">${label}</span>
            ${id !== 'none' ? `<span class="option-sub">${english}</span>` : '<span class="option-sub">指定なし</span>'}
          </button>
        `).join('')}
      </div>
    </article>
  `;
}

function selectOption(button) {
  const sectionId = button.dataset.section;
  const id = button.dataset.id;
  const mode = button.dataset.mode;
  let selected = [...(state.selections[sectionId] || [])];

  if (mode === 'single') {
    selected = selected.includes(id) ? [] : [id];
  } else {
    if (id === 'none') selected = selected.includes('none') ? [] : ['none'];
    else {
      selected = selected.filter(v => v !== 'none');
      selected = selected.includes(id) ? selected.filter(v => v !== id) : [...selected, id];
    }
  }
  state.selections[sectionId] = selected;
  renderStep();
}

function nextStep() {
  if (state.step < STEPS.length - 1) {
    state.step++;
    renderStep();
  } else {
    promptOutput.value = buildPrompt();
    builderView.classList.add('hidden');
    resultView.classList.remove('hidden');
  }
}

function selectedEnglish(sectionId) {
  const section = STEPS.flatMap(s => s.sections).find(s => s.id === sectionId);
  if (!section) return [];
  const selected = state.selections[sectionId] || [];
  return section.options.filter(o => selected.includes(o[0]) && o[0] !== 'none').map(o => o[2]);
}

function selectedIds(sectionId) { return (state.selections[sectionId] || []).filter(id => id !== 'none'); }

function buildPrompt() {
  const parts = [];
  parts.push('anime illustration');

  const basic = [...selectedEnglish('animeStyle'), ...selectedEnglish('fantasy')];
  parts.push(...basic);

  const character = [
    ...selectedEnglish('gender'), ...selectedEnglish('age'), ...selectedEnglish('hairPresence'),
    ...selectedEnglish('hairLength'), ...selectedEnglish('hairColor'), ...selectedEnglish('hairTexture')
  ];
  parts.push(...character);

  const fantasy = selectedIds('fantasy').includes('fantasy');
  if (fantasy) parts.push('fantasy character design');

  const outfit = selectedEnglish('outfitType');
  parts.push(...outfit, ...selectedEnglish('clothingTexture'), ...selectedEnglish('clothingColor'), ...selectedEnglish('clothingSize'), ...selectedEnglish('specialClothing'));

  const right = selectedEnglish('rightEye');
  const left = selectedEnglish('leftEye');
  if (right.length && left.length && right[0] !== left[0]) parts.push(`heterochromatic eyes, right eye ${right[0]}, left eye ${left[0]}`);
  else parts.push(...right, ...left);
  parts.push(...selectedEnglish('eyeExpression'));

  const items = selectedEnglish('item');
  const itemSize = selectedEnglish('itemSize');
  if (items.length) parts.push(...items.map(item => itemSize.length ? `${itemSize[0]} ${item}` : item));

  parts.push(...selectedEnglish('expression'), ...selectedEnglish('height'), ...selectedEnglish('job'));

  const moodIds = ['overallMood','lineMood','colorMood'].flatMap(selectedIds);
  const moodPhrases = [];
  for (const rule of COMBINATION_RULES) {
    if (rule.ids.every(id => moodIds.includes(id))) moodPhrases.push(rule.phrase);
  }
  const usedByRules = new Set(COMBINATION_RULES.flatMap(r => r.ids));
  for (const id of moodIds) {
    if (!moodPhrases.some(p => p.includes(id)) && !usedByRules.has(id)) {
      const match = STEPS.flatMap(s => s.sections).flatMap(s => s.options).find(o => o[0] === id);
      if (match?.[2]) moodPhrases.push(match[2]);
    }
  }
  parts.push(...moodPhrases);
  parts.push(...selectedEnglish('background'));

  return clean(parts).join(', ') + ' --niji 7';
}

function clean(parts) {
  return parts.filter(Boolean).map(p => p.trim()).filter((p, i, arr) => arr.indexOf(p) === i);
}

async function copyPrompt() {
  try {
    await navigator.clipboard.writeText(promptOutput.value);
    document.getElementById('copyButton').textContent = 'コピーしました';
    setTimeout(() => document.getElementById('copyButton').textContent = 'コピー', 1400);
  } catch {
    promptOutput.select();
    document.execCommand('copy');
  }
}

function reset() {
  state.step = 0;
  state.selections = {};
  resultView.classList.add('hidden');
  builderView.classList.remove('hidden');
  renderStep();
}

init();
