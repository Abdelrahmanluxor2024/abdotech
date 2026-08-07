/* ==========================================================================
   THE ROYAL SHOWCASE GALLERY - JAVASCRIPT
   Implements Language Switcher, Video Modals, Lightbox, Share, and Scroll Effects
   ========================================================================== */

// --------------------------------------------------------------------------
// 1. Translation System Data
// --------------------------------------------------------------------------
const translations = {
  en: {
    "logo": "Shrouk Gallery",
    "nav-home": "Home",
    "nav-journey": "Journey",
    "nav-gallery": "Gallery",
    "hero-title": "Watch My Journey",
    "hero-subtitle": "Class of 2026 • Executive Graduation Portfolio",
    "scroll-text": "Discover Gallery",
    "journey-header": "A Royal Milestone",
    "journey-p1": "Stepping into a future forged with dedication, brilliance, and royal standards. This showcase commemorates a journey of academic excellence, capturing moments that represent the pinnacle of achievement and transition into leadership.",
    "journey-p2": "Every portrait tells a story of late nights, deep focus, and final triumph. Walk through the gallery below to share these moments of pride and elegance.",
    "gallery-header": "The Royal Portfolio",
    "gallery-subtitle": "A collection of moments captured in high definition",
    "cat-portrait": "Portrait",
    "cat-moment": "Moment",
    "cat-candid": "Candid",
    "btn-share-moment": "Share Moment",
    "btn-stack-view": "Royal Stack View",
    "btn-grid-view": "Grid View",
    "btn-view-all": "View All Images",
    "btn-view-less": "Show Less",
    "footer-copyright": "© 2026 Shrouk Gallery. Crafted with Excellence.",
    "share-title": "Share the Moment",
    "share-desc": "Select a platform to share this royal graduation gallery.",
    "share-copy-btn": "Copy Link",
    "toast-copied": "Link copied to clipboard!",
    
    // Pictures (Sorted by Group)
    "pic-1-title": "The Sovereign Smile",
    "pic-2-title": "Reflective Triumph",
    "pic-3-title": "Academic Honor",
    "pic-4-title": "Golden Horizon",
    "pic-5-title": "Prestigious Stature",
    "pic-6-title": "Elegance Unveiled",
    "pic-7-title": "The Royal Portrait I",
    "pic-8-title": "The Royal Portrait II",
    "pic-9-title": "The Royal Portrait III",
    "pic-10-title": "The Royal Portrait IV",
    "pic-11-title": "The Royal Portrait V",
    "pic-12-title": "The Royal Portrait VI",
    "pic-13-title": "The Royal Portrait VII",
    "pic-14-title": "Shared Joy",
    "pic-15-title": "A Mother's Pride",
    "pic-16-title": "Cherished Bond",
    "pic-17-title": "The Crown of Success",
    "pic-18-title": "Gaze of Pride",
    "pic-19-title": "Empowered Vision",
    "pic-20-title": "The Graduation Banquet",
    "pic-21-title": "Imperial Milestone",
    "pic-22-title": "Scholarly Legacy",
    "pic-23-title": "The Royal Seat",
    "pic-24-title": "The Grand Portrait"
  },
  ar: {
    "logo": "معرض شروق",
    "nav-home": "الرئيسية",
    "nav-journey": "مسيرتي",
    "nav-gallery": "المعرض",
    "hero-title": "شاهد رحلتي",
    "hero-subtitle": "دفعة 2026 • معرض التخرج التنفيذي",
    "scroll-text": "اكتشف المعرض",
    "journey-header": "مرحلة ملكية فارقة",
    "journey-p1": "خطوات واثقة نحو مستقبل مصاغ بالتفاني، والتميز، والمعايير الملكية. يوثق هذا المعرض مسيرة حافلة بالنجاح الأكاديمي، مجسداً ذروة الإنجازات والتحول نحو القيادة والتميز التنفيذي.",
    "journey-p2": "كل صورة تروي فصلاً من فصول العمل الجاد، والتركيز العميق، والانتصار النهائي. ندعوكم لتصفح المعرض ومشاركتنا هذه اللحظات الاستثنائية المفعمة بالفخر والأناقة.",
    "gallery-header": "معرض شروق",
    "gallery-subtitle": "مجموعة من اللحظات الخالدة الموثقة بدقة متناهية وبراعة فنية",
    "cat-portrait": "بورتريه",
    "cat-moment": "لحظة تاريخية",
    "cat-candid": "لقطة عفوية",
    "btn-share-moment": "مشاركة اللحظة",
    "btn-stack-view": "عرض التوضيب الملكي",
    "btn-grid-view": "عرض الشبكة",
    "btn-view-all": "شاهد جميع الصور",
    "btn-view-less": "عرض أقل",
    "footer-copyright": "© 2026 معرض شروق. صُمم بامتياز وفخامة.",
    "share-title": "شارك هذه اللحظة",
    "share-desc": "اختر المنصة المناسبة لمشاركة هذا المعرض الملكي للتخرج مع عائلتك وأصدقائك.",
    "share-copy-btn": "نسخ الرابط",
    "toast-copied": "تم نسخ رابط المعرض إلى الحافظة بنجاح!",
    
    // Pictures (Sorted by Group)
    "pic-1-title": "الابتسامة السيادية",
    "pic-2-title": "تأمل الانتصار",
    "pic-3-title": "وسام الأكاديمية",
    "pic-4-title": "الأفق الذهبي",
    "pic-5-title": "الهيبة والوقار",
    "pic-6-title": "الأناقة الملكية",
    "pic-7-title": "البورتريه الملكي الأول",
    "pic-8-title": "البورتريه الملكي الثاني",
    "pic-9-title": "البورتريه الملكي الثالث",
    "pic-10-title": "البورتريه الملكي الرابع",
    "pic-11-title": "البورتريه الملكي الخامس",
    "pic-12-title": "البورتريه الملكي السادس",
    "pic-13-title": "البورتريه الملكي السابع",
    "pic-14-title": "فرحة مشتركة مع الأم",
    "pic-15-title": "فخر الأمومة",
    "pic-16-title": "رابطة لا تنفصم",
    "pic-17-title": "تاج النجاح والتفوق",
    "pic-18-title": "نظرة الفخر الطموحة",
    "pic-19-title": "الرؤية الممكنة",
    "pic-20-title": "مأدبة التخرج العائلية",
    "pic-21-title": "الحدث الإمبراطوري",
    "pic-22-title": "الإرث العلمي",
    "pic-23-title": "المقعد الملكي",
    "pic-24-title": "البورتريه الكبير"
  }
};

