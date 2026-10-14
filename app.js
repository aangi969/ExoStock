/**
 * EXOSTOCK 2.0 • INTERACTIVE ENGINE
 * Apple & Vercel-inspired Minimalist Redesign for Exotic Infotech
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCurrencyAndPricing();
  initSimulator();
  initVideoChapters();
  initRoiCalculator();
  initIntegrationsFilter();
  initFaqAccordion();
  initModal();
  initMobileMenu();
});

/* ===================================================================
   1. THEME MANAGER (Light Theme by Default)
   =================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  // Enforce light theme as primary default
  let savedTheme = localStorage.getItem('exostock-theme-v2');
  if (!savedTheme) {
    savedTheme = 'light';
    localStorage.setItem('exostock-theme-v2', 'light');
    localStorage.removeItem('exostock-theme');
  }

  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme === 'dark' ? 'Dark Mode' : 'Light Editorial Mode'}`);
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('exostock-theme-v2', theme);
  const themeIcon = document.getElementById('themeIcon');
  if (themeIcon) {
    if (theme === 'dark') {
      themeIcon.innerHTML = `<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    } else {
      themeIcon.innerHTML = `<path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" stroke="currentColor" stroke-width="2" fill="none"/>`;
    }
  }
}

/* ===================================================================
   2. GLOBAL CURRENCY & PRICING PLANS ENGINE
   =================================================================== */
const PRICING_DATA = {
  USD: {
    symbol: '$',
    rates: { Trial: 0, Basic: 19, Standard: 49, Business: 99, Enterprise: 249 }
  },
  INR: {
    symbol: '₹',
    rates: { Trial: 0, Basic: 1499, Standard: 3899, Business: 7899, Enterprise: 19999 }
  },
  EUR: {
    symbol: '€',
    rates: { Trial: 0, Basic: 18, Standard: 45, Business: 89, Enterprise: 229 }
  },
  GBP: {
    symbol: '£',
    rates: { Trial: 0, Basic: 15, Standard: 39, Business: 79, Enterprise: 199 }
  },
  AED: {
    symbol: 'AED ',
    rates: { Trial: 0, Basic: 69, Standard: 179, Business: 359, Enterprise: 915 }
  }
};

let currentCurrency = 'USD';
let isAnnualBilling = true;

function initCurrencyAndPricing() {
  const currencySelect = document.getElementById('currencySelect');
  const monthlyBtn = document.getElementById('billingMonthlyBtn');
  const annualBtn = document.getElementById('billingAnnualBtn');

  if (currencySelect) {
    currencySelect.addEventListener('change', (e) => {
      currentCurrency = e.target.value;
      updatePricingDisplay();
      updateRoiCurrency();
      showToast(`Currency updated to ${currentCurrency}`);
    });
  }

  if (monthlyBtn && annualBtn) {
    monthlyBtn.addEventListener('click', () => {
      isAnnualBilling = false;
      monthlyBtn.classList.add('active');
      annualBtn.classList.remove('active');
      updatePricingDisplay();
    });

    annualBtn.addEventListener('click', () => {
      isAnnualBilling = true;
      annualBtn.classList.add('active');
      monthlyBtn.classList.remove('active');
      updatePricingDisplay();
    });
  }

  updatePricingDisplay();
}

function updatePricingDisplay() {
  const currencyInfo = PRICING_DATA[currentCurrency] || PRICING_DATA.USD;
  const planCards = document.querySelectorAll('.pricing-card');

  planCards.forEach(card => {
    const planKey = card.dataset.plan;
    const priceAmountEl = card.querySelector('.plan-amount');
    const priceCurrencyEl = card.querySelector('.plan-currency');
    const pricePeriodEl = card.querySelector('.plan-period');

    if (!priceAmountEl || !priceCurrencyEl) return;

    if (planKey === 'Custom') {
      priceCurrencyEl.textContent = '';
      priceAmountEl.textContent = 'Custom';
      if (pricePeriodEl) pricePeriodEl.textContent = 'tailored deployment';
      return;
    }

    const baseMonthlyPrice = currencyInfo.rates[planKey] || 0;
    let finalPrice = baseMonthlyPrice;

    if (isAnnualBilling && baseMonthlyPrice > 0) {
      // 20% discount on annual
      finalPrice = Math.round(baseMonthlyPrice * 0.8);
    }

    priceCurrencyEl.textContent = currencyInfo.symbol;
    priceAmountEl.textContent = finalPrice.toLocaleString();
    if (pricePeriodEl) {
      pricePeriodEl.textContent = isAnnualBilling ? '/month (billed annually)' : '/month';
    }
  });
}

/* ===================================================================
   3. INTERACTIVE ERP SIMULATOR (Live Telemetry & Actions)
   =================================================================== */
