/**
 * NV CENTAR - IMPECCABLE LIGHT ARCHITECTURAL JAVASCRIPT
 * Bojan Kiklić s.p. Banja Luka | 065 779 380 | JIB: 4511926210008
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 1. Dynamic Business Hours Indicator
  initBusinessHours();

  // 2. Material Catalog Filters & Search
  initCatalogFilters();

  // 3. Interactive Material Quick Calculator (Fasada, Knauf, Građa)
  initMaterialCalculator();

  // 4. Interactive Google Map
  initMap();

  // 5. Mobile Navigation Toggle
  initMobileNav();

  // 6. Copy to Clipboard Utility
  initClipboardButtons();
});

/* ==========================================================================
   1. BUSINESS HOURS INDICATOR (LIGHT THEME)
   Pon - Sub: 07:00 - 17:00 | Nedelja: Zatvoreno
   ========================================================================== */
function initBusinessHours() {
  const badgeEl = document.getElementById('working-hours-badge');
  if (!badgeEl) return;

  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTime = hour + minute / 60;

  let isOpen = false;
  let statusText = '';
  let statusClass = '';

  if (day >= 1 && day <= 6) {
    // Monday to Saturday
    if (currentTime >= 7 && currentTime < 17) {
      isOpen = true;
      statusText = 'OTVORENO • DO 17:00';
      statusClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
    } else if (currentTime < 7) {
      statusText = 'ZATVORENO • OTVARA U 07:00';
      statusClass = 'bg-amber-50 text-amber-800 border-amber-300';
    } else {
      statusText = day === 6 ? 'ZATVORENO • OTVARA U PON 07:00' : 'ZATVORENO • OTVARA U 07:00';
      statusClass = 'bg-slate-100 text-slate-700 border-slate-300';
    }
  } else {
    // Sunday
    statusText = 'NEDELJA • ZATVORENO (HITAN VIBER)';
    statusClass = 'bg-amber-50 text-amber-800 border-amber-300';
  }

  badgeEl.className = `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono-tech font-bold uppercase border ${statusClass}`;
  badgeEl.innerHTML = `<span class="w-2 h-2 rounded-full ${isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}"></span> ${statusText}`;
}

/* ==========================================================================
   2. MATERIAL CATALOG FILTERS & SEARCH (LIGHT THEME)
   ========================================================================== */
function initCatalogFilters() {
  const filterBtns = document.querySelectorAll('.catalog-filter-btn');
  const cards = document.querySelectorAll('.catalog-card');
  const searchInput = document.getElementById('catalog-search');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-amber-500', 'text-white', 'border-amber-500', 'shadow-sm');
        b.classList.add('bg-white', 'text-slate-700', 'border-slate-200');
      });
      btn.classList.add('bg-amber-500', 'text-white', 'border-amber-500', 'shadow-sm');
      btn.classList.remove('bg-white', 'text-slate-700', 'border-slate-200');

      const filterCategory = btn.getAttribute('data-category');
      filterCards(filterCategory, searchInput ? searchInput.value.toLowerCase().trim() : '');
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const activeFilter = document.querySelector('.catalog-filter-btn.bg-amber-500')?.getAttribute('data-category') || 'all';
      filterCards(activeFilter, e.target.value.toLowerCase().trim());
    });
  }

  function filterCards(category, query) {
    let visibleCount = 0;
    cards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const cardText = card.textContent.toLowerCase();

      const matchesCategory = (category === 'all' || cardCategory === category);
      const matchesSearch = (!query || cardText.includes(query));

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    const noResults = document.getElementById('no-catalog-results');
    if (noResults) {
      noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  // Pre-fill form when clicking "Zatražite cijenu sa dostavom →"
  const requestQuoteBtns = document.querySelectorAll('.quote-action-btn');
  requestQuoteBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const categoryName = btn.getAttribute('data-category-name') || 'Građevinski materijal';
      const msg = `Pozdrav NV Centar, zanimaju me cijene i dostupnost za: ${categoryName}. Molim vas više informacija.`;
      const viberUrl = `viber://chat?number=%2B38765779380&draft=${encodeURIComponent(msg)}`;
      const fallbackUrl = `https://viber.click/38765779380`;
      showToast(`Otvaram Viber upit za "${categoryName}"...`, 'info');
      window.open(viberUrl, '_blank') || window.open(fallbackUrl, '_blank');
    });
  });
}

