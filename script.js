(function(){
  const $ = s=>document.querySelector(s);
  const $$ = s=>Array.from(document.querySelectorAll(s));
  const q = $('#q'); const region=$('#region'); const hotel=$('#hotel');
  const purpose=$('#purpose'); const dog=$('#dog'); const reset=$('#reset');
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
      const okRegion = !reg || card.dataset.city === reg;
      const okPurpose = !pur || tags.includes(pur);
      const okDog = !wantDog || tags.includes('dog');
      const selectedHotel = hotel.value;
      const okHotel = !selectedHotel || card.querySelector('h3').textContent.trim() === selectedHotel;
      const show = okTerm && okRegion && okPurpose && okDog && okHotel;

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
    hotel.addEventListener(ev,applyFilters);
    purpose.addEventListener(ev,applyFilters);
    dog.addEventListener(ev,applyFilters);
  });
  reset.addEventListener('click',()=>{q.value='';region.value='';hotel.value=''; purpose.value='';dog.checked=false;applyFilters();});
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

// --- HERO SEARCH: search by hotel name OR city name ---
const heroSearch = document.getElementById('heroSearch');
const heroBtn = document.getElementById('heroSearchBtn');
const mainSearch = document.getElementById('q');
const allHotels = document.getElementById('all-hotels');

if (heroSearch && heroBtn && mainSearch && allHotels) {
  function applyHeroSearch() {
    const term = heroSearch.value.trim().toLowerCase();
    mainSearch.value = term;
    // Trigger your existing filter logic
    mainSearch.dispatchEvent(new Event('input'));
    // Scroll smoothly to the results section
    document.querySelector('#controls').scrollIntoView({ behavior: 'smooth' });
  }

  heroBtn.addEventListener('click', applyHeroSearch);
  heroSearch.addEventListener('keypress', e => {
    if (e.key === 'Enter') applyHeroSearch();
  });
}

// --- Header "Browse Hotels" button scrolls & highlights hero search ---
const browseHotelsBtn = document.getElementById('browseHotelsBtn');
const herosearch = document.getElementById('heroSearch');

if (browseHotelsBtn && heroSearch) {
  browseHotelsBtn.addEventListener('click', (e) => {
    e.preventDefault();

    heroSearch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      heroSearch.focus();
      heroSearch.classList.add('glow');        // ✨ add glow
      setTimeout(() => heroSearch.classList.remove('glow'), 1200); // remove after animation
    }, 600);
  });
}