let currentLang = 'en';

// --------------------------------------------------------------------------
// 2. DOM Elements Selection
// --------------------------------------------------------------------------
const langSwitchBtn = document.getElementById('lang-switch-btn');
const langText = langSwitchBtn.querySelector('.lang-text');
const header = document.querySelector('.royal-header');
const navLinks = document.querySelectorAll('.nav-link');
const backgroundVideo = document.getElementById('hero-bg-video');
const bgMusic = document.getElementById('bg-music');
const musicToggleBtn = document.getElementById('music-toggle-btn');
const splashOverlay = document.getElementById('splash-overlay');
const enterBtn = document.getElementById('enter-btn');

// Modals
const videoModal = document.getElementById('video-modal');
const lightboxModal = document.getElementById('lightbox-modal');
const shareModal = document.getElementById('share-modal');

// Modal Trigger Buttons
const openVideoBtn = document.getElementById('open-video-btn');
const headerShareBtn = document.getElementById('header-share-btn');
const mobileShareBtn = document.getElementById('mobile-share-btn');

// Modal Close Buttons
const closeVideoModalBtn = document.getElementById('close-video-modal');
const closeLightboxBtn = document.getElementById('close-lightbox-btn');
const closeShareModalBtn = document.getElementById('close-share-modal');

// Lightbox Navigation
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCategory = document.getElementById('lightbox-category');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxPrev = document.getElementById('lightbox-prev');
const lightboxNext = document.getElementById('lightbox-next');

// Share sheet buttons
const shareWhatsappBtn = document.getElementById('share-whatsapp');
const shareXBtn = document.getElementById('share-x');
const shareFacebookBtn = document.getElementById('share-facebook');
const shareCopyBtn = document.getElementById('share-copy');
const copyToast = document.getElementById('copy-toast');

// Gallery Items
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
let activeGalleryIndex = 0;