/* ==========================================================================
   3. MATERIAL QUICK ESTIMATOR (LIGHT THEME)
   ========================================================================== */
function initMaterialCalculator() {
  const calcTabs = document.querySelectorAll('.calc-tab-btn');
  const calcPanels = document.querySelectorAll('.calc-panel');

  calcTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      calcTabs.forEach(t => {
        t.classList.remove('bg-amber-500', 'text-white', 'border-amber-500', 'shadow-sm');
        t.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
      });
      tab.classList.add('bg-amber-500', 'text-white', 'border-amber-500', 'shadow-sm');
      tab.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');

      const target = tab.getAttribute('data-tab');
      calcPanels.forEach(p => {
        p.classList.toggle('hidden', p.getAttribute('id') !== `calc-${target}`);
      });
    });
  });

  // 1. Fasada Calculator
  const fasadaAreaInput = document.getElementById('calc-fasada-area');
  const fasadaThickSelect = document.getElementById('calc-fasada-thick');

  function calculateFasada() {
    if (!fasadaAreaInput) return;
    const m2 = parseFloat(fasadaAreaInput.value) || 0;
    const thick = fasadaThickSelect ? fasadaThickSelect.value : '10cm';

    if (m2 > 0) {
      const ljepiloKg = Math.round(m2 * 8.5); // 8-9kg per m2 (lijepljenje + armiranje)
      const ljepiloVrece = Math.ceil(ljepiloKg / 25);
      const mrezicaM2 = Math.ceil(m2 * 1.15); // +15% preklop
      const tipleKom = Math.ceil(m2 * 6); // 6 tipli po m2
      const zavrsniMalterVrece = Math.ceil((m2 * 2.8) / 25);

      document.getElementById('res-fasada-stiropor').textContent = `${m2} m² (${thick})`;
      document.getElementById('res-fasada-ljepilo').textContent = `${ljepiloVrece} vreća (${ljepiloKg} kg)`;
      document.getElementById('res-fasada-mrezica').textContent = `${mrezicaM2} m² (160g)`;
      document.getElementById('res-fasada-tiple').textContent = `${tipleKom} komada`;
      document.getElementById('res-fasada-malter').textContent = `${zavrsniMalterVrece} kanti/vreća`;
    }
  }

  if (fasadaAreaInput) {
    fasadaAreaInput.addEventListener('input', calculateFasada);
    if (fasadaThickSelect) fasadaThickSelect.addEventListener('change', calculateFasada);
    calculateFasada();
  }

  // 2. Knauf Calculator
  const knaufAreaInput = document.getElementById('calc-knauf-area');
  const knaufTypeSelect = document.getElementById('calc-knauf-type');

  function calculateKnauf() {
    if (!knaufAreaInput) return;
    const m2 = parseFloat(knaufAreaInput.value) || 0;
    if (m2 > 0) {
      const ploceKom = Math.ceil(m2 / 2.4);
      const profiliM = Math.ceil(m2 * 2.8);
      const vijciKom = Math.ceil(m2 * 22);
      const ispunafullKg = Math.ceil(m2 * 0.4);

      document.getElementById('res-knauf-ploce').textContent = `${ploceKom} ploča (12.5mm)`;
      document.getElementById('res-knauf-profili').textContent = `${profiliM} dužnih metara`;
      document.getElementById('res-knauf-vijci').textContent = `${vijciKom} komada TN 25`;
      document.getElementById('res-knauf-ispuna').textContent = `${ispunafullKg} kg Fugenfüllera`;
    }
  }

  if (knaufAreaInput) {
    knaufAreaInput.addEventListener('input', calculateKnauf);
    if (knaufTypeSelect) knaufTypeSelect.addEventListener('change', calculateKnauf);
    calculateKnauf();
  }

  // 3. Građa Calculator
  const lumberM3Input = document.getElementById('calc-lumber-m3');
  const lumberTypeSelect = document.getElementById('calc-lumber-type');

  function calculateLumber() {
    if (!lumberM3Input) return;
    const m3 = parseFloat(lumberM3Input.value) || 0;
    if (m3 > 0) {
      const weightKg = Math.round(m3 * 650);
      const daskaM2 = Math.round(m3 / 0.024);
      document.getElementById('res-lumber-weight').textContent = `cca ${weightKg} kg`;
      document.getElementById('res-lumber-daska').textContent = `cca ${daskaM2} m² daske (24mm)`;
    }
  }

  if (lumberM3Input) {
    lumberM3Input.addEventListener('input', calculateLumber);
    if (lumberTypeSelect) lumberTypeSelect.addEventListener('change', calculateLumber);
    calculateLumber();
  }

  // Export calculation to Viber
  const transferCalcBtn = document.querySelectorAll('.transfer-calc-btn');
  transferCalcBtn.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeTab = document.querySelector('.calc-tab-btn.bg-amber-500')?.getAttribute('data-tab') || 'fasada';
      let calcSummary = '';

      if (activeTab === 'fasada') {
        const m2 = fasadaAreaInput ? fasadaAreaInput.value : '120';
        const thick = fasadaThickSelect ? fasadaThickSelect.value : '10cm';
        calcSummary = `Pozdrav NV Centar, trebam ponudu za fasadu (${m2}m², ${thick}):\n- Fasadni stiropor: ${m2} m²\n- Ljepilo: ${document.getElementById('res-fasada-ljepilo')?.textContent}\n- Mrežica 160g: ${document.getElementById('res-fasada-mrezica')?.textContent}\n- Završni malter: ${document.getElementById('res-fasada-malter')?.textContent}\nMolim cijenu sa dostavom kamionom na gradilište.`;
      } else if (activeTab === 'knauf') {
        const m2 = knaufAreaInput ? knaufAreaInput.value : '50';
        calcSummary = `Pozdrav NV Centar, trebam ponudu za suhu gradnju (${m2}m²):\n- Gips ploče: ${document.getElementById('res-knauf-ploce')?.textContent}\n- Profili CD/UD: ${document.getElementById('res-knauf-profili')?.textContent}\n- Vijci: ${document.getElementById('res-knauf-vijci')?.textContent}\nMolim cijenu sa dostavom.`;
      } else {
        const m3 = lumberM3Input ? lumberM3Input.value : '4.5';
        calcSummary = `Pozdrav NV Centar, trebam ponudu za rezanu građu:\n- Količina: ${m3} m³\n- Procijenjena težina: ${document.getElementById('res-lumber-weight')?.textContent}\nMolim cijenu sa dostavom i istovarom kranom.`;
      }

      const viberUrl = `viber://chat?number=%2B38765779380&draft=${encodeURIComponent(calcSummary)}`;
      const fallbackUrl = `https://viber.click/38765779380`;
      
      showToast('Otvaram Viber sa vašim proračunom...', 'success');
      window.open(viberUrl, '_blank') || window.open(fallbackUrl, '_blank');
    });
  });
}

