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

// v3.24 — Scroll chooses the step; the browser plays a short animated image.
// This deliberately avoids video.play(), autoplay policy, media seeking, and frame scrubbing.
// A fresh <img> node is inserted for every step so each animation reliably restarts.
(() => {
  const section = document.querySelector('[data-scroll-routine]');
  const media = document.querySelector('[data-scroll-routine-media]');
  const stage = document.querySelector('[data-routine-animation-stage]');
  const steps = [...document.querySelectorAll('[data-routine-copy-step]')];
  if (!section || !media || !stage || steps.length !== 3) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduced.matches) return;

  const segments = [
    { name: 'scoop', ms: 2120 },
    { name: 'stir',  ms: 1660 },
    { name: 'enjoy', ms: 620 }
  ];
  const base = './assets/routine-steps-webp/';
  const urls = [];
  for (const segment of segments) {
    urls.push(`${base}${segment.name}-forward.webp`, `${base}${segment.name}-reverse.webp`);
  }

  // Start downloading before the section reaches the viewport. These are small, cached images.
  const preloaders = urls.map(src => {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
    return img;
  });

  let state = 0;          // 0=start, 1=scoop complete, 2=stir complete, 3=enjoy complete
  let desiredState = 0;
  let running = false;
  let timer = 0;
  let queuedRaf = 0;
  let runId = 0;

  const showSegment = (stepNumber, direction) => {
    const segment = segments[stepNumber - 1];
    if (!segment) return;

    running = true;
    const nextState = direction > 0 ? stepNumber : stepNumber - 1;
    const suffix = direction > 0 ? 'forward' : 'reverse';
    const src = `${base}${segment.name}-${suffix}.webp`;
    const thisRun = ++runId;

    const img = new Image();
    img.className = 'scroll-routine-animation';
    img.alt = '';
    img.decoding = 'async';
    img.draggable = false;
    let begun = false;

    const begin = () => {
      if (begun || thisRun !== runId) return;
      begun = true;
      stage.replaceChildren(img);
      requestAnimationFrame(() => media.classList.add('is-animation-ready'));
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (thisRun !== runId) return;
        state = nextState;
        running = false;
        runTowardDesired();
      }, segment.ms);
    };

    img.addEventListener('load', begin, { once: true });
    img.addEventListener('error', () => {
      // The static poster remains visible if an animation asset ever fails.
      state = nextState;
      running = false;
      runTowardDesired();
    }, { once: true });
    img.src = src;

    // Cached images can already be complete before the load listener gets a turn.
    if (img.complete && img.naturalWidth > 0) begin();
  };

  function runTowardDesired() {
    if (running || desiredState === state) return;
    if (desiredState > state) showSegment(state + 1, 1);
    else showSegment(state, -1);
  }

  const updateDestination = () => {
    queuedRaf = 0;
    const sectionRect = section.getBoundingClientRect();

    if (sectionRect.top > window.innerHeight * .92) {
      desiredState = 0;
      steps.forEach((step, i) => {
        step.classList.toggle('is-active', i === 0);
        step.style.opacity = i === 0 ? '1' : '.34';
        step.style.transform = 'none';
      });
      runTowardDesired();
      return;
    }

    if (sectionRect.bottom < window.innerHeight * .08) {
      desiredState = 3;
      steps.forEach((step, i) => {
        step.classList.toggle('is-active', i === 2);
        step.style.opacity = i === 2 ? '1' : '.34';
        step.style.transform = 'none';
      });
      runTowardDesired();
      return;
    }

    const focusY = window.innerHeight * .5;
    let nearest = 0;
    let nearestDistance = Infinity;

    steps.forEach((step, index) => {
      const r = step.getBoundingClientRect();
      const center = r.top + r.height * .5;
      const distance = Math.abs(center - focusY);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = index;
      }
      const focus = Math.max(0, Math.min(1, 1 - distance / Math.max(window.innerHeight * .34, 220)));
      step.style.opacity = String(.34 + focus * .66);
      step.style.transform = `translateY(${(1 - focus) * 3}px)`;
    });

    steps.forEach((step, index) => step.classList.toggle('is-active', index === nearest));
    desiredState = nearest + 1;
    runTowardDesired();
  };

  const scheduleUpdate = () => {
    if (!queuedRaf) queuedRaf = requestAnimationFrame(updateDestination);
  };

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) scheduleUpdate();
  });

  updateDestination();
})();
