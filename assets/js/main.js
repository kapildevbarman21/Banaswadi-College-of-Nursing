/**
 * Banaswadi College of Nursing - Main JavaScript
 * Interactive Features inspired by Kristu Jayanti University Portal
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initHeroCarousel();
  initStatsCounters();
  initProgramFilters();
  initGalleryFilters();
  initModals();
  initMobileDrawer();
  initScrollTop();
  initSearch();
  initInfiniteSlider();
});

/* ==========================================================================
   1. STICKY HEADER
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   2. HERO CAROUSEL
   ========================================================================== */
function initHeroCarousel() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');

  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval = null;
  const slideDuration = 6000;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function prevSlide() {
    let prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  function startAutoPlay() {
    stopAutoPlay();
    slideInterval = setInterval(nextSlide, slideDuration);
  }

  function stopAutoPlay() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      startAutoPlay();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      startAutoPlay();
    });
  }

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      showSlide(idx);
      startAutoPlay();
    });
  });

  const heroSection = document.querySelector('.hero-slider-section');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoPlay);
    heroSection.addEventListener('mouseleave', startAutoPlay);
  }

  startAutoPlay();
}

/* ==========================================================================
   3. ANIMATED NUMBER COUNTERS
   ========================================================================== */
function initStatsCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counters.forEach(counter => {
          const target = parseFloat(counter.getAttribute('data-target') || '0');
          const suffix = counter.getAttribute('data-suffix') || '';
          const isDecimal = counter.getAttribute('data-decimal') === 'true';
          const duration = 2000;
          const startTime = performance.now();

          function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            
            const currentVal = isDecimal 
              ? (easeProgress * target).toFixed(1)
              : Math.floor(easeProgress * target);

            counter.textContent = currentVal + suffix;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
            }
          }

          requestAnimationFrame(updateCounter);
        });
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-counter-section');
  if (statsSection) observer.observe(statsSection);
}

/* ==========================================================================
   4. PROGRAMS FILTER TABS
   ========================================================================== */
function initProgramFilters() {
  const filterBtns = document.querySelectorAll('.programs-filter-tabs .filter-btn');
  const cards = document.querySelectorAll('.program-card');

  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.classList.add('animate-fade-in');
        } else {
          card.style.display = 'none';
          card.classList.remove('animate-fade-in');
        }
      });
    });
  });
}

/* ==========================================================================
   5. GALLERY FILTERS & LIGHTBOX
   ========================================================================== */
function initGalleryFilters() {
  const tabs = document.querySelectorAll('.gallery-tab-btn');
  const items = document.querySelectorAll('.gallery-item');

  if (!tabs.length || !items.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      items.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.style.display = 'block';
          item.classList.add('animate-fade-in');
        } else {
          item.style.display = 'none';
          item.classList.remove('animate-fade-in');
        }
      });
    });
  });

  // Lightbox click
  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.querySelector('h4')?.textContent || 'Campus Facility';
      if (img) {
        openLightbox(img.src, title);
      }
    });
  });
}

function openLightbox(imgSrc, title) {
  let lightbox = document.getElementById('imageLightboxModal');
  if (!lightbox) {
    lightbox = document.createElement('div');
    lightbox.id = 'imageLightboxModal';
    lightbox.className = 'modal-backdrop';
    lightbox.innerHTML = `
      <div class="modal-content-card" style="max-width:850px; padding:1.5rem; text-align:center;">
        <button class="btn-close-modal" onclick="closeModal('imageLightboxModal')"><i class="fa-solid fa-xmark"></i></button>
        <img id="lightboxImg" src="" style="width:100%; max-height:70vh; object-fit:contain; border-radius:var(--radius-md); margin-bottom:1rem;">
        <h3 id="lightboxTitle" style="color:var(--primary-navy);"></h3>
      </div>
    `;
    document.body.appendChild(lightbox);
  }
  document.getElementById('lightboxImg').src = imgSrc;
  document.getElementById('lightboxTitle').textContent = title;
  lightbox.classList.add('open');
}

/* ==========================================================================
   6. MODALS MANAGEMENT
   ========================================================================== */
function initModals() {
  // Triggers for Admission Modal
  document.querySelectorAll('[data-open-modal="admissionModal"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('admissionModal');
    });
  });

  // Triggers for Callback Modal
  document.querySelectorAll('[data-open-modal="callbackModal"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('callbackModal');
    });
  });

  // Delegated trigger for dynamically added or cloned elements (e.g. InfiniteSlider cards)
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-open-modal]');
    if (trigger) {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-open-modal');
      openModal(modalId);
    }
  });

  // Close when clicking backdrop
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('open');
      }
    });
  });
}

window.openModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('open');
};

window.closeModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('open');
};

/* ==========================================================================
   7. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileDrawer() {
  const openBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const backdrop = document.querySelector('.mobile-drawer-backdrop');
  const closeBtn = document.querySelector('.mobile-drawer-close');

  if (!openBtn || !drawer || !backdrop) return;

  function openDrawer() {
    drawer.classList.add('open');
    backdrop.classList.add('open');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    backdrop.classList.remove('open');
  }

  openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  backdrop.addEventListener('click', closeDrawer);
}

/* ==========================================================================
   8. SCROLL TO TOP
   ========================================================================== */
