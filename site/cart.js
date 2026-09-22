(() => {
  const COUNT_KEY = 'avokind-demo-cart-count';
  const LINES_KEY = 'avokind-cart-lines';
  const buttons = [...document.querySelectorAll('[data-cart-button]')];
  if (!buttons.length) return;

  const money = (value) => new Intl.NumberFormat('en-US', { style:'currency', currency:'USD' }).format(value || 0);
  const readLines = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(LINES_KEY) || '[]');
      return Array.isArray(parsed) ? parsed.filter(line => Number(line.quantity) > 0) : [];
    } catch (_) { return []; }
  };
  const writeLines = (lines) => {
    localStorage.setItem(LINES_KEY, JSON.stringify(lines));
    localStorage.setItem(COUNT_KEY, String(lines.reduce((sum, line) => sum + Number(line.quantity || 0), 0)));
  };
  const assetPath = (path) => {
    if (!path) return document.location.pathname.includes('/blog/') ? '../assets/gallery-product.jpg' : './assets/gallery-product.jpg';
    if (document.location.pathname.includes('/blog/') && path.startsWith('./')) return `.${path}`;
    return path;
  };

  const shell = document.createElement('div');
  shell.className = 'cart-drawer-shell';
  shell.setAttribute('aria-hidden','true');
  shell.innerHTML = `
    <div class="cart-drawer-overlay" data-cart-overlay></div>
    <aside class="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <header class="cart-drawer-head"><h2 id="cart-title">Your cart</h2><button class="cart-drawer-close" type="button" data-cart-close aria-label="Close cart">×</button></header>
      <div class="cart-drawer-body" data-cart-body></div>
      <footer class="cart-drawer-foot" data-cart-foot>
        <div class="cart-subtotal"><span>Subtotal</span><strong data-cart-subtotal>$0.00</strong></div>
        <p class="cart-note">Shipping and taxes are calculated at checkout.</p>
        <button class="cart-checkout" type="button" data-cart-checkout>Checkout</button>
        <a class="cart-continue" href="#" data-cart-continue>Continue shopping</a>
      </footer>
    </aside>`;
  document.body.appendChild(shell);
  const body = shell.querySelector('[data-cart-body]');
  const foot = shell.querySelector('[data-cart-foot]');
  let lastFocus = null;

  const count = (lines) => lines.reduce((sum,line)=>sum+Number(line.quantity||0),0);
  const syncButtons = (lines) => {
    const total = count(lines);
    document.querySelectorAll('[data-cart-count]').forEach(node => node.textContent = String(total));
    buttons.forEach(button => button.setAttribute('aria-label', `Cart, ${total} item${total === 1 ? '' : 's'}`));
  };

  const render = () => {
    const lines = readLines();
    syncButtons(lines);
    if (!lines.length) {
      body.innerHTML = `<div class="cart-empty"><div><strong>Your cart is empty.</strong><span>Green Boost is ready when you are.</span></div></div>`;
      foot.hidden = true;
      return;
    }
    foot.hidden = false;
    body.innerHTML = lines.map((line,index) => {
      const plan = line.plan === 'subscribe' ? 'Flexible Plan' : 'One-time purchase';
      const qty = Number(line.quantity || 0);
      return `<article class="cart-line" data-cart-line="${index}">
        <img src="${assetPath(line.image)}" alt="AvoKind Green Boost pouch">
        <div>
          <div class="cart-line-top"><h3>${line.product || 'Green Boost'}</h3><span class="cart-line-price">${money(Number(line.unitPrice||0) * qty)}</span></div>
          <p class="cart-line-meta">${line.size || 30} servings · ${plan}</p>
          <div class="cart-line-controls">
            <div class="cart-qty" aria-label="Quantity"><button type="button" data-cart-minus="${index}" aria-label="Decrease quantity">−</button><span>${qty}</span><button type="button" data-cart-plus="${index}" aria-label="Increase quantity">+</button></div>
            <button class="cart-remove" type="button" data-cart-remove="${index}">Remove</button>
          </div>
        </div>
      </article>`;
    }).join('');
    const subtotal = lines.reduce((sum,line)=>sum + Number(line.unitPrice||0)*Number(line.quantity||0),0);
    shell.querySelector('[data-cart-subtotal]').textContent = money(subtotal);
  };

  const open = () => {
    lastFocus = document.activeElement;
    render();
    shell.classList.add('is-open');
    shell.setAttribute('aria-hidden','false');
    document.body.classList.add('cart-open');
    shell.querySelector('[data-cart-close]').focus();
  };
  const close = () => {
    shell.classList.remove('is-open');
    shell.setAttribute('aria-hidden','true');
    document.body.classList.remove('cart-open');
    lastFocus?.focus?.();
  };

  buttons.forEach(button => button.addEventListener('click', open));
  shell.querySelector('[data-cart-overlay]').addEventListener('click', close);
  shell.querySelector('[data-cart-close]').addEventListener('click', close);
  shell.querySelector('[data-cart-continue]').addEventListener('click', (event) => { event.preventDefault(); close(); });
  shell.querySelector('[data-cart-checkout]').addEventListener('click', () => {
    // Commerce backend is intentionally not wired in this static build.
    shell.querySelector('[data-cart-checkout]').textContent = 'Checkout ready for integration';
    setTimeout(() => { shell.querySelector('[data-cart-checkout]').textContent = 'Checkout'; }, 1600);
  });
  shell.addEventListener('click', (event) => {
    const minus = event.target.closest('[data-cart-minus]');
    const plus = event.target.closest('[data-cart-plus]');
    const remove = event.target.closest('[data-cart-remove]');
    if (!minus && !plus && !remove) return;
    const idx = Number((minus || plus || remove).dataset.cartMinus ?? (minus || plus || remove).dataset.cartPlus ?? (minus || plus || remove).dataset.cartRemove);
    const lines = readLines();
    if (!lines[idx]) return;
    if (remove) lines.splice(idx,1);
    else if (minus) {
      lines[idx].quantity = Number(lines[idx].quantity || 1) - 1;
      if (lines[idx].quantity <= 0) lines.splice(idx,1);
    } else if (plus) lines[idx].quantity = Number(lines[idx].quantity || 0) + 1;
    writeLines(lines);
    render();
    window.dispatchEvent(new CustomEvent('avokind-cart-change'));
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && shell.classList.contains('is-open')) close(); });
  window.addEventListener('storage', render);
  window.addEventListener('avokind-cart-change', render);
  window.addEventListener('avokind-cart-open', open);

  // Migrate the old count-only prototype cart if needed.
  const existing = readLines();
  if (!existing.length) {
    const oldCount = Math.max(0, Number(localStorage.getItem(COUNT_KEY) || 0) || 0);
    if (oldCount) writeLines([{id:'green-boost-30-one-time',product:'Green Boost',size:30,plan:'one-time',quantity:oldCount,unitPrice:59.99,image:'./assets/gallery-product.jpg'}]);
  }
  render();
})();
