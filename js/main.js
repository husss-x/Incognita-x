/* =============================================
   SOLAREX - Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------
     NAVBAR - Hamburger Menu
  ------------------------------------------ */
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  navToggle?.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    navToggle.classList.toggle('active');
  });

  // Close mobile menu on link click
  mobileMenu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  // Navbar shadow on scroll
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 10
      ? '0 4px 20px rgba(0,0,0,0.3)'
      : '0 2px 12px rgba(0,0,0,0.2)';
  });

  /* ------------------------------------------
     CALCULATOR - Range Sliders
  ------------------------------------------ */
  const billRange = document.getElementById('bill-range');
  const roofRange = document.getElementById('roof-range');
  const billVal   = document.getElementById('bill-val');
  const roofVal   = document.getElementById('roof-val');
  const savYear   = document.getElementById('sav-year');
  const savMonth  = document.getElementById('sav-month');
  const payback   = document.getElementById('payback');

  function updateCalc() {
    if (!billRange) return;
    const bill = parseInt(billRange.value);
    const roof = parseInt(roofRange.value);

    billVal.textContent = '€' + bill;
    roofVal.textContent = roof + ' mq';

    // Simplified estimation logic
    const kWp = Math.round(roof / 7);            // ~7mq per kWp
    const annualProd = kWp * 1100;               // kWh/anno (media Italia)
    const savedEnergy = Math.min(annualProd * 0.7, bill * 12 * 0.8); // 70% autoconsumata
    const savPerYear = Math.round(savedEnergy * 0.25);  // 0.25 €/kWh
    const installCost = kWp * 1500;              // ~1500 €/kWp
    const pb = Math.round(installCost / savPerYear);

    savYear.textContent  = '€' + savPerYear.toLocaleString('it-IT');
    savMonth.textContent = '€' + Math.round(savPerYear / 12).toLocaleString('it-IT');
    payback.textContent  = pb + ' anni';
  }

  billRange?.addEventListener('input', updateCalc);
  roofRange?.addEventListener('input', updateCalc);
  updateCalc();

  /* ------------------------------------------
     HERO FORM - Multi-Step
  ------------------------------------------ */
  const heroForm  = document.getElementById('hero-form');
  const steps     = heroForm ? heroForm.querySelectorAll('.form-step') : [];
  const nextBtns  = heroForm ? heroForm.querySelectorAll('.btn-next') : [];
  const submitBtn = document.getElementById('form-submit');
  const progressBar = document.getElementById('progress-bar');
  let currentStep = 0;

  function showStep(idx) {
    steps.forEach((s, i) => {
      s.style.display = i === idx ? 'block' : 'none';
    });
    if (progressBar) {
      const pct = Math.round(((idx) / (steps.length - 1)) * 100);
      progressBar.style.width = pct + '%';
    }
  }

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
      }
    });
  });

  if (steps.length) showStep(0);

  heroForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('✅ Richiesta inviata! Verrai contattato entro 24 ore.', 'success');
    heroForm.reset();
    currentStep = 0;
    if (steps.length) showStep(0);
  });

  /* ------------------------------------------
     COUNTER ANIMATION
  ------------------------------------------ */
  function animateCounter(el, target, suffix = '') {
    const duration = 1800;
    const start = performance.now();
    const startVal = 0;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      const current = Math.round(startVal + (target - startVal) * eased);
      el.textContent = current.toLocaleString('it-IT') + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = '1';
        const target = parseInt(entry.target.dataset.count);
        const suffix = entry.target.dataset.suffix || '';
        animateCounter(entry.target, target, suffix);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  /* ------------------------------------------
     SCROLL ANIMATIONS (fade-in)
  ------------------------------------------ */
  const fadeEls = document.querySelectorAll('.fade-in');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  fadeEls.forEach(el => fadeObserver.observe(el));

  /* ------------------------------------------
     SCROLL TO TOP BUTTON
  ------------------------------------------ */
  const scrollTopBtn = document.getElementById('scroll-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) scrollTopBtn?.classList.add('visible');
    else scrollTopBtn?.classList.remove('visible');
  });

  scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ------------------------------------------
     COOKIE BANNER
  ------------------------------------------ */
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieDecline = document.getElementById('cookie-decline');

  if (!localStorage.getItem('cookieConsent') && cookieBanner) {
    setTimeout(() => cookieBanner.classList.add('show'), 1200);
  }

  cookieAccept?.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    cookieBanner.classList.remove('show');
  });

  cookieDecline?.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'declined');
    cookieBanner.classList.remove('show');
  });

  /* ------------------------------------------
     TOAST NOTIFICATION
  ------------------------------------------ */
  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  /* ------------------------------------------
     REGION PILLS - Click to simulate navigation
  ------------------------------------------ */
  document.querySelectorAll('.region-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const region = pill.textContent.trim();
      showToast(`Stai esplorando offerte per: ${region}`, 'success');
    });
  });

  /* ------------------------------------------
     SMOOTH REVEAL on scroll
  ------------------------------------------ */
  const style = document.createElement('style');
  style.textContent = `
    .fade-in {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .fade-in.visible {
      opacity: 1;
      transform: translateY(0);
    }
    #progress-bar {
      transition: width 0.3s ease;
    }
  `;
  document.head.appendChild(style);

});
