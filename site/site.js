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




(() => {
  const buttons = [...document.querySelectorAll('[data-cart-button]')];
  if (!buttons.length) return;
  const KEY = 'avokind-demo-cart-count';
  const getCount = () => Math.max(0, Number(localStorage.getItem(KEY) || 0) || 0);
  const sync = () => {
    const count = getCount();
    document.querySelectorAll('[data-cart-count]').forEach(node => node.textContent = String(count));
    buttons.forEach(button => button.setAttribute('aria-label', `Cart, ${count} item${count === 1 ? '' : 's'}`));
  };
  const toast = document.createElement('div');
  toast.className = 'global-cart-toast';
  toast.setAttribute('role','status');
  toast.setAttribute('aria-live','polite');
  document.body.appendChild(toast);
  let timer;
  buttons.forEach(button => button.addEventListener('click', () => {
    const count = getCount();
    toast.textContent = count ? `Demo cart: ${count} pouch${count === 1 ? '' : 'es'}.` : 'Your demo cart is empty.';
    toast.classList.add('is-visible');
    clearTimeout(timer);
    timer = setTimeout(() => toast.classList.remove('is-visible'), 1800);
  }));
  sync();
  window.addEventListener('storage', sync);
})();

// v3.10 — Home ingredient rail mirrors the Shop carousel interaction.
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
  if (originals.length) {
    const before = document.createDocumentFragment();
    const after = document.createDocumentFragment();
    originals.forEach((card) => {
      const a = card.cloneNode(true);
      const b = card.cloneNode(true);
      [a,b].forEach((clone) => {
        clone.dataset.clone = 'true';
        clone.setAttribute('aria-hidden','true');
        clone.querySelectorAll('button,a').forEach((el) => el.tabIndex = -1);
      });
      before.appendChild(a); after.appendChild(b);
    });
    track.prepend(before); track.append(after);

    let loopWidth = 0;
    requestAnimationFrame(() => {
      const cards = [...track.children];
      const firstOriginal = cards[originals.length];
      const firstAfter = cards[originals.length * 2];
      if (!firstOriginal || !firstAfter) return;
      loopWidth = firstAfter.offsetLeft - firstOriginal.offsetLeft;
      track.scrollLeft = firstOriginal.offsetLeft;
    });

    track.addEventListener('scroll', () => {
      if (!loopWidth) return;
      const max = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft <= 2) track.scrollLeft += loopWidth;
      else if (track.scrollLeft >= max - 2) track.scrollLeft -= loopWidth;
    }, {passive:true});
  }

  let dragging = false, startX = 0, startScroll = 0;
  track.addEventListener('pointerdown', (event) => {
    if (event.target.closest('[data-home-ingredient-trigger]')) return;
    dragging = true; startX = event.clientX; startScroll = track.scrollLeft;
    track.classList.add('is-dragging');
    track.setPointerCapture?.(event.pointerId);
  });
  track.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    track.scrollLeft = startScroll - (event.clientX - startX);
  });
  const finish = (event) => {
    dragging = false; track.classList.remove('is-dragging');
    if (event?.pointerId != null && track.hasPointerCapture?.(event.pointerId)) track.releasePointerCapture(event.pointerId);
  };
  track.addEventListener('pointerup', finish); track.addEventListener('pointercancel', finish);
  track.addEventListener('dragstart', (event) => event.preventDefault());

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
    if (!drawer || trigger.closest('[data-clone="true"]')) return;
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

// v3.11 — Scroll-controlled preparation film with spring inertia and per-word placement.
(() => {
  const section = document.querySelector('[data-scroll-routine]');
  const video = document.querySelector('[data-scroll-routine-video]');
  const word = document.querySelector('[data-routine-word]');
  if (!section || !video || !word) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;

  let duration = 5.422;
  let targetTime = 0;
  let shownTime = 0;
  let velocity = 0;
  let raf = 0;
  let lastFrame = performance.now();

  const alphaWindow = (time, start, fadeInEnd, fadeOutStart, end) => {
    if (time < start || time > end) return 0;
    if (time < fadeInEnd) return (time - start) / Math.max(.001, fadeInEnd - start);
    if (time <= fadeOutStart) return 1;
    return 1 - (time - fadeOutStart) / Math.max(.001, end - fadeOutStart);
  };

  const wordFor = (time) => {
    const windows = [
      ['Scoop', alphaWindow(time, .70, .85, 1.30, 1.72)],
      ['Stir', alphaWindow(time, 3.10, 3.25, 3.70, 4.08)],
      ['Enjoy', alphaWindow(time, 4.55, 4.70, 5.00, 5.30)]
    ];
    return windows.reduce((best, item) => item[1] > best[1] ? item : best, ['',0]);
  };

  const updateTarget = () => {
    const top = section.offsetTop;
    const travel = Math.max(1, section.offsetHeight - window.innerHeight);
    const raw = Math.min(1, Math.max(0, (window.scrollY - top) / travel));
    // Keep only a brief clean hold on the last frame so the section never feels sticky for too long.
    const timelineProgress = Math.min(1, raw / .965);
    targetTime = duration * timelineProgress;
  };

  const setWordState = (label, alpha) => {
    word.textContent = label;
    word.classList.toggle('is-scoop', label === 'Scoop');
    word.classList.toggle('is-stir', label === 'Stir');
    word.classList.toggle('is-enjoy', label === 'Enjoy');
    word.style.opacity = alpha.toFixed(3);
    // The last few pixels of movement are tied to opacity so words settle rather than pop in.
    const settle = Math.round((1 - alpha) * 8);
    word.style.transform = `translate(calc(-50% + var(--word-x)), calc(var(--word-y) + ${settle}px))`;
  };

  const render = (now) => {
    const dt = Math.min(.034, Math.max(.001, (now - lastFrame) / 1000));
    lastFrame = now;

    // Damped spring: quick response while scrolling, then a short inertial settle after input stops.
    const spring = 34;
    const damping = 8.8;
    const acceleration = (targetTime - shownTime) * spring - velocity * damping;
    velocity += acceleration * dt;
    velocity = Math.max(-7.5, Math.min(7.5, velocity));
    shownTime += velocity * dt;

    if (shownTime < 0) { shownTime = 0; velocity *= .35; }
    if (shownTime > duration) { shownTime = duration; velocity *= .35; }
    if (Math.abs(targetTime - shownTime) < .0015 && Math.abs(velocity) < .004) {
      shownTime = targetTime; velocity = 0;
    }

    if (Number.isFinite(video.duration) && Math.abs(video.currentTime - shownTime) > .009) {
      try { video.currentTime = Math.max(0, Math.min(duration, shownTime)); } catch (_) {}
    }

    const [label, alpha] = wordFor(shownTime);
    setWordState(label, alpha);
    raf = requestAnimationFrame(render);
  };

  video.addEventListener('loadedmetadata', () => {
    if (Number.isFinite(video.duration) && video.duration > 0) duration = video.duration;
    video.pause(); video.currentTime = 0;
    updateTarget();
  }, {once:true});
  video.addEventListener('play', () => video.pause());
  window.addEventListener('scroll', updateTarget, {passive:true});
  window.addEventListener('resize', updateTarget);
  updateTarget();
  raf = requestAnimationFrame(render);
  window.addEventListener('pagehide', () => cancelAnimationFrame(raf), {once:true});
})();