function initScrollTop() {
  const scrollBtn = document.querySelector('.scroll-top-btn');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   9. QUICK SEARCH PORTAL
   ========================================================================== */
function initSearch() {
  const searchBtn = document.querySelector('.btn-search-trigger');
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('siteSearchInput');
  const searchResults = document.getElementById('searchResultsList');

  if (!searchBtn || !searchModal || !searchInput) return;

  const searchableIndex = [
    { title: 'B.Sc. Nursing (Basic 4 Years)', url: 'programs.html#bsc-nursing', cat: 'Academics' },
    { title: 'Post Basic B.Sc. Nursing (P.B.B.Sc)', url: 'programs.html#pbbsc-nursing', cat: 'Academics' },
    { title: 'M.Sc. Nursing (5 Specialties)', url: 'programs.html#msc-nursing', cat: 'Academics' },
    { title: 'GNM (General Nursing & Midwifery)', url: 'programs.html#gnm', cat: 'Diploma' },
    { title: 'Admissions 2027-28 & Eligibility', url: 'admissions.html', cat: 'Admissions' },
    { title: 'Clinical Training & Associated Hospitals', url: 'clinical-training.html', cat: 'Clinical' },
    { title: 'Simulation Labs & Infrastructure', url: 'campus-life.html#labs', cat: 'Campus Life' },
    { title: 'Hostels & Campus Accommodation', url: 'campus-life.html#hostels', cat: 'Facilities' },
    { title: 'Helinet Digital Medical Library', url: 'campus-life.html#library', cat: 'Library' },
    { title: 'Global Placements (NHS UK, USA, Gulf)', url: 'placements.html', cat: 'Careers' },
    { title: 'About Banaswadi College of Nursing', url: 'about.html', cat: 'Institutional' },
    { title: 'Contact Us & Campus Directions', url: 'contact.html', cat: 'Contact' }
  ];

  searchBtn.addEventListener('click', () => {
    openModal('searchModal');
    setTimeout(() => searchInput.focus(), 150);
  });

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    if (!query) {
      searchResults.innerHTML = '<p style="color:var(--text-light); text-align:center; padding:1.5rem;">Start typing to search courses, admissions, facilities...</p>';
      return;
    }

    const matches = searchableIndex.filter(item => 
      item.title.toLowerCase().includes(query) || item.cat.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      searchResults.innerHTML = `<p style="color:var(--text-light); text-align:center; padding:1.5rem;">No results found for "<strong>${escapeHtml(query)}</strong>".</p>`;
    } else {
      searchResults.innerHTML = matches.map(m => `
        <a href="${m.url}" style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1rem; border-bottom:1px solid var(--border-light); border-radius:var(--radius-sm); transition:background 0.2s;" onmouseover="this.style.background='var(--bg-slate)'" onmouseout="this.style.background='transparent'">
          <span style="font-weight:600; color:var(--primary-navy);">${m.title}</span>
          <span style="font-size:0.75rem; background:var(--med-green-light); color:var(--med-green); padding:0.2rem 0.6rem; border-radius:var(--radius-full); font-weight:700;">${m.cat}</span>
        </a>
      `).join('');
    }
  });
}

function escapeHtml(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// Toast Notification
window.showToast = function(msg) {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>${msg}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
};

/* ==========================================================================
   INFINITE SLIDER WITH SPEED-ON-HOVER (speedOnHover={20}, gap={24})
   ========================================================================== */
function initInfiniteSlider() {
  const slider = document.querySelector('.infinite-slider');
  const track = document.querySelector('.infinite-slider-track');
  if (!slider || !track) return;

  const originalCards = Array.from(track.children);
  if (originalCards.length === 0) return;

  // Clone 2 extra sets to ensure continuous seamless wrap
  const set1 = originalCards.map(c => c.cloneNode(true));
  const set2 = originalCards.map(c => c.cloneNode(true));
  set1.forEach(c => track.appendChild(c));
  set2.forEach(c => track.appendChild(c));

  // Speeds in px/sec: default ~45px/s; hover ~15px/s (speedOnHover=20)
  const defaultSpeed = parseFloat(slider.dataset.speed || '45');
  const hoverSpeed = parseFloat(slider.dataset.speedHover || '15');

  let currentTranslateX = 0;
  let targetVelocity = defaultSpeed / 60;
  let currentVelocity = targetVelocity;
  let isHovered = false;
  let isTouching = false;
  let lastTimestamp = performance.now();

  function getSetWidth() {
    let w = 0;
    const gap = parseFloat(window.getComputedStyle(track).gap) || 24;
    for (let i = 0; i < originalCards.length; i++) {
      w += track.children[i].getBoundingClientRect().width + gap;
    }
    return w;
  }

  let oneSetWidth = getSetWidth();
  window.addEventListener('resize', () => {
    oneSetWidth = getSetWidth();
  });

  slider.addEventListener('mouseenter', () => {
    isHovered = true;
    targetVelocity = hoverSpeed / 60;
  });

  slider.addEventListener('mouseleave', () => {
    isHovered = false;
    targetVelocity = defaultSpeed / 60;
  });

  slider.addEventListener('touchstart', () => {
    isTouching = true;
    targetVelocity = 0;
  }, { passive: true });

  slider.addEventListener('touchend', () => {
    isTouching = false;
    targetVelocity = defaultSpeed / 60;
  }, { passive: true });

  function render(now) {
    const delta = Math.min((now - lastTimestamp) / 1000 * 60, 2);
    lastTimestamp = now;

    // Smooth inertia interpolation
    currentVelocity += (targetVelocity - currentVelocity) * 0.1;

    currentTranslateX -= currentVelocity * delta;

    if (oneSetWidth > 0 && Math.abs(currentTranslateX) >= oneSetWidth) {
      currentTranslateX += oneSetWidth;
    }

    track.style.transform = `translate3d(${currentTranslateX}px, 0, 0)`;
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}