/* ==========================================================================
   4. INTERACTIVE GOOGLE MAP
   NV Centar, Branka Popovića bb, 78000 Banja Luka
   Loaded via secure responsive iframe pointing directly to NV Centar Banja Luka
   ========================================================================== */
function initMap() {
  // Google Map is embedded as a performant, API-key-free iframe in index.html
  // pointing to NV Centar, Branka Popovića bb, Banja Luka.
}

/* ==========================================================================
   7. MOBILE NAVIGATION TOGGLE
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-nav-drawer');
  const closeBtn = document.getElementById('mobile-menu-close');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  if (closeBtn && mobileMenu) {
    closeBtn.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu) mobileMenu.classList.add('hidden');
    });
  });
}

/* ==========================================================================
   8. CLIPBOARD COPY UTILITIES & TOASTS (LIGHT THEME)
   ========================================================================== */
function initClipboardButtons() {
  const copyButtons = document.querySelectorAll('[data-copy-text]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy-text');
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        showToast(`Kopirano u međumemoriju: ${text}`, 'success');
      }).catch(() => {
        showToast('Kopiranje nije uspjelo.', 'warning');
      });
    });
  });
}

function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  let borderColor = '#B00615';

  if (type === 'success') {
    borderColor = '#10B981';
  } else if (type === 'warning') {
    borderColor = '#DC2626';
  }

  toast.className = 'toast-msg flex items-center gap-3 bg-white text-slate-900 px-4 py-3 rounded-xl border shadow-2xl max-w-md font-sans text-xs font-semibold';
  toast.style.borderColor = borderColor;
  toast.style.boxShadow = '0 10px 30px -5px rgba(15, 23, 42, 0.15)';
  toast.innerHTML = `
    <span style="color:${borderColor}; font-weight:bold; font-size:14px;">●</span>
    <span class="flex-1">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
