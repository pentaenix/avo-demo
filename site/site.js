(() => {
  const button = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-mobile-nav]');
  if (button && nav) {
    button.addEventListener('click', () => {
      const open = !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', open);
      button.setAttribute('aria-expanded', String(open));
      button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      button.setAttribute('aria-expanded', 'false');
    }));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        button.setAttribute('aria-expanded','false');
        button.focus();
      }
    });
  }
})();






// v3.43 — Home ingredient rail: transform-based continuous belt with inertial interaction.
(() => {
  const track = document.querySelector('[data-home-ingredients-track]');
  if (!track) return;

  const research = {
    'Pineapple': ['Pineapple is a natural source of bromelain. Most clinical research uses concentrated bromelain rather than food amounts.', 'Rathnavelu et al. (2016), Biomedical Reports.', 'https://doi.org/10.3892/br.2016.720'],
    'Nopal': ['Nopal brings fiber and plant compounds. Human research has studied much larger food servings than the amount used in a powdered blend.', 'López-Romero et al. (2014), Journal of the Academy of Nutrition and Dietetics.', 'https://doi.org/10.1016/j.jand.2014.06.352'],
    'Green Apple': ['Whole apples provide fiber and polyphenols. Ingredient research does not automatically establish a finished-product effect.', 'Koutsos et al. (2020), The American Journal of Clinical Nutrition.', 'https://doi.org/10.1093/ajcn/nqz282'],
    'Cucumber': ['Cucumber contains flavonoids and other plant compounds. Its clearest role here is also simple: a cool, refreshing green note.', 'Mukherjee et al. (2013), Fitoterapia.', 'https://doi.org/10.1016/j.fitote.2012.10.003'],
    'Spinach': ['Spinach is naturally rich in carotenoids and dietary nitrate. Studies of spinach interventions use specific amounts and preparations, not Green Boost itself.', 'Jovanovski et al. (2015), Clinical Nutrition Research.', 'https://doi.org/10.7762/cnr.2015.4.3.160'],
    'Celery': ['Celery contains phenolics and flavonoids studied for antioxidant activity. In the blend, it also adds crisp green depth.', 'Sowbhagya (2014), Critical Reviews in Food Science and Nutrition.', 'https://doi.org/10.1080/10408398.2011.586740'],
    'Avocado': ['Avocado fat can improve absorption of fat-soluble carotenoids from vegetables. In Green Boost, avocado also contributes creaminess and texture.', 'Unlu et al. (2005), The Journal of Nutrition.', 'https://doi.org/10.1093/jn/135.3.431'],
    'Cilantro': ['Cilantro contains carotenoids, phenolics and aromatic compounds. Its immediate role in the formula is fresh herbal flavor.', 'Wei et al. (2019), Food Chemistry.', 'https://doi.org/10.1016/j.foodchem.2019.01.171'],
    'Ginger': ['Ginger has been studied for digestive function in concentrated amounts. Here it also adds a gentle warming finish.', 'Wu et al. (2008), European Journal of Gastroenterology & Hepatology.', 'https://doi.org/10.1097/MEG.0b013e3282f4b224'],
    'Turmeric': ['Turmeric and curcumin are widely studied, usually as dedicated supplement formulations. Green Boost uses whole turmeric as one ingredient in the blend.', 'Dehzad et al. (2023), Cytokine.', 'https://doi.org/10.1016/j.cyto.2023.156144'],
    'Mint': ['Mint has research around digestive symptoms, often using concentrated peppermint oil. Green Boost uses whole mint for a cool finish.', 'Hirata et al. (2025), Pharmaceuticals.', 'https://doi.org/10.3390/ph18050693'],
    'Basil': ['Basil contains polyphenols and aromatic compounds studied in preclinical research. In the formula, it helps tie fruit and herbs together.', 'Sestili et al. (2018), Expert Opinion on Drug Metabolism & Toxicology.', 'https://doi.org/10.1080/17425255.2018.1484450']
  };

  const originals = [...track.children];
  if (!originals.length) return;

  const belt = document.createElement('div');
  belt.className = 'home-ingredients-belt';

  const makeSet = (isClone) => originals.map((card) => {
    const item = isClone ? card.cloneNode(true) : card;
    if (isClone) {
      item.dataset.clone = 'true';
      item.setAttribute('aria-hidden', 'true');
      item.querySelectorAll('button,a').forEach((el) => el.tabIndex = -1);
    }
    return item;
  });

  const sets = [makeSet(true), makeSet(false), makeSet(true)];
  sets.flat().forEach((card) => belt.appendChild(card));
  track.replaceChildren(belt);

  let setWidth = 0;
  let position = 0;
  let velocity = 0;
  let cruiseDirection = 1; // +1 means cards travel visually to the right.
  let mode = 'rest';
  let resumeAt = performance.now() + 500;
  let dragging = false;
  let pointerId = null;
  let startX = 0;
  let lastX = 0;
  let lastPointerTime = 0;
  let dragVelocity = 0;
  let wheelTimer = 0;

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
  const cruiseSpeed = reducedMotion ? 8 : 18;
  const restDuration = reducedMotion ? 2100 : 1650;
  const gap = 28;

  const normalize = () => {
    if (!setWidth) return;
    while (position >= 0) position -= setWidth;
    while (position <= -setWidth * 2) position += setWidth;
  };

  const render = () => {
    normalize();
    belt.style.transform = `translate3d(${position.toFixed(3)}px,0,0)`;
  };

  const cardWidthForViewport = () => {
    const width = track.clientWidth;
    if (width <= 560) return width * .78;
    if (width <= 820) return (width - 42) / 2.25;
    if (width <= 1180) return (width - 84) / 4;
    return (width - 140) / 6;
  };

  const layout = () => {
    const previousWidth = setWidth;
    const progress = previousWidth ? (-position % previousWidth) / previousWidth : 0;
    const cardWidth = cardWidthForViewport();
    belt.style.setProperty('--home-ingredient-card-width', `${cardWidth}px`);
    setWidth = originals.length * (cardWidth + gap);
    position = -setWidth * (1 + progress);
    render();
  };

  const enterRest = (now = performance.now()) => {
    velocity = 0;
    mode = 'rest';
    resumeAt = now + restDuration;
  };

  const beginInteraction = () => {
    mode = 'manual';
    velocity = 0;
    window.clearTimeout(wheelTimer);
  };

  track.addEventListener('pointerdown', (event) => {
    beginInteraction();
    if (event.target.closest('[data-home-ingredient-trigger]')) {
      enterRest();
      return;
    }
    dragging = true;
    pointerId = event.pointerId;
    startX = lastX = event.clientX;
    lastPointerTime = performance.now();
    dragVelocity = 0;
    track.classList.add('is-dragging');
    track.setPointerCapture?.(pointerId);
  });

  track.addEventListener('pointermove', (event) => {
    if (!dragging || event.pointerId !== pointerId) return;
    const now = performance.now();
    const dx = event.clientX - lastX;
    const dt = Math.max(8, now - lastPointerTime);
    position += dx;
    const instantaneous = dx / (dt / 1000);
    dragVelocity = dragVelocity * .72 + instantaneous * .28;
    lastX = event.clientX;
    lastPointerTime = now;
    render();
  });

  const finishDrag = (event) => {
    if (!dragging || (event?.pointerId != null && event.pointerId !== pointerId)) return;
    const total = lastX - startX;
    if (Math.abs(total) > 3) cruiseDirection = total > 0 ? 1 : -1;
    dragging = false;
    track.classList.remove('is-dragging');
    if (pointerId != null && track.hasPointerCapture?.(pointerId)) track.releasePointerCapture(pointerId);
    pointerId = null;

    const launch = Math.max(-520, Math.min(520, dragVelocity * .55));
    if (Math.abs(launch) > 24) {
      velocity = launch;
      cruiseDirection = velocity > 0 ? 1 : -1;
      mode = 'coast';
    } else {
      enterRest();
    }
  };

  track.addEventListener('pointerup', finishDrag);
  track.addEventListener('pointercancel', finishDrag);
  track.addEventListener('dragstart', (event) => event.preventDefault());

  track.addEventListener('wheel', (event) => {
    if (Math.abs(event.deltaX) < Math.abs(event.deltaY) || Math.abs(event.deltaX) < 1) return;
    event.preventDefault();
    beginInteraction();
    const dx = -event.deltaX;
    position += dx;
    if (Math.abs(dx) > .5) cruiseDirection = dx > 0 ? 1 : -1;
    render();
    window.clearTimeout(wheelTimer);
    wheelTimer = window.setTimeout(() => enterRest(), 180);
  }, {passive:false});

  track.addEventListener('focusin', () => {
    if (!dragging) beginInteraction();
  });
  track.addEventListener('focusout', () => {
    if (!track.contains(document.activeElement)) enterRest();
  });

  let lastFrame = performance.now();
  const animate = (now) => {
    const dt = Math.min(40, now - lastFrame) / 1000;
    lastFrame = now;

    if (!document.hidden && !dragging && setWidth) {
      if (mode === 'coast') {
        position += velocity * dt;
        velocity *= Math.exp(-5.8 * dt);
        if (Math.abs(velocity) < 7) enterRest(now);
      } else if (mode === 'rest') {
        if (now >= resumeAt) mode = 'cruise';
      } else if (mode === 'cruise') {
        const target = cruiseDirection * cruiseSpeed;
        const blend = 1 - Math.exp(-2.8 * dt);
        velocity += (target - velocity) * blend;
        position += velocity * dt;
      }
      render();
    }

    requestAnimationFrame(animate);
  };

  const observer = new ResizeObserver(layout);
  observer.observe(track);
  layout();
  requestAnimationFrame(animate);

  const drawer = document.querySelector('[data-home-ingredient-drawer]');
  const img = drawer?.querySelector('[data-home-drawer-image]');
  const title = drawer?.querySelector('[data-home-drawer-title]');
  const desc = drawer?.querySelector('[data-home-drawer-description]');
  const l1 = drawer?.querySelector('[data-home-drawer-label1]');
  const v1 = drawer?.querySelector('[data-home-drawer-value1]');
  const l2 = drawer?.querySelector('[data-home-drawer-label2]');
  const v2 = drawer?.querySelector('[data-home-drawer-value2]');
  const note = drawer?.querySelector('[data-home-drawer-research]');
  const cite = drawer?.querySelector('[data-home-drawer-citation]');
  let lastTrigger = null;

  const open = (trigger) => {
    if (!drawer) return;
    beginInteraction();
    lastTrigger = trigger;
    const item = research[trigger.dataset.name] || ['', '', '#'];
    img.src = trigger.dataset.src; img.alt = trigger.dataset.name;
    title.textContent = trigger.dataset.name; desc.textContent = trigger.dataset.description;
    l1.textContent = trigger.dataset.label1; v1.textContent = trigger.dataset.value1;
    l2.textContent = trigger.dataset.label2; v2.textContent = trigger.dataset.value2;
    note.textContent = item[0]; cite.textContent = item[1]; cite.href = item[2];
    drawer.classList.add('is-active'); drawer.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    drawer.querySelector('[data-home-drawer-close]')?.focus();
  };
  const close = () => {
    if (!drawer) return;
    drawer.classList.remove('is-active'); drawer.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    enterRest();
    lastTrigger?.focus();
  };

  track.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-home-ingredient-trigger]');
    if (trigger) open(trigger);
  });
  drawer?.querySelector('[data-home-ingredient-overlay]')?.addEventListener('click', close);
  drawer?.querySelector('[data-home-drawer-close]')?.addEventListener('click', close);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && drawer?.classList.contains('is-active')) close();
  });
})();

// v3.26 — Simple in-view playback.
// The routine is a normal video, not a scroll-controlled animation. It plays once
// when the section is meaningfully visible and then holds on its final frame.
(() => {
  const section = document.querySelector('[data-routine-playback]');
  const video = section?.querySelector('[data-routine-video]');
  if (!section || !video) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;

  let hasPlayed = false;

  const playOnce = () => {
    if (hasPlayed) return;
    hasPlayed = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    try { video.currentTime = 0; } catch (_) {}
    const promise = video.play();
    if (promise && typeof promise.catch === 'function') {
      promise.catch(() => {
        // A muted inline video is normally allowed. If a browser still blocks it,
        // leave the poster in place rather than introducing fallback animation logic.
        hasPlayed = false;
      });
    }
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.42) {
          playOnce();
          if (hasPlayed) observer.disconnect();
        }
      }
    }, { threshold: [0.42, 0.55] });
    observer.observe(section);
  } else {
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const visible = Math.min(rect.bottom, innerHeight) - Math.max(rect.top, 0);
      if (visible / Math.min(rect.height, innerHeight) >= 0.42) {
        playOnce();
        if (hasPlayed) window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
