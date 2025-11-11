(function(){
  const $ = s=>document.querySelector(s);
  const $$ = s=>Array.from(document.querySelectorAll(s));
  const q = $('#q'); const region=$('#region'); const purpose=$('#purpose'); const dog=$('#dog'); const reset=$('#reset');
  const cards = $$('.card');

  function applyFilters(){
    const term = q.value.trim().toLowerCase();
    const reg = region.value; const pur = purpose.value; const wantDog = dog.checked;
    let visible = 0;
    cards.forEach(card=>{
      const name = card.dataset.name.toLowerCase();
      const city = card.dataset.city.toLowerCase();
      const tags = card.dataset.tags.split(',');
      const okTerm = !term || name.includes(term) || city.includes(term);
      const okRegion = !reg || card.dataset.region===reg;
      const okPurpose = !pur || tags.includes(pur);
      const okDog = !wantDog || tags.includes('dog');
      const show = okTerm && okRegion && okPurpose && okDog;
      card.style.display = show ? '' : 'none';
      if(show) visible++;
    });
    document.getElementById('all-hotels').setAttribute('aria-busy','false');
    if(visible===0){
      if(!document.getElementById('emptyState')){
        const div=document.createElement('div');
        div.id='emptyState';
        div.style.gridColumn='span 12';
        div.style.padding='24px';
        div.style.border='1px dashed var(--muted)';
        div.style.borderRadius='12px';
        div.innerHTML='<strong>No matches.</strong> Try clearing filters.';
        document.getElementById('all-hotels').appendChild(div);
      }
    } else {
      const es=document.getElementById('emptyState'); if(es) es.remove();
    }
  }

  ['input','change'].forEach(ev=>{
    q.addEventListener(ev,applyFilters);
    region.addEventListener(ev,applyFilters);
    purpose.addEventListener(ev,applyFilters);
    dog.addEventListener(ev,applyFilters);
  });
  reset.addEventListener('click',()=>{q.value='';region.value='';purpose.value='';dog.checked=false;applyFilters();});
  applyFilters();
})();
// --- Auto-add "View on Google Maps" links to all map previews ---
document.querySelectorAll('.card').forEach(card => {
  const city = card.dataset.city || '';
  const name = card.querySelector('h3')?.textContent.trim() || '';
  const mapDiv = card.querySelector('.map-preview');

  // Only add if .map-preview exists and no existing link
  if (mapDiv && !mapDiv.querySelector('.map-link')) {
    const a = document.createElement('a');
    a.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + city)}`;
    a.target = '_blank';
    a.rel = 'noopener';
    a.className = 'map-link';
    a.textContent = 'View on Google Maps →';
    mapDiv.appendChild(a);
  }
});
