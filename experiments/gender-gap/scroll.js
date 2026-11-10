(() => {
  'use strict';

  const config = window.orgasmGapExperimentConfig;
  const track = document.querySelector('[data-scroll-track]');
  const groups = new Map();
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pendingFrame = false;

  if (!config || !track) return;

  for (const group of config.groups) {
    const container = document.querySelector(`[data-icons-for="${group.id}"]`);
    if (!container) continue;

    const icons = [];
    for (let index = 0; index < group.percent; index += 1) {
      const icon = document.createElement('span');
      icon.className = 'person-icon';
      icon.setAttribute('aria-hidden', 'true');
      container.appendChild(icon);
      icons.push(icon);
    }
    groups.set(group.id, icons);
  }

  function clamp(value, minimum, maximum) {
    return Math.min(maximum, Math.max(minimum, value));
  }

  function scrollProgress() {
    const bounds = track.getBoundingClientRect();
    const distance = Math.max(1, bounds.height - window.innerHeight);
    const traveled = -bounds.top;
    if (traveled >= distance - 1) return 1;
    return clamp(traveled / distance, 0, 1);
  }

  function render() {
    pendingFrame = false;
    const progress = motionPreference.matches ? 1 : scrollProgress();
    const commonCount = Math.floor(progress * Math.max(...config.groups.map(group => group.percent)));

    for (const group of config.groups) {
      const icons = groups.get(group.id) || [];
      const visibleCount = Math.min(group.percent, commonCount);
      icons.forEach((icon, index) => {
        icon.classList.toggle('is-visible', index < visibleCount);
      });
    }
  }

  function requestRender() {
    if (pendingFrame) return;
    pendingFrame = true;
    window.requestAnimationFrame(render);
  }

  window.addEventListener('scroll', requestRender, { passive: true });
  window.addEventListener('resize', requestRender);
  motionPreference.addEventListener('change', requestRender);
  requestRender();
})();
