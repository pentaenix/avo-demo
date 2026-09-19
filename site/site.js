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

// v3.18 — Directional step playback.
// Scroll chooses a semantic destination (start / Scoop / Stir / Enjoy), but it no longer
// scrubs individual frames. The film plays toward that destination at its own smooth rate.
// Fast scrolling therefore queues later steps instead of skipping/chopping through frames,
// and scrolling back simply plays the same footage in reverse.
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
  const SOURCE_FPS = 24;
  const PLAYBACK_RATE = 1.08;
  const PLAYBACK_FPS = SOURCE_FPS * PLAYBACK_RATE;
  const frames = new Array(FRAME_COUNT);
  const loaded = new Uint8Array(FRAME_COUNT);

  // Four resting positions create three real film actions:
  // start -> Scoop -> Stir -> Enjoy.
  const anchors = [0, 62, 111, FRAME_COUNT - 1];
  let desiredState = 0;
  let shownFrame = 0;
  let lastFrame = performance.now();
  let raf = 0;
  let lastDrawn = -1;

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

  // Prime the rest frames and their immediate neighborhoods first.
  anchors.forEach(anchor => {
    for (let offset = -3; offset <= 3; offset += 1) loadFrame(anchor + offset, true);
  });

  // Warm the small frame sequence before this lower-page section is reached.
  let preloadCursor = 0;
  const warmFrames = deadline => {
    let budget = 10;
    while (preloadCursor < FRAME_COUNT && budget > 0 && (!deadline || deadline.timeRemaining() > 2)) {
      loadFrame(preloadCursor, false);
      preloadCursor += 1;
      budget -= 1;
    }
    if (preloadCursor < FRAME_COUNT) {
      if ('requestIdleCallback' in window) requestIdleCallback(warmFrames, { timeout:120 });
      else setTimeout(() => warmFrames(null), 32);
    }
  };
  if ('requestIdleCallback' in window) requestIdleCallback(warmFrames, { timeout:80 });
  else setTimeout(() => warmFrames(null), 24);

  // Scroll only selects which step the film should have completed. It never selects a frame.
  // The first threshold sits just above Scoop, giving us a true start state for reverse playback.
  const getThresholds = () => {
    const viewportCenter = window.innerHeight * .5;
    const centers = steps.map(step => {
      const rect = step.getBoundingClientRect();
      return window.scrollY + rect.top + rect.height * .5 - viewportCenter;
    });
    const d01 = Math.max(1, centers[1] - centers[0]);
    return [
      centers[0] - d01 * .52,
      (centers[0] + centers[1]) * .5,
      (centers[1] + centers[2]) * .5
    ];
  };

  const updateDestination = () => {
    const y = window.scrollY;
    const t = getThresholds();
    let nextState = 0;
    if (y >= t[2]) nextState = 3;
    else if (y >= t[1]) nextState = 2;
    else if (y >= t[0]) nextState = 1;

    desiredState = nextState;

    // The copy remains native scroll content. Focus is continuous rather than snapping:
    // whichever step is nearest the sticky film gets the strongest treatment.
    const mediaRect = media.getBoundingClientRect();
    const focusY = mediaRect.top + mediaRect.height * .5;
    let nearestIndex = 0;
    let nearestDistance = Infinity;
    steps.forEach((step, index) => {
      const rect = step.getBoundingClientRect();
      const center = rect.top + rect.height * .5;
      const distance = Math.abs(center - focusY);
      if (distance < nearestDistance) { nearestDistance = distance; nearestIndex = index; }
      const focus = clamp01(1 - distance / Math.max(window.innerHeight * .43, 240));
      step.style.opacity = String(.30 + focus * .70);
      step.style.transform = `translateY(${(1 - focus) * 5}px)`;
    });
    steps.forEach((step, index) => step.classList.toggle('is-active', index === nearestIndex));

    // Prioritize the path between the current frame and the new destination. A fast fling can
    // jump from Scoop to Enjoy, but playback will still traverse every frame in between.
    const target = anchors[desiredState];
    const lo = Math.max(0, Math.floor(Math.min(shownFrame, target)) - 5);
    const hi = Math.min(FRAME_COUNT - 1, Math.ceil(Math.max(shownFrame, target)) + 5);
    for (let i = lo; i <= hi; i += 1) loadFrame(i, true);
  };

  const render = now => {
    const dt = clamp((now - lastFrame) / 1000, .001, .05);
    lastFrame = now;
    const target = anchors[desiredState];
    const error = target - shownFrame;

    if (Math.abs(error) > .001) {
      // The source motion now plays like film, not like a scrollbar. Scroll speed cannot make
      // it stutter or skip; it only changes the destination. Reverse scroll reverses playback.
      const step = PLAYBACK_FPS * dt;
      shownFrame += Math.sign(error) * Math.min(Math.abs(error), step);
    } else {
      shownFrame = target;
    }

    const drawKey = Math.round(shownFrame * 1000);
    if (drawKey !== lastDrawn) {
      draw(shownFrame);
      lastDrawn = drawKey;
    }
    raf = requestAnimationFrame(render);
  };

  window.addEventListener('scroll', updateDestination, { passive:true });
  window.addEventListener('resize', updateDestination);
  updateDestination();
  raf = requestAnimationFrame(render);
  window.addEventListener('pagehide', () => cancelAnimationFrame(raf), { once:true });
})();
