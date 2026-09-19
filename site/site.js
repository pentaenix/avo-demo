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

// v3.16 — Integrated scrollytelling. A pre-rendered frame sequence avoids repeated video seeks,
// so fast wheel/trackpad movement stays fluid while the page's native scroll still drives the story.
(() => {
  const section = document.querySelector('[data-scroll-routine]');
  const canvas = document.querySelector('[data-scroll-routine-canvas]');
  const media = document.querySelector('[data-scroll-routine-media]');
  const steps = [...document.querySelectorAll('[data-routine-copy-step]')];
  if (!section || !canvas || !media || steps.length !== 3) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;

  const ctx = canvas.getContext('2d', { alpha:false, desynchronized:true });
  if (!ctx) return;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const FRAME_COUNT = 130;
  const DURATION = 5.422089;
  const frames = new Array(FRAME_COUNT);
  const loaded = new Uint8Array(FRAME_COUNT);
  let targetFrame = 0;
  let shownFrame = 0;
  let lastFrame = performance.now();
  let raf = 0;
  let lastDrawn = -1;

  // The three chapters keep the same semantic cuts as v3.15. The visual renderer now
  // traverses the source frames smoothly instead of asking <video> to seek on every tick.
  const ranges = [
    { t0:0.00, t1:2.62 },
    { t0:2.62, t1:4.66 },
    { t0:4.66, t1:DURATION }
  ];

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const clamp01 = value => clamp(value, 0, 1);
  const smoothstep = value => {
    const x = clamp01(value);
    return x * x * (3 - 2 * x);
  };
  const frameUrl = index => `./assets/routine-frames/frame_${String(index + 1).padStart(3, '0')}.webp`;

  const draw = frameFloat => {
    const f = clamp(frameFloat, 0, FRAME_COUNT - 1);
    const base = Math.floor(f);
    const next = Math.min(FRAME_COUNT - 1, base + 1);
    const mix = smoothstep(f - base);
    const a = loaded[base] ? frames[base] : null;
    const b = loaded[next] ? frames[next] : null;

    if (!a && !b) {
      // If the exact frame has not decoded yet, use the nearest decoded frame so the
      // canvas never flashes blank while the rest of the sequence warms in cache.
      for (let offset = 1; offset < 12; offset += 1) {
        const left = base - offset;
        const right = base + offset;
        if (left >= 0 && loaded[left]) return draw(left);
        if (right < FRAME_COUNT && loaded[right]) return draw(right);
      }
      return;
    }

    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (a) ctx.drawImage(a, 0, 0, canvas.width, canvas.height);
    else if (b) ctx.drawImage(b, 0, 0, canvas.width, canvas.height);

    // Blend adjacent source frames at the browser's refresh rate. This removes the
    // 24fps "stepping" that becomes obvious when the user scrolls quickly.
    if (a && b && next !== base && mix > .02) {
      ctx.globalAlpha = mix;
      ctx.drawImage(b, 0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    }
  };

  const loadFrame = (index, priority = false) => {
    if (index < 0 || index >= FRAME_COUNT || frames[index]) return;
    const img = new Image();
    img.decoding = 'async';
    try { img.fetchPriority = priority ? 'high' : 'low'; } catch (_) {}
    img.onload = () => {
      loaded[index] = 1;
      if (index === 0) {
        draw(0);
        media.classList.add('is-frames-ready');
      }
    };
    img.src = frameUrl(index);
    frames[index] = img;
  };

  // Prime the opening frame and the beginning of each semantic chapter first.
  [0, 1, 2, 62, 63, 64, 111, 112, 113, 129].forEach(index => loadFrame(index, true));

  // Warm the full 5 MB sequence in small batches so it is normally ready well before
  // the visitor reaches this third-page block, without blocking the hero or navigation.
  let preloadCursor = 0;
  const warmFrames = deadline => {
    let budget = 8;
    while (preloadCursor < FRAME_COUNT && budget > 0 && (!deadline || deadline.timeRemaining() > 2)) {
      loadFrame(preloadCursor, false);
      preloadCursor += 1;
      budget -= 1;
    }
    if (preloadCursor < FRAME_COUNT) {
      if ('requestIdleCallback' in window) requestIdleCallback(warmFrames, { timeout:120 });
      else setTimeout(() => warmFrames(null), 36);
    }
  };
  if ('requestIdleCallback' in window) requestIdleCallback(warmFrames, { timeout:80 });
  else setTimeout(() => warmFrames(null), 24);

  const getScrollBoundaries = () => {
    const viewportCenter = window.innerHeight * .5;
    const anchors = steps.map(step => {
      const rect = step.getBoundingClientRect();
      const absoluteCenter = window.scrollY + rect.top + rect.height * .5;
      return absoluteCenter - viewportCenter;
    });
    const gap01 = anchors[1] - anchors[0];
    const gap12 = anchors[2] - anchors[1];
    return [
      anchors[0] - gap01 * .5,
      (anchors[0] + anchors[1]) * .5,
      (anchors[1] + anchors[2]) * .5,
      anchors[2] + gap12 * .5
    ];
  };

  const updateTarget = () => {
    const boundaries = getScrollBoundaries();
    const y = window.scrollY;
    let stage = 0;
    if (y >= boundaries[2]) stage = 2;
    else if (y >= boundaries[1]) stage = 1;

    const local = clamp01((y - boundaries[stage]) / Math.max(1, boundaries[stage + 1] - boundaries[stage]));
    const eased = smoothstep(local);
    const range = ranges[stage];
    const targetTime = range.t0 + (range.t1 - range.t0) * eased;
    targetFrame = (targetTime / DURATION) * (FRAME_COUNT - 1);

    // Keep the visual chapter cue smooth as normal page content passes the viewport center.
    const viewportCenter = window.innerHeight * .5;
    let nearest = 0;
    let nearestDistance = Infinity;
    steps.forEach((step, index) => {
      const rect = step.getBoundingClientRect();
      const distance = Math.abs((rect.top + rect.height * .5) - viewportCenter);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = index;
      }
    });
    steps.forEach((step, index) => step.classList.toggle('is-active', index === nearest));

    // Prioritize a small neighborhood around wherever a fast fling just moved the target.
    const center = Math.round(targetFrame);
    for (let offset = -6; offset <= 6; offset += 1) loadFrame(center + offset, true);
  };

  const render = now => {
    const dt = clamp((now - lastFrame) / 1000, .001, .04);
    lastFrame = now;
    const error = targetFrame - shownFrame;

    // Fast response for small hand movements, but cap catch-up speed for large jumps.
    // That cap is what turns a fast trackpad fling into continuous motion instead of a
    // handful of violent seeks. It typically catches a full-stage jump in ~250–400 ms.
    const naturalStep = error * (1 - Math.exp(-18 * dt));
    const maxStep = .85 + Math.min(2.55, Math.abs(error) * .085);
    shownFrame += clamp(naturalStep, -maxStep, maxStep);
    if (Math.abs(error) < .015) shownFrame = targetFrame;

    // Drawing every animation frame allows sub-frame blending even though the source is 24fps.
    const drawKey = Math.round(shownFrame * 1000);
    if (drawKey !== lastDrawn) {
      draw(shownFrame);
      lastDrawn = drawKey;
    }
    raf = requestAnimationFrame(render);
  };

  window.addEventListener('scroll', updateTarget, { passive:true });
  window.addEventListener('resize', updateTarget);
  updateTarget();
  raf = requestAnimationFrame(render);
  window.addEventListener('pagehide', () => cancelAnimationFrame(raf), { once:true });
})();
