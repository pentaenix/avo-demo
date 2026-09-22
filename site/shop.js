(() => {
  const state = { size: 30, quantity: 1, plan: 'one-time', cart: Math.max(0, Number(localStorage.getItem('avokind-demo-cart-count') || 0) || 0) };
  const sizePrice = { 15: 29.99, 30: 59.99 };
  const quantityDiscount = { 1: 0, 2: 0.05, 3: 0.10 };
  const subscriptionDiscount = 0.10;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const money = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  const ingredientResearch = {
    'Pineapple': {
      research: `Pineapple is a natural source of bromelain, a group of protein-digesting enzymes studied for anti-inflammatory and other biological activity. Most clinical research uses concentrated bromelain rather than food amounts.`,
      citation: 'Rathnavelu, V., et al. (2016). Potential role of bromelain in clinical and therapeutic applications. Biomedical Reports, 5(3), 283–288.',
      source: 'https://doi.org/10.3892/br.2016.720'
    },
    'Nopal': {
      research: `Nopal brings fiber and plant compounds. In adults with type 2 diabetes, 300 g of steamed nopal eaten with a high-carbohydrate breakfast reduced post-meal glucose and insulin responses. The study tested 300 g of steamed nopal, not Green Boost itself.`,
      citation: 'López-Romero, P., et al. (2014). The effect of nopal (Opuntia ficus indica) on postprandial blood glucose, incretins, and antioxidant activity. Journal of the Academy of Nutrition and Dietetics, 114(11), 1811–1818.',
      source: 'https://doi.org/10.1016/j.jand.2014.06.352'
    },
    'Green Apple': {
      research: `Whole apples provide fiber and polyphenols. In an eight-week crossover trial, two apples a day lowered LDL cholesterol and improved vascular measures versus a matched control drink. Green Boost uses apple as one part of the blend.`,
      citation: 'Koutsos, A., et al. (2020). Two apples a day lower serum cholesterol and improve cardiometabolic biomarkers in mildly hypercholesterolemic adults. The American Journal of Clinical Nutrition, 111(2), 307–318.',
      source: 'https://doi.org/10.1093/ajcn/nqz282'
    },
    'Cucumber': {
      research: `Cucumber contains flavonoids, cucurbitacins and other plant compounds studied for antioxidant activity. Human clinical evidence is limited, so its clearest job here is simple: keep the blend cool and refreshing.`,
      citation: 'Mukherjee, P. K., Nema, N. K., Maity, N., & Sarkar, B. K. (2013). Phytochemical and therapeutic potential of cucumber. Fitoterapia, 84, 227–236.',
      source: 'https://doi.org/10.1016/j.fitote.2012.10.003'
    },
    'Spinach': {
      research: `Spinach is naturally high in dietary nitrate. In a randomized crossover trial, a high-nitrate spinach intervention lowered systolic blood pressure at one measured time point and affected arterial stiffness. The trial studied a dedicated high-nitrate spinach intervention, not Green Boost itself.`,
      citation: 'Jovanovski, E., et al. (2015). Effect of spinach, a high dietary nitrate source, on arterial stiffness and related hemodynamic measures. Clinical Nutrition Research, 4(3), 160–167.',
      source: 'https://doi.org/10.7762/cnr.2015.4.3.160'
    },
    'Celery': {
      research: `Celery contains phthalides, phenolics and flavonoids studied for antioxidant and other biological activity. Most evidence is preclinical; in the blend, celery brings crisp green flavor.`,
      citation: 'Sowbhagya, H. B. (2014). Chemistry, technology, and nutraceutical functions of celery (Apium graveolens L.): An overview. Critical Reviews in Food Science and Nutrition, 54(3), 389–398.',
      source: 'https://doi.org/10.1080/10408398.2011.586740'
    },
    'Avocado': {
      research: `Avocado's naturally occurring fat can help the body absorb fat-soluble carotenoids from vegetables. Human crossover studies found higher absorption of lycopene, beta-carotene, alpha-carotene and lutein when avocado or avocado oil was added to salsa or salad. In Green Boost, it also adds natural creaminess.`,
      citation: 'Unlu, N. Z., Bohn, T., Clinton, S. K., & Schwartz, S. J. (2005). Carotenoid absorption from salad and salsa by humans is enhanced by the addition of avocado or avocado oil. The Journal of Nutrition, 135(3), 431–436.',
      source: 'https://doi.org/10.1093/jn/135.3.431'
    },
    'Cilantro': {
      research: `Cilantro contains carotenoids, phenolics and aromatic compounds studied for biological activity. Human clinical evidence is limited; its immediate contribution here is fresh herbal flavor.`,
      citation: 'Wei, J.-N., et al. (2019). Phytochemical and bioactive profile of Coriandrum sativum L. Food Chemistry, 286, 260–267.',
      source: 'https://doi.org/10.1016/j.foodchem.2019.01.171'
    },
    'Ginger': {
      research: `Ginger has been studied for digestive function. In a double-blind crossover study, 1.2 g of ginger accelerated gastric emptying and increased stomach contractions in healthy adults. In Green Boost, it also adds a gentle warming finish.`,
      citation: 'Wu, K.-L., et al. (2008). Effects of ginger on gastric emptying and motility in healthy humans. European Journal of Gastroenterology & Hepatology, 20(5), 436–440.',
      source: 'https://doi.org/10.1097/MEG.0b013e3282f4b224'
    },
    'Turmeric': {
      research: `Turmeric's curcuminoids are among the best-studied plant polyphenols. A 2023 meta-analysis of 66 randomized trials found improvements in several inflammatory and oxidative-stress biomarkers with turmeric or curcumin supplements. Those studies used supplement formulations, not the amount in Green Boost.`,
      citation: 'Dehzad, M. J., Ghalandari, H., Nouri, M., & Askarpour, M. (2023). Antioxidant and anti-inflammatory effects of curcumin/turmeric supplementation in adults. Cytokine, 164, 156144.',
      source: 'https://doi.org/10.1016/j.cyto.2023.156144'
    },
    'Mint': {
      research: `Mentha, especially peppermint oil, has clinical research around digestive symptoms. A 2025 systematic review found improvements in abdominal pain or discomfort in most included trials. Those studies mainly used concentrated oils; Green Boost uses whole mint.`,
      citation: 'Hirata, M., et al. (2025). Investigating the health potential of Mentha species against gastrointestinal disorders—A systematic review of clinical evidence. Pharmaceuticals, 18(5), 693.',
      source: 'https://doi.org/10.3390/ph18050693'
    },
    'Basil': {
      research: `Basil contains polyphenols, flavonoids and aromatic compounds studied in antioxidant and inflammatory pathways. Most evidence comes from extracts and preclinical research; here it also brings soft herbal balance.`,
      citation: 'Sestili, P., et al. (2018). The potential effects of Ocimum basilicum on health: A review of pharmacological and toxicological studies. Expert Opinion on Drug Metabolism & Toxicology, 14(7), 679–692.',
      source: 'https://doi.org/10.1080/17425255.2018.1484450'
    }
  };

  function totals(plan = state.plan) {
    const base = sizePrice[state.size] * state.quantity;
    const qtyAdjusted = base * (1 - quantityDiscount[state.quantity]);
    return plan === 'subscribe' ? qtyAdjusted * (1 - subscriptionDiscount) : qtyAdjusted;
  }

  function perServing(plan = state.plan, qty = state.quantity) {
    const servings = state.size * qty;
    return totals(plan) / servings;
  }

  function syncPurchaseUI() {
    const oneTime = totals('one-time');
    const subscribe = totals('subscribe');
    $('[data-onetime-price]').textContent = money(oneTime);
    $('[data-subscribe-compare]').textContent = money(oneTime);
    $('[data-subscribe-price]').textContent = money(subscribe);
    $('[data-subscribe-per]').textContent = `${money(perServing('subscribe'))} per serving`;
    $('[data-total-price]').textContent = money(totals());
    $('[data-mobile-total]').textContent = money(totals());
    $('[data-quantity-label]').textContent = `${state.quantity} ${state.quantity === 1 ? 'POUCH' : 'POUCHES'}`;
    $('[data-includes-product]').textContent = `AvoKind Green Boost · ${state.size * state.quantity} servings`;
    $('[data-includes-price]').textContent = money(subscribe);
    $('[data-frequency-title]').textContent = state.plan === 'subscribe' ? 'FLEXIBLE PLAN' : 'ONE-TIME';

    [1, 2, 3].forEach((qty) => {
      const servings = state.size * qty;
      const node = $(`[data-quantity-servings="${qty}"]`);
      const unit = $(`[data-quantity-unit="${qty}"]`);
      if (node) node.textContent = `${servings} servings`;
      if (unit) {
        const base = sizePrice[state.size] * qty * (1 - quantityDiscount[qty]);
        unit.textContent = `${money(base / servings)} per serving`;
      }
    });

    const card = $('.frequency-card');
    if (card) card.dataset.plan = state.plan;
  }

  $$('[data-size-option]').forEach((button) => button.addEventListener('click', () => {
    state.size = Number(button.dataset.sizeOption);
    $$('[data-size-option]').forEach((b) => {
      const active = b === button;
      b.classList.toggle('is-selected', active);
      b.setAttribute('aria-pressed', String(active));
    });
    syncPurchaseUI();
  }));

  $$('[data-quantity-card]').forEach((button) => button.addEventListener('click', () => {
    state.quantity = Number(button.dataset.quantityCard);
    $$('[data-quantity-card]').forEach((b) => {
      const active = b === button;
      b.classList.toggle('is-selected', active);
      b.setAttribute('aria-pressed', String(active));
    });
    syncPurchaseUI();
  }));

  $$('[data-purchase-plan]').forEach((button) => button.addEventListener('click', () => {
    state.plan = button.dataset.purchasePlan;
    $$('[data-purchase-plan]').forEach((b) => {
      const active = b === button;
      b.classList.toggle('is-selected', active);
      b.setAttribute('aria-pressed', String(active));
    });
    syncPurchaseUI();
  }));

  // Infinite product gallery: last → first and first → last without visible arrows.
  const galleryTrack = $('[data-gallery-track]');
  const galleryThumbs = $$('[data-gallery-thumb]');
  const originalGallerySlides = galleryTrack ? $$('.gallery-slide', galleryTrack) : [];
  const galleryCount = originalGallerySlides.length;
  let galleryIndex = 0;
  let galleryPhysicalIndex = 1;
  let galleryDragging = false;
  let galleryDragged = false;
  let galleryDragStartX = 0;
  let galleryDragLastX = 0;
  let galleryDragStartScroll = 0;
  let galleryDragStartPhysical = 1;
  let galleryDragStartLogical = 0;
  let galleryScrollTimer = null;
  let galleryLoopJumping = false;

  if (galleryTrack && galleryCount > 1) {
    const before = originalGallerySlides[galleryCount - 1].cloneNode(true);
    const after = originalGallerySlides[0].cloneNode(true);
    before.dataset.galleryClone = 'before';
    after.dataset.galleryClone = 'after';
    galleryTrack.prepend(before);
    galleryTrack.append(after);
  }

  function galleryWidth() {
    return galleryTrack?.clientWidth || 1;
  }

  function logicalFromPhysical(physical) {
    return ((physical - 1) % galleryCount + galleryCount) % galleryCount;
  }

  function updateGalleryThumbs() {
    galleryThumbs.forEach((thumb, index) => {
      const active = index === galleryIndex;
      thumb.classList.toggle('is-active', active);
      thumb.setAttribute('aria-current', active ? 'true' : 'false');
    });
  }

  function hardJumpGallery(physical) {
    if (!galleryTrack || !galleryCount) return;
    galleryLoopJumping = true;
    const previousBehavior = galleryTrack.style.scrollBehavior;
    galleryTrack.style.scrollBehavior = 'auto';
    galleryPhysicalIndex = physical;
    galleryIndex = logicalFromPhysical(physical);
    galleryTrack.scrollLeft = galleryWidth() * physical;
    // Force the instantaneous reposition before restoring smooth scrolling.
    void galleryTrack.offsetWidth;
    galleryTrack.style.scrollBehavior = previousBehavior;
    updateGalleryThumbs();
    requestAnimationFrame(() => { galleryLoopJumping = false; });
  }

  function scrollGalleryPhysical(physical, behavior = 'smooth') {
    if (!galleryTrack || !galleryCount) return;
    if (behavior === 'auto') {
      hardJumpGallery(physical);
      return;
    }
    galleryPhysicalIndex = physical;
    galleryIndex = logicalFromPhysical(physical);
    galleryTrack.scrollTo({ left: galleryWidth() * physical, behavior });
    updateGalleryThumbs();
    galleryThumbs[galleryIndex]?.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
  }

  function normalizeGalleryLoop() {
    if (!galleryTrack || galleryDragging || galleryLoopJumping || !galleryCount) return;
    if (galleryPhysicalIndex <= 0) {
      hardJumpGallery(galleryCount);
    } else if (galleryPhysicalIndex >= galleryCount + 1) {
      hardJumpGallery(1);
    }
    updateGalleryThumbs();
  }

  function goGallery(logicalIndex, behavior = 'smooth') {
    if (!galleryTrack || !galleryCount) return;
    const logical = ((logicalIndex % galleryCount) + galleryCount) % galleryCount;
    const normalPhysical = logical + 1;
    const candidates = [normalPhysical];
    if (logical === 0) candidates.push(galleryCount + 1);
    if (logical === galleryCount - 1) candidates.push(0);
    const physical = candidates.reduce((best, candidate) =>
      Math.abs(candidate - galleryPhysicalIndex) < Math.abs(best - galleryPhysicalIndex) ? candidate : best
    , candidates[0]);
    scrollGalleryPhysical(physical, behavior);
  }

  function initGalleryPosition() {
    if (!galleryTrack || !galleryCount) return;
    hardJumpGallery(1);
  }
  requestAnimationFrame(initGalleryPosition);
  window.addEventListener('resize', () => requestAnimationFrame(() => scrollGalleryPhysical(galleryPhysicalIndex, 'auto')));

  galleryThumbs.forEach((thumb) => thumb.addEventListener('click', () => {
    if (galleryDragged) return;
    goGallery(Number(thumb.dataset.galleryThumb));
  }));

  galleryTrack?.addEventListener('scroll', () => {
    if (!galleryTrack.clientWidth || galleryDragging || galleryLoopJumping) return;
    galleryPhysicalIndex = Math.round(galleryTrack.scrollLeft / galleryWidth());
    galleryIndex = logicalFromPhysical(galleryPhysicalIndex);
    updateGalleryThumbs();
    clearTimeout(galleryScrollTimer);
    galleryScrollTimer = setTimeout(normalizeGalleryLoop, 90);
  }, { passive: true });

  galleryTrack?.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    galleryDragging = true;
    galleryDragged = false;
    galleryDragStartX = event.clientX;
    galleryDragLastX = event.clientX;
    galleryDragStartScroll = galleryTrack.scrollLeft;
    galleryDragStartPhysical = galleryPhysicalIndex;
    galleryDragStartLogical = galleryIndex;
    galleryTrack.classList.add('is-dragging');
    galleryTrack.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  });

  galleryTrack?.addEventListener('pointermove', (event) => {
    if (!galleryDragging) return;
    galleryDragLastX = event.clientX;
    const delta = event.clientX - galleryDragStartX;
    if (Math.abs(delta) > 3) galleryDragged = true;
    galleryTrack.scrollLeft = galleryDragStartScroll - delta;
    event.preventDefault();
  });

  function finishGalleryDrag(event) {
    if (!galleryDragging) return;
    const endX = Number.isFinite(event?.clientX) ? event.clientX : galleryDragLastX;
    const delta = endX - galleryDragStartX;
    const threshold = Math.min(28, galleryWidth() * 0.045);
    galleryDragging = false;
    galleryTrack.classList.remove('is-dragging');
    if (event?.pointerId != null && galleryTrack.hasPointerCapture?.(event.pointerId)) {
      galleryTrack.releasePointerCapture(event.pointerId);
    }
    if (Math.abs(delta) >= threshold) {
      goGallery(galleryDragStartLogical + (delta < 0 ? 1 : -1));
    } else {
      goGallery(galleryDragStartLogical);
    }
    setTimeout(normalizeGalleryLoop, 380);
    window.setTimeout(() => { galleryDragged = false; }, 0);
  }

  galleryTrack?.addEventListener('pointerup', finishGalleryDrag);
  galleryTrack?.addEventListener('pointercancel', finishGalleryDrag);
  galleryTrack?.addEventListener('lostpointercapture', () => {
    if (galleryDragging) finishGalleryDrag();
  });
  galleryTrack?.addEventListener('dragstart', (event) => event.preventDefault());
  galleryTrack?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); goGallery(galleryIndex - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); goGallery(galleryIndex + 1); }
  });

  // Infinite, freely draggable ingredient rail. Duplicate sets are visual only.
  const ingredientsTrack = $('[data-ingredients-track]');
  let ingredientLoopWidth = 0;
  let ingredientDragging = false;
  let ingredientDragStartX = 0;
  let ingredientDragStartScroll = 0;

  if (ingredientsTrack) {
    const originals = [...ingredientsTrack.children];
    const beforeFragment = document.createDocumentFragment();
    const afterFragment = document.createDocumentFragment();
    originals.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.dataset.loopClone = 'before';
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('button').forEach((button) => button.tabIndex = -1);
      beforeFragment.appendChild(clone);
    });
    originals.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.dataset.loopClone = 'after';
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll('button').forEach((button) => button.tabIndex = -1);
      afterFragment.appendChild(clone);
    });
    ingredientsTrack.prepend(beforeFragment);
    ingredientsTrack.append(afterFragment);

    requestAnimationFrame(() => {
      const all = [...ingredientsTrack.children];
      const firstOriginal = all[originals.length];
      const firstAfter = all[originals.length * 2];
      if (!firstOriginal || !firstAfter) return;
      ingredientLoopWidth = firstAfter.offsetLeft - firstOriginal.offsetLeft;
      ingredientsTrack.scrollLeft = firstOriginal.offsetLeft;
    });

    ingredientsTrack.addEventListener('scroll', () => {
      if (!ingredientLoopWidth) return;
      const maxScroll = ingredientsTrack.scrollWidth - ingredientsTrack.clientWidth;
      if (ingredientsTrack.scrollLeft <= 2) {
        ingredientsTrack.scrollLeft += ingredientLoopWidth;
      } else if (ingredientsTrack.scrollLeft >= maxScroll - 2) {
        ingredientsTrack.scrollLeft -= ingredientLoopWidth;
      }
    }, { passive: true });

    ingredientsTrack.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      // The + control must remain a normal button. Starting a drag here would
      // prevent its click event and stop the ingredient drawer from opening.
      if (event.target.closest('[data-ingredient-trigger]')) return;
      ingredientDragging = true;
      ingredientDragStartX = event.clientX;
      ingredientDragStartScroll = ingredientsTrack.scrollLeft;
      ingredientsTrack.classList.add('is-dragging');
      ingredientsTrack.setPointerCapture?.(event.pointerId);
      event.preventDefault();
    });

    ingredientsTrack.addEventListener('pointermove', (event) => {
      if (!ingredientDragging) return;
      ingredientsTrack.scrollLeft = ingredientDragStartScroll - (event.clientX - ingredientDragStartX);
      event.preventDefault();
    });

    const finishIngredientDrag = (event) => {
      if (!ingredientDragging) return;
      ingredientDragging = false;
      ingredientsTrack.classList.remove('is-dragging');
      if (event?.pointerId != null && ingredientsTrack.hasPointerCapture?.(event.pointerId)) {
        ingredientsTrack.releasePointerCapture(event.pointerId);
      }
    };
    ingredientsTrack.addEventListener('pointerup', finishIngredientDrag);
    ingredientsTrack.addEventListener('pointercancel', finishIngredientDrag);
    ingredientsTrack.addEventListener('dragstart', (event) => event.preventDefault());
  }

  const drawer = $('[data-ingredient-drawer]');
  const drawerImage = $('[data-drawer-image]');
  const drawerTitle = $('[data-drawer-title]');
  const drawerDescription = $('[data-drawer-description]');
  const drawerLabel1 = $('[data-drawer-label1]');
  const drawerValue1 = $('[data-drawer-value1]');
  const drawerLabel2 = $('[data-drawer-label2]');
  const drawerValue2 = $('[data-drawer-value2]');
  const drawerResearch = $('[data-drawer-research]');
  const drawerCitation = $('[data-drawer-citation]');
  let lastTrigger = null;

  function openDrawer(trigger) {
    const research = ingredientResearch[trigger.dataset.name] || {};
    lastTrigger = trigger;
    drawerImage.src = trigger.dataset.src;
    drawerImage.alt = trigger.dataset.name;
    drawerTitle.textContent = trigger.dataset.name;
    drawerDescription.textContent = trigger.dataset.description;
    drawerLabel1.textContent = trigger.dataset.label1;
    drawerValue1.textContent = trigger.dataset.value1;
    drawerLabel2.textContent = trigger.dataset.label2;
    drawerValue2.textContent = trigger.dataset.value2;
    if (drawerResearch) drawerResearch.textContent = research.research || '';
    if (drawerCitation) {
      drawerCitation.textContent = research.citation || '';
      drawerCitation.href = research.source || '#';
    }
    drawer.classList.add('is-active');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    $('[data-drawer-close]')?.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('is-active');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastTrigger && !lastTrigger.closest('[aria-hidden="true"]')) lastTrigger.focus();
  }

  ingredientsTrack?.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-ingredient-trigger]');
    if (trigger) openDrawer(trigger);
  });
  $('[data-ingredient-overlay]')?.addEventListener('click', closeDrawer);
  $('[data-drawer-close]')?.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && drawer?.classList.contains('is-active')) closeDrawer();
  });

  const toast = $('[data-toast]');
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
  }

  const syncCart = () => {
    const countNode = $('[data-cart-count]');
    const cartButton = $('[data-cart-button]');
    if (countNode) countNode.textContent = state.cart;
    if (cartButton) cartButton.setAttribute('aria-label', `Cart, ${state.cart} item${state.cart === 1 ? '' : 's'}`);
    localStorage.setItem('avokind-demo-cart-count', String(state.cart));
  };
  syncCart();
  $$('[data-add-to-cart]').forEach((button) => button.addEventListener('click', () => {
    const unitTotal = totals() / state.quantity;
    const line = {
      id: `green-boost-${state.size}-${state.plan}`,
      product: 'Green Boost',
      size: state.size,
      plan: state.plan,
      quantity: state.quantity,
      unitPrice: unitTotal,
      image: './assets/gallery-product.jpg'
    };
    let lines = [];
    try { lines = JSON.parse(localStorage.getItem('avokind-cart-lines') || '[]'); } catch (_) {}
    const existing = lines.find((item) => item.id === line.id);
    if (existing) existing.quantity += line.quantity;
    else lines.push(line);
    localStorage.setItem('avokind-cart-lines', JSON.stringify(lines));
    state.cart = lines.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    syncCart();
    window.dispatchEvent(new CustomEvent('avokind-cart-change'));
    window.dispatchEvent(new CustomEvent('avokind-cart-open'));
  }));

  const menuButton = $('[data-menu-button]');
  const mobileNav = $('[data-mobile-nav]');
  menuButton?.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  syncPurchaseUI();


  function showPrototypeToast(message) {
    let toast = document.querySelector('.global-cart-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'global-cart-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(showPrototypeToast.timer);
    showPrototypeToast.timer = setTimeout(() => toast.classList.remove('is-visible'), 1800);
  }

  // Review controls.
  const reviewFilters = $$('[data-review-filter]');
  const ratingFilters = $$('[data-rating-filter]');
  const reviewStatus = $('[data-review-status]');
  const reviewSort = $('[data-review-sort]');
  const reviewList = $('[data-review-list]');
  const reviewCards = $$('[data-review-card]');
  const reviewEmpty = $('[data-review-empty]');
  const filterToggle = $('[data-review-filter-toggle]');
  const filterDrawer = $('[data-review-filter-drawer]');
  const reviewTabs = $$('[data-review-tab]');
  const reviewPanels = $$('[data-review-panel]');
  const demoWriteButtons = $$('[data-demo-review-write]');
  let activeTopic = 'All';
  let activeRating = null;

  function applyReviews() {
    let visible = reviewCards.filter((card) => {
      const topics = (card.dataset.topics || '').split(/\s+/);
      const topicMatch = activeTopic === 'All' || topics.includes(activeTopic);
      const ratingMatch = activeRating === null || Number(card.dataset.rating || 0) === activeRating;
      return topicMatch && ratingMatch;
    });
    const mode = reviewSort?.value || 'recent';
    visible.sort((a,b) => {
      if (mode === 'recent') return (b.dataset.date || '').localeCompare(a.dataset.date || '');
      if (mode === 'high') return Number(b.dataset.rating || 0) - Number(a.dataset.rating || 0);
      if (mode === 'low') return Number(a.dataset.rating || 0) - Number(b.dataset.rating || 0);
      return Number(b.dataset.helpful || 0) - Number(a.dataset.helpful || 0);
    });
    visible.forEach(card => reviewList?.appendChild(card));
    reviewCards.forEach(card => card.hidden = !visible.includes(card));
    if (reviewEmpty) reviewEmpty.hidden = visible.length !== 0;
    if (reviewStatus) {
      const filtered = activeTopic !== 'All' || activeRating !== null;
      reviewStatus.textContent = filtered ? `${visible.length} matching review${visible.length === 1 ? '' : 's'}` : '34 reviews';
    }
  }

  reviewFilters.forEach((button) => button.addEventListener('click', () => {
    activeTopic = button.dataset.reviewFilter || 'All';
    reviewFilters.forEach((b) => b.classList.toggle('is-active', b === button));
    applyReviews();
  }));
  ratingFilters.forEach((button) => button.addEventListener('click', () => {
    const value = Number(button.dataset.ratingFilter || 0);
    activeRating = activeRating === value ? null : value;
    ratingFilters.forEach((b) => b.classList.toggle('is-active', Number(b.dataset.ratingFilter || 0) === activeRating));
    applyReviews();
  }));
  reviewSort?.addEventListener('change', applyReviews);
  filterToggle?.addEventListener('click', () => {
    const next = filterDrawer?.hasAttribute('hidden');
    if (!filterDrawer) return;
    filterDrawer.toggleAttribute('hidden', !next);
    filterToggle.setAttribute('aria-expanded', String(next));
    const symbol = filterToggle.querySelector('span');
    if (symbol) symbol.textContent = next ? '−' : '＋';
  });
  reviewTabs.forEach((tab) => tab.addEventListener('click', () => {
    const target = tab.dataset.reviewTab;
    reviewTabs.forEach((t) => {
      const active = t === tab;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', String(active));
    });
    reviewPanels.forEach((panel) => panel.hidden = panel.dataset.reviewPanel !== target);
  }));
  demoWriteButtons.forEach((button) => button.addEventListener('click', () => {
    showPrototypeToast(button.textContent?.includes('Question') ? 'Question form is not connected in this demo.' : 'Review submission is not connected in this demo.');
  }));
  $$('.review-helpful').forEach((group) => {
    const buttons = $$('button', group);
    buttons.forEach((button) => button.addEventListener('click', () => {
      const wasPressed = button.getAttribute('aria-pressed') === 'true';
      buttons.forEach((other) => other.setAttribute('aria-pressed', 'false'));
      if (!wasPressed) button.setAttribute('aria-pressed', 'true');
      showPrototypeToast(wasPressed ? 'Helpful vote removed.' : 'Thanks for the feedback.');
    }));
  });
  applyReviews();
  applyReviews();

})();