// --------------------------------------------------------------------------
// 3. Language & Translation Logic
// --------------------------------------------------------------------------
function setLanguage(lang) {
  currentLang = lang;
  
  // Update document language and direction
  if (lang === 'ar') {
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
    document.body.classList.add('rtl-mode');
    langText.textContent = 'English';
  } else {
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    document.body.classList.remove('rtl-mode');
    langText.textContent = 'العربية';
  }

  // Update DOM Elements that have data-key attributes
  const translatableElements = document.querySelectorAll('[data-key]');
  translatableElements.forEach(el => {
    const key = el.getAttribute('data-key');
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  // Re-sync active lightbox caption if it is currently open
  if (lightboxModal.classList.contains('active')) {
    updateLightboxContent(activeGalleryIndex);
  }
}

langSwitchBtn.addEventListener('click', () => {
  const newLang = currentLang === 'en' ? 'ar' : 'en';
  setLanguage(newLang);
});

// Initialize with default (or saved preference)
setLanguage(currentLang);

// --------------------------------------------------------------------------
// 4. Scroll & Viewport Effects
// --------------------------------------------------------------------------
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }

  // Highlight active link in navigation on scroll
  let currentActive = 'hero';
  const sections = ['hero', 'journey', 'gallery'];
  
  sections.forEach(secId => {
    const sec = document.getElementById(secId);
    if (sec) {
      const top = sec.offsetTop - 120;
      const bottom = top + sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        currentActive = secId;
      }
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentActive}`) {
      link.classList.add('active');
    }
  });
});

// Lazy load & entrance animations for gallery items (Fade up as user scrolls)
const revealOnScrollObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
});

galleryItems.forEach(item => {
  // Set initial hidden styles
  item.style.opacity = '0';
  item.style.transform = 'translateY(40px)';
  item.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.8s ease';
  revealOnScrollObserver.observe(item);
});

// --------------------------------------------------------------------------
// Mobile Auto-Carousel (scrolls every 3 seconds on touch devices)
// --------------------------------------------------------------------------
(function initMobileCarousel() {
  const galleryContainer = document.getElementById('gallery-container');
  if (!galleryContainer || galleryItems.length === 0) return;

  // Only run on mobile widths
  function isMobile() {
    return window.innerWidth <= 768;
  }

  // Get currently visible gallery items
  function getVisibleItems() {
    return galleryItems.filter(item => !item.classList.contains('hidden-item'));
  }

  let currentCardIndex = 0;
  let autoScrollTimer = null;
  let isUserInteracting = false;
  let resumeTimer = null;

  // Create dot indicators container
  const dotsWrapper = document.createElement('div');
  dotsWrapper.className = 'carousel-dots';
  galleryContainer.parentElement.insertBefore(dotsWrapper, galleryContainer.nextSibling);

  // Build dots
  function buildDots() {
    dotsWrapper.innerHTML = '';
    if (!isMobile()) {
      dotsWrapper.style.display = 'none';
      return;
    }
    dotsWrapper.style.display = 'flex';
    const visibleItems = getVisibleItems();
    visibleItems.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => scrollToCard(i));
      dotsWrapper.appendChild(dot);
    });
  }

  function updateDots(index) {
    const dots = dotsWrapper.querySelectorAll('.carousel-dot');
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  // Scroll to a specific card smoothly
  function scrollToCard(index) {
    if (!isMobile()) return;
    const visibleItems = getVisibleItems();
    const card = visibleItems[index];
    if (!card) return;
    const containerLeft = galleryContainer.getBoundingClientRect().left;
    const cardLeft = card.getBoundingClientRect().left;
    const scrollOffset = cardLeft - containerLeft - (galleryContainer.offsetWidth - card.offsetWidth) / 2;
    galleryContainer.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    currentCardIndex = index;
    updateDots(index);
  }

  // Advance to next card
  function nextCard() {
    if (!isMobile() || isUserInteracting) return;
    const visibleItems = getVisibleItems();
    if (visibleItems.length === 0) return;
    const next = (currentCardIndex + 1) % visibleItems.length;
    scrollToCard(next);
  }

  // Start / stop the timer
  function startAutoScroll() {
    if (!isMobile()) return;
    stopAutoScroll();
    autoScrollTimer = setInterval(nextCard, 3000);
  }

  function stopAutoScroll() {
    if (autoScrollTimer) {
      clearInterval(autoScrollTimer);
      autoScrollTimer = null;
    }
  }

  // Pause on touch, resume after 5s of no interaction
  galleryContainer.addEventListener('touchstart', () => {
    if (!isMobile()) return;
    isUserInteracting = true;
    stopAutoScroll();
    clearTimeout(resumeTimer);
  }, { passive: true });

  galleryContainer.addEventListener('touchend', () => {
    if (!isMobile()) return;
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => {
      isUserInteracting = false;
      // Detect which card is most visible after swipe
      let closest = 0;
      let minDist = Infinity;
      const containerCenter = galleryContainer.scrollLeft + galleryContainer.offsetWidth / 2;
      const visibleItems = getVisibleItems();
      visibleItems.forEach((item, i) => {
        const cardCenter = item.offsetLeft + item.offsetWidth / 2;
        const dist = Math.abs(cardCenter - containerCenter);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      currentCardIndex = closest;
      updateDots(closest);
      startAutoScroll();
    }, 5000);
  }, { passive: true });

  // Re-init on resize
  window.addEventListener('resize', () => {
    buildDots();
    if (isMobile()) {
      startAutoScroll();
    } else {
      stopAutoScroll();
    }
  });

  // Re-build dots and scroll position when gallery visibility changes
  window.addEventListener('gallery-updated', () => {
    buildDots();
    currentCardIndex = 0;
    scrollToCard(0);
  });

  // Init
  buildDots();
  if (isMobile()) startAutoScroll();
})();


// --------------------------------------------------------------------------
// 5. Cinematic Video Modal Functions
// --------------------------------------------------------------------------
const modalVideoPlayer = document.getElementById('modal-video-player');

function openVideoModal() {
  videoModal.classList.add('active');
  modalVideoPlayer.play().catch(error => {
    console.log("Auto-play blocked inside modal: ", error);
  });
  if (backgroundVideo) {
    backgroundVideo.pause();
  }
  // Pause background music when video starts
  if (bgMusic && !bgMusic.paused) {
    bgMusic.pause();
    musicToggleBtn.classList.remove('playing');
  }
}

function closeVideoModal() {
  videoModal.classList.remove('active');
  modalVideoPlayer.pause();
  modalVideoPlayer.currentTime = 0;
  if (backgroundVideo) {
    backgroundVideo.play().catch(() => {});
  }
}

openVideoBtn.addEventListener('click', openVideoModal);
closeVideoModalBtn.addEventListener('click', closeVideoModal);
videoModal.querySelector('.modal-bg-blur').addEventListener('click', closeVideoModal);

// --------------------------------------------------------------------------
// 6. Interactive Lightbox Functions
// --------------------------------------------------------------------------
function updateLightboxContent(index) {
  const item = galleryItems[index];
  if (!item) return;

  const imgSrc = item.getAttribute('data-src');
  const catKey = item.querySelector('.item-category').getAttribute('data-key');
  const titleKey = item.querySelector('.item-title').getAttribute('data-key');

  // Update content
  lightboxImage.src = imgSrc;
  lightboxCategory.textContent = translations[currentLang][catKey];
  lightboxTitle.textContent = translations[currentLang][titleKey];
}

function openLightbox(index) {
  activeGalleryIndex = index;
  updateLightboxContent(index);
  lightboxModal.classList.add('active');
}

function closeLightbox() {
  lightboxModal.classList.remove('active');
}

function navigateLightbox(dir) {
  let nextIndex = activeGalleryIndex + dir;
  if (nextIndex < 0) {
    nextIndex = galleryItems.length - 1;
  } else if (nextIndex >= galleryItems.length) {
    nextIndex = 0;
  }
  activeGalleryIndex = nextIndex;
  updateLightboxContent(nextIndex);
}

// Bind Click handlers to each gallery item
galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => {
    openLightbox(index);
  });
});

closeLightboxBtn.addEventListener('click', closeLightbox);
lightboxModal.querySelector('.modal-bg-blur').addEventListener('click', closeLightbox);

lightboxPrev.addEventListener('click', (e) => {
  e.stopPropagation();
  navigateLightbox(-1);
});

lightboxNext.addEventListener('click', (e) => {
  e.stopPropagation();
  navigateLightbox(1);
});

// Keyboard Accessibility for Lightbox
window.addEventListener('keydown', (e) => {
  if (!lightboxModal.classList.contains('active')) return;

  if (e.key === 'Escape') {
    closeLightbox();
  } else if (e.key === 'ArrowLeft') {
    // If layout direction is RTL, swap navigation direction keys
    const dir = document.documentElement.dir === 'rtl' ? 1 : -1;
    navigateLightbox(dir);
  } else if (e.key === 'ArrowRight') {
    const dir = document.documentElement.dir === 'rtl' ? -1 : 1;
    navigateLightbox(dir);
  }
});

// --------------------------------------------------------------------------
// 7. Royal Share Sheet Functionality
// --------------------------------------------------------------------------
function openShareModal() {
  shareModal.classList.add('active');
}

function closeShareModal() {
  shareModal.classList.remove('active');
}

// Share triggers
headerShareBtn.addEventListener('click', (e) => {
  e.preventDefault();
  openShareModal();
});

if (mobileShareBtn) {
  mobileShareBtn.addEventListener('click', openShareModal);
}
closeShareModalBtn.addEventListener('click', closeShareModal);
shareModal.querySelector('.modal-bg-blur').addEventListener('click', closeShareModal);

// Native Share or Social Fallbacks
const pageUrl = window.location.href;
const shareText = "Check out this royal graduation portfolio gallery!";

shareWhatsappBtn.addEventListener('click', () => {
  const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + pageUrl)}`;
  window.open(url, '_blank');
});

