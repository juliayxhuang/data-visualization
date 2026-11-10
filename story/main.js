const genderChoices = document.querySelectorAll('input[name="study-category"]');
const question = document.querySelector('#gender-question');
const genderOptions = document.querySelector('#gender-options');
const orientationStep = document.querySelector('#orientation-step');
const gayOption = document.querySelector('#gay-option');
const lesbianOption = document.querySelector('#lesbian-option');
const changeGroup = document.querySelector('#change-group');
const changeAnswer = document.querySelector('#change-answer');
const resultSection = document.querySelector('#result-section');
const resultArt = document.querySelector('#result-art');
const resultDots = document.querySelector('#result-dots');
const resultPercent = document.querySelector('#result-percent');
const resultGroup = document.querySelector('#result-group');
const resultGenderIcon = document.querySelector('#result-gender-icon');
const resultOrientationIcon = document.querySelector('#result-orientation-icon');
const resultSelectedText = document.querySelector('#result-selected-text');
const resultSummary = document.querySelector('#result-summary');
const resultExport = document.querySelector('#result-export');
const orientationChoices = document.querySelectorAll('input[name="orientation-category"]');

// Frederick et al. (2018), Figure 1; colors and image paths match Processing run 20261106-142959.
const groups = {
  'female:straight': { label: 'heterosexual women', percent: 65, n: 24102, color: '#5B60A8', slug: 'heterosexual-women' },
  'female:bisexual': { label: 'bisexual women', percent: 66, n: 1112, color: '#A86A00', slug: 'bisexual-women' },
  'female:lesbian': { label: 'lesbian women', percent: 86, n: 340, color: '#97508D', slug: 'lesbian-women' },
  'male:straight': { label: 'heterosexual men', percent: 95, n: 26032, color: '#B3421B', slug: 'heterosexual-men' },
  'male:bisexual': { label: 'bisexual men', percent: 88, n: 550, color: '#087F5B', slug: 'bisexual-men' },
  'male:gay': { label: 'gay men', percent: 89, n: 452, color: '#146B9C', slug: 'gay-men' }
};
const processingRun = '../experiments/processing-frederick/FrederickSeries/output/run-20261106-142959/';

function renderDots(group) {
  resultDots.replaceChildren();
  for (let i = 0; i < 100; i++) {
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const angle = -Math.PI / 2 + 2 * Math.PI * i / 100;
    dot.setAttribute('cx', 400 + 300 * Math.cos(angle));
    dot.setAttribute('cy', 400 + 300 * Math.sin(angle));
    dot.setAttribute('r', '4.5');
    dot.setAttribute('fill', i < group.percent ? 'currentColor' : 'none');
    dot.setAttribute('stroke', 'currentColor');
    dot.setAttribute('stroke-width', '1.5');
    dot.classList.add('result-dot');
    dot.style.animationDelay = `${i * 10}ms`;
    resultDots.append(dot);
  }
}

function showSelectedIllustration(input, destination) {
  const illustration = input.closest('.choice-option').querySelector('.choice-illustration');
  destination.replaceChildren(illustration.cloneNode(true));
  destination.classList.remove('is-animating');
  // Restart the entrance when a reader changes their selection.
  void destination.offsetWidth;
  destination.classList.add('is-animating');
}

function resetToGender() {
  resultSection.hidden = true;
  orientationStep.hidden = true;
  genderOptions.hidden = false;
  for (const choice of genderChoices) choice.checked = false;
  for (const choice of orientationChoices) choice.checked = false;
  question.scrollIntoView({ block: 'start' });
  genderChoices[0].focus({ preventScroll: true });
}

for (const choice of genderChoices) {
  choice.addEventListener('change', () => {
    const female = choice.value === 'female';

    gayOption.hidden = female;
    lesbianOption.hidden = !female;
    for (const option of orientationStep.querySelectorAll('input')) {
      option.checked = false;
    }

    genderOptions.hidden = true;
    orientationStep.hidden = false;
    question.scrollIntoView({ block: 'start' });
    orientationStep.querySelector('input').focus({ preventScroll: true });
  });
}

for (const choice of orientationChoices) {
  choice.addEventListener('change', () => {
    const genderChoice = document.querySelector('input[name="study-category"]:checked');
    const gender = genderChoice.value;
    const group = groups[`${gender}:${choice.value}`];
    if (!group) return;

    resultArt.style.setProperty('--group-color', group.color);
    resultPercent.textContent = `${group.percent}%`;
    resultGroup.textContent = group.label;
    showSelectedIllustration(choice, resultOrientationIcon);
    showSelectedIllustration(genderChoice, resultGenderIcon);
    resultSelectedText.textContent = `You chose the ${choice.value} and ${gender} study categories.`;
    resultSummary.textContent = `In this sample, ${group.percent}% of ${group.label} reported usually or always reaching orgasm when sexually intimate during the past month (n=${group.n.toLocaleString()}).`;
    resultExport.href = `${processingRun}${group.slug}-ring-fixed100.png`;
    resultSection.hidden = false;
    resultSection.scrollIntoView({ block: 'start' });
    requestAnimationFrame(() => renderDots(group));
  });
}

changeGroup.addEventListener('click', resetToGender);
changeAnswer.addEventListener('click', resetToGender);
