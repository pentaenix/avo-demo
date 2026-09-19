(() => {
  const input=document.querySelector('[data-blog-search]');
  const cards=[...document.querySelectorAll('[data-blog-card]')];
  const count=document.querySelector('[data-blog-count]');
  const empty=document.querySelector('[data-blog-empty]');
  if(!input||!cards.length)return;
  const normalize=s=>(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const run=()=>{const q=normalize(input.value).trim();let shown=0;cards.forEach(card=>{const hay=normalize(`${card.dataset.search||''} ${card.textContent}`);const visible=!q||q.split(/\s+/).every(term=>hay.includes(term));card.hidden=!visible;if(visible)shown+=1;});if(count)count.textContent=String(shown);empty?.classList.toggle('is-visible',shown===0);};
  input.addEventListener('input',run);run();
})();