const INITIAL_INVENTORY = [
  { id: 1, sku: 'EXO-PROD-001', name: 'Industrial RFID Handheld Terminal', category: 'Electronics', stock: 142, threshold: 40, status: 'optimal' },
  { id: 2, sku: 'EXO-PROD-002', name: 'Bluetooth Thermal Receipt Printer', category: 'Electronics', stock: 24, threshold: 30, status: 'low' },
  { id: 3, sku: 'EXO-PROD-003', name: 'Barcode Scan Stand 2D Imager', category: 'Hardware', stock: 8, threshold: 25, status: 'critical' },
  { id: 4, sku: 'EXO-PROD-004', name: 'Heavy-Duty Warehouse Shipping Labels (Box)', category: 'Consumables', stock: 520, threshold: 100, status: 'optimal' },
  { id: 5, sku: 'EXO-PROD-005', name: 'Smart IoT Ambient Temp & Humidity Sensor', category: 'Hardware', stock: 18, threshold: 20, status: 'low' }
];

let activeInventory = [...INITIAL_INVENTORY];

function initSimulator() {
  const tabs = document.querySelectorAll('.sim-tab-btn');
  const panels = document.querySelectorAll('.simulator-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const targetPanel = document.getElementById(tab.dataset.target);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });

  renderInventoryTable();

  // Search input inside simulator
  const searchInput = document.getElementById('simSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      renderInventoryTable(q);
    });
  }

  // Simulator Invoicing Actions
  const generateInvoiceBtn = document.getElementById('simGenerateInvoiceBtn');
  if (generateInvoiceBtn) {
    generateInvoiceBtn.addEventListener('click', () => {
      showToast('⚡ Invoicing Engine: GST Invoice #INV-2026-894 generated and synchronized across cloud.');
    });
  }

  const sendWhatsAppBtn = document.getElementById('simWhatsAppBtn');
  if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener('click', () => {
      showToast('📲 Instant WhatsApp Dispatch sent with verified PDF receipt link.');
    });
  }

  // Stock Transfer Simulation
  const transferStockBtn = document.getElementById('simTransferStockBtn');
  if (transferStockBtn) {
    transferStockBtn.addEventListener('click', () => {
      showToast('🔄 Cross-Warehouse Transfer: 50 units moved from Mumbai Hub to London Gateway.');
    });
  }
}