shareXBtn.addEventListener('click', () => {
  const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`;
  window.open(url, '_blank');
});

shareFacebookBtn.addEventListener('click', () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
  window.open(url, '_blank');
});

// Copy link to clipboard with premium toast alert
shareCopyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(pageUrl).then(() => {
    // Show toast notification
    copyToast.classList.add('show');
    
    // Hide toast after 2 seconds
    setTimeout(() => {
      copyToast.classList.remove('show');
    }, 2000);
  }).catch(err => {
    console.error("Failed to copy link: ", err);
  });
});

// --------------------------------------------------------------------------
// 8. Splash Screen Entry & Background Music Control
// --------------------------------------------------------------------------

// Enter Experience button — triggered by real user gesture so music works on mobile
if (enterBtn && splashOverlay) {
  enterBtn.addEventListener('click', () => {
    // 1. Play music immediately inside the user-gesture callback (works on iOS/Android)
    if (bgMusic) {
      bgMusic.play().then(() => {
        if (musicToggleBtn) musicToggleBtn.classList.add('playing');
      }).catch(err => console.log('Music play failed:', err));
    }

    // 2. Fade out and hide splash overlay
    splashOverlay.classList.add('fade-out');

    // 3. After transition completes, remove from DOM so it doesn't block clicks
    splashOverlay.addEventListener('transitionend', () => {
      splashOverlay.style.display = 'none';
    }, { once: true });
  });
}

// Music toggle button — play / pause
if (musicToggleBtn && bgMusic) {
  musicToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (bgMusic.paused) {
      bgMusic.play().then(() => {
        musicToggleBtn.classList.add('playing');
      }).catch(err => console.log('Playback failed:', err));
    } else {
      bgMusic.pause();
      musicToggleBtn.classList.remove('playing');
    }
  });
}

// --------------------------------------------------------------------------
// 9. Royal Fullscreen Slideshow
// --------------------------------------------------------------------------
(function initSlideshowView() {
  const viewModeBtn   = document.getElementById('view-mode-btn');
  const slideshowView = document.getElementById('slideshow-view');
  const slideshowImg  = document.getElementById('slideshow-img');
  const galleryContainer = document.getElementById('gallery-container');

  if (!viewModeBtn || !slideshowView) return;

  // Collect all image sources from the gallery items
  const imageData = galleryItems.map(item => ({
    src: item.getAttribute('data-src')
  }));

  let activeIdx = 0;
  let timerId = null;
  let isPaused = false;

  function showSlide(index, animate = true) {
    activeIdx = ((index % imageData.length) + imageData.length) % imageData.length;

    if (animate && slideshowImg) {
      slideshowImg.classList.add('fade-out');
      setTimeout(() => {
        slideshowImg.src = imageData[activeIdx].src;
        slideshowImg.classList.remove('fade-out');
      }, 200);
    } else if (slideshowImg) {
      slideshowImg.src = imageData[activeIdx].src;
    }
  }

  function startTimer() {
    stopTimer();
    if (isPaused) return;

    timerId = setTimeout(() => {
      goNext();
    }, 3000); // 3 seconds cycle
  }

  function stopTimer() {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
  }

  function goNext() {
    showSlide(activeIdx + 1);
    startTimer();
  }

  function goPrev() {
    showSlide(activeIdx - 1);
    startTimer();
  }

  function togglePlayPause() {
    isPaused = !isPaused;
    if (isPaused) {
      stopTimer();
    } else {
      startTimer();
    }
  }

  function openSlideshow() {
    activeIdx = 0;
    isPaused = false;
    
    slideshowView.classList.add('active');
    slideshowView.setAttribute('aria-hidden', 'false');
    if (galleryContainer) galleryContainer.classList.add('slideshow-active');
    document.body.classList.add('slideshow-open'); // lock body scroll

    // Hide mobile swipe dots
    const dots = document.querySelector('.carousel-dots');
    if (dots) dots.style.visibility = 'hidden';
    viewModeBtn.style.display = 'none';

    showSlide(activeIdx, false);
    startTimer();

    // Ensure music is playing
    if (bgMusic && bgMusic.paused) {
      bgMusic.play().then(() => {
        if (musicToggleBtn) musicToggleBtn.classList.add('playing');
      }).catch(err => console.log('Music play failed:', err));
    }
  }

  function closeSlideshow() {
    stopTimer();
    slideshowView.classList.remove('active');
    slideshowView.setAttribute('aria-hidden', 'true');
    if (galleryContainer) galleryContainer.classList.remove('slideshow-active');
    document.body.classList.remove('slideshow-open'); // unlock body scroll

    const dots = document.querySelector('.carousel-dots');
    if (dots) dots.style.visibility = '';
    viewModeBtn.style.display = '';
  }

  /* ---- Event listeners ---- */
  viewModeBtn.addEventListener('click', openSlideshow);
  
  // Click on background closes slideshow (desktop mouse click)
  slideshowView.addEventListener('click', (e) => {
    if (e.pointerType !== 'touch') {
      closeSlideshow();
    }
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!slideshowView.classList.contains('active')) return;
    
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      goNext();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      goPrev();
    } else if (e.key === ' ') {
      e.preventDefault(); // Prevent page scroll
      togglePlayPause();
    } else if (e.key === 'Escape') {
      closeSlideshow();
    }
  });

  // Touch swipe and tap handling for mobile devices (resolving double-taps/swipe conflicts)
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;

  slideshowView.addEventListener('touchstart', e => { 
    touchStartX = e.touches[0].clientX; 
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
  }, { passive: true });
  
  slideshowView.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    const dt = Date.now() - touchStartTime;

    // Detect swipe (dx > 40px, low vertical shift)
    if (Math.abs(dx) > 40 && Math.abs(dy) < 100) {
      e.stopPropagation();
      if (dx < 0) goNext(); else goPrev();
      return;
    }

    // Detect single quick tap
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10 && dt < 300) {
      closeSlideshow();
    }
  });
})();

// --------------------------------------------------------------------------
// 10. View All / Collapse Gallery Toggle
// --------------------------------------------------------------------------
(function initViewAllToggle() {
  const viewAllBtn = document.getElementById('view-all-btn');
  if (!viewAllBtn) return;

  const viewAllSpan = viewAllBtn.querySelector('span');
  const hiddenItems = Array.from(document.querySelectorAll('.gallery-item.hidden-item'));
  let isExpanded = false;

  viewAllBtn.addEventListener('click', () => {
    isExpanded = !isExpanded;
    
    // Toggle hidden items visibility
    hiddenItems.forEach(item => {
      if (isExpanded) {
        // Remove style display hidden and animate in
        item.style.display = 'block'; // force display to allow transition
        // Let masonry/grid calculate layout first, then fade in
        setTimeout(() => {
          item.classList.remove('hidden-item');
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 50);
      } else {
        item.classList.add('hidden-item');
        item.style.opacity = '0';
        item.style.transform = 'translateY(40px)';
        // Reset display after transit finishes
        setTimeout(() => {
          if (!isExpanded) item.style.display = '';
        }, 800);
      }
    });

    // Update button text and class
    viewAllBtn.classList.toggle('expanded', isExpanded);
    if (isExpanded) {
      viewAllSpan.setAttribute('data-key', 'btn-view-less');
      viewAllSpan.textContent = translations[currentLang]['btn-view-less'];
    } else {
      viewAllSpan.setAttribute('data-key', 'btn-view-all');
      viewAllSpan.textContent = translations[currentLang]['btn-view-all'];
      
      // Scroll smoothly back to top of gallery when collapsing
      const gallerySec = document.getElementById('gallery');
      if (gallerySec) {
        gallerySec.scrollIntoView({ behavior: 'smooth' });
      }
    }

    // Trigger update event for mobile carousel dots
    window.dispatchEvent(new Event('gallery-updated'));
  });
})();