function renderInventoryTable(query = '') {
  const tbody = document.getElementById('simInventoryTableBody');
  if (!tbody) return;

  const filtered = activeInventory.filter(item => 
    item.name.toLowerCase().includes(query) || 
    item.sku.toLowerCase().includes(query) ||
    item.category.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 28px; color: var(--text-muted);">No inventory items matching query.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(item => `
    <tr>
      <td>
        <div style="font-weight: 700;">${item.name}</div>
        <span class="sim-sku-code">${item.sku} • ${item.category}</span>
      </td>
      <td style="font-family: var(--font-mono); font-weight: 700;">${item.stock} units</td>
      <td>
        <span class="stock-tag ${item.status}">
          ${item.status === 'optimal' ? '● In Stock' : item.status === 'low' ? '▲ Low Stock' : '⚠️ Critical Depletion'}
        </span>
      </td>
      <td style="font-family: var(--font-mono); font-size: 11px; color: var(--text-muted);">${item.threshold} units</td>
      <td style="text-align: right;">
        <button class="sim-action-btn" onclick="restockItem(${item.id})">
          ${item.status === 'optimal' ? 'Adjust' : '+ Restock 50'}
        </button>
      </td>
    </tr>
  `).join('');
}

// Global window function for inline onclick in table
window.restockItem = function(id) {
  const target = activeInventory.find(item => item.id === id);
  if (target) {
    target.stock += 50;
    target.status = 'optimal';
    renderInventoryTable();
    showToast(`Restocked ${target.name} (+50 units). Status updated to Optimal.`);
  }
};

/* ===================================================================
   4. VIDEO CHAPTER NAVIGATION (Exotic Infotech Product Demo Video)
   =================================================================== */
function initVideoChapters() {
  const video = document.getElementById('exostockVideo');
  const chapterPills = document.querySelectorAll('.chapter-pill');

  if (!video || chapterPills.length === 0) return;

  chapterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      chapterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const timestamp = parseFloat(pill.dataset.time || '0');
      video.currentTime = timestamp;
      video.play().catch(() => {});
      showToast(`Jumped to: ${pill.textContent.trim()}`);
    });
  });

  // Track video time to highlight chapters
  video.addEventListener('timeupdate', () => {
    const cur = video.currentTime;
    chapterPills.forEach((pill, idx) => {
      const time = parseFloat(pill.dataset.time || '0');
      const nextPill = chapterPills[idx + 1];
      const nextTime = nextPill ? parseFloat(nextPill.dataset.time) : Infinity;

      if (cur >= time && cur < nextTime) {
        chapterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      }
    });
  });
}

/* ===================================================================
   5. INTERACTIVE ROI & TIME-SAVINGS CALCULATOR
   =================================================================== */
function initRoiCalculator() {
  const ordersSlider = document.getElementById('roiOrdersSlider');
  const warehousesSlider = document.getElementById('roiWarehousesSlider');
  const ordersValDisplay = document.getElementById('roiOrdersVal');
  const warehousesValDisplay = document.getElementById('roiWarehousesVal');

  if (!ordersSlider || !warehousesSlider) return;

  const recalculate = () => {
    const orders = parseInt(ordersSlider.value, 10);
    const warehouses = parseInt(warehousesSlider.value, 10);

    if (ordersValDisplay) ordersValDisplay.textContent = orders.toLocaleString() + ' orders/mo';
    if (warehousesValDisplay) warehousesValDisplay.textContent = warehouses + (warehouses === 1 ? ' Location' : ' Locations');

    // Formulas based on enterprise operational metrics
    const hoursSavedPerWeek = Math.round((orders * 0.0035) + (warehouses * 4.5));
    const hoursSavedPerMonth = hoursSavedPerWeek * 4;

    // Currency conversions
    const currencyInfo = PRICING_DATA[currentCurrency] || PRICING_DATA.USD;
    let baseStockoutProtectionUSD = Math.round((orders * 2.8) + (warehouses * 1800));
    let baseAnnualSavingsUSD = Math.round((hoursSavedPerMonth * 12 * 28) + (orders * 1.4));

    let multiplier = 1;
    if (currentCurrency === 'INR') multiplier = 83;
    else if (currentCurrency === 'EUR') multiplier = 0.92;
    else if (currentCurrency === 'GBP') multiplier = 0.79;
    else if (currentCurrency === 'AED') multiplier = 3.67;

    const stockoutProtected = Math.round(baseStockoutProtectionUSD * multiplier);
    const annualSavings = Math.round(baseAnnualSavingsUSD * multiplier);

    const hoursEl = document.getElementById('roiHoursSaved');
    const stockoutEl = document.getElementById('roiStockoutProtected');
    const annualEl = document.getElementById('roiAnnualSavings');

    if (hoursEl) hoursEl.textContent = hoursSavedPerMonth.toLocaleString() + ' hrs';
    if (stockoutEl) stockoutEl.textContent = currencyInfo.symbol + stockoutProtected.toLocaleString();
    if (annualEl) annualEl.textContent = currencyInfo.symbol + annualSavings.toLocaleString();
  };

  ordersSlider.addEventListener('input', recalculate);
  warehousesSlider.addEventListener('input', recalculate);

  recalculate();
}

function updateRoiCurrency() {
  const ordersSlider = document.getElementById('roiOrdersSlider');
  if (ordersSlider) {
    ordersSlider.dispatchEvent(new Event('input'));
  }
}

/* ===================================================================
   6. INTEGRATIONS ECOSYSTEM FILTER
   =================================================================== */
function initIntegrationsFilter() {
  const filterBtns = document.querySelectorAll('.integ-filter-btn');
  const cards = document.querySelectorAll('.integration-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const category = btn.dataset.filter;
      cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ===================================================================
   7. INTERACTIVE FAQ ACCORDION
   =================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ===================================================================
   8. SCHEDULE DEMO MODAL DIALOG
   =================================================================== */
function initModal() {
  const openModalBtns = document.querySelectorAll('.open-demo-modal-btn');
  const modalBackdrop = document.getElementById('demoModalBackdrop');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const demoForm = document.getElementById('demoBookingForm');

  if (!modalBackdrop) return;

  const openModal = () => {
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });

  if (demoForm) {
    demoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('modalEmailInput');
      const email = emailInput ? emailInput.value : '';

      const modalBody = document.getElementById('modalContentBody');
      if (modalBody) {
        modalBody.innerHTML = `
          <div style="text-align: center; padding: 24px 0;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--accent-emerald-subtle); color: var(--accent-emerald); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 style="font-size: 22px; font-weight: 800; margin-bottom: 8px;">Demo Confirmed!</h3>
            <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 24px;">An Exotic Infotech Enterprise Solutions Specialist has sent a calendar invite and sandbox credentials to <strong>${email || 'your email'}</strong>.</p>
            <button class="btn btn-primary" onclick="location.reload()">Back to ExoStock</button>
          </div>
        `;
      }
      showToast('🎉 Live Demo confirmed! Check your inbox for calendar credentials.');
    });
  }

  // Quick CTA bottom form
  const ctaBottomForm = document.getElementById('ctaQuickForm');
  if (ctaBottomForm) {
    ctaBottomForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('🚀 VIP Trial credentials dispatched. Our team will contact you within 2 hours!');
      ctaBottomForm.reset();
    });
  }
}

/* ===================================================================
   9. MOBILE HAMBURGER NAVIGATION
   =================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const navLinks = document.querySelector('.nav-links');

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    navLinks.classList.toggle('mobile-open');
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!toggleBtn.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('mobile-open');
    }
  });
}

/* ===================================================================
   10. MINIMALIST FLOATING TOAST SYSTEM
   =================================================================== */
function showToast(message) {
  let toast = document.getElementById('exostockToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'exostockToast';
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.backgroundColor = 'var(--accent-primary)';
    toast.style.color = 'var(--bg-canvas)';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = 'var(--radius-pill)';
    toast.style.fontSize = '13px';
    toast.style.fontWeight = '600';
    toast.style.boxShadow = 'var(--shadow-lg)';
    toast.style.zIndex = '9999';
    toast.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '8px';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.transform = 'translateY(100px)';
    toast.style.opacity = '0';
  }, 3500);
}
