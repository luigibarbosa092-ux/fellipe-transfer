/**
 * FELLIPE TRANSFER - CORE JS ENGINE
 * Engineered by a premium agency using high-performance, modern Vanilla JavaScript.
 * Strictly adheres to 0-framework constraint.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileMenu();
  initScrollReveal();
  initCounterStats();
  initFAQAccordion();
  initActiveMenuHighlighting();
});

/**
 * 1. HEADER SCROLL EFFECT
 * Shrinks the header and applies backdrop-filter and solid color when user scrolls down.
 */
function initHeaderScroll() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Run on load and add listener
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * 2. MOBILE HAMBURGER MENU
 * Handles opening, closing, and animating the mobile menu layout.
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuToggle || !navMenu) return;

  const toggleMenu = () => {
    const isExpanded = menuToggle.classList.contains('active');
    menuToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', !isExpanded);
  };

  const closeMenu = () => {
    menuToggle.classList.remove('active');
    navMenu.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  };

  menuToggle.addEventListener('click', toggleMenu);

  // Close menu when clicking any link
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when clicking outside of nav menu
  document.addEventListener('click', (event) => {
    const isClickInsideMenu = navMenu.contains(event.target);
    const isClickOnToggle = menuToggle.contains(event.target);
    
    if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
      closeMenu();
    }
  });
}

/**
 * 3. HIGH-PERFORMANCE SCROLL REVEAL (INTERSECTION OBSERVER)
 * Uses native IntersectionObserver to animate items on-scroll without polling window.scrollY.
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.scroll-reveal');
  if (revealElements.length === 0) return;

  const observerOptions = {
    root: null, // relative to viewport
    rootMargin: '0px 0px -10% 0px', // trigger slightly before entering viewport
    threshold: 0.1 // 10% visible
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Trigger only once for performance
      }
    });
  }, observerOptions);

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });
}

/**
 * 4. ANIMATED STATISTICS COUNTERS
 * Animates numbers in real-time once the statistics section scrolls into view.
 */
function initCounterStats() {
  const statsSection = document.getElementById('estatisticas');
  if (!statsSection) return;

  const counterElements = document.querySelectorAll('.stat-number');
  let animated = false;

  const countTo = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds animation
    const startTime = performance.now();

    const updateCount = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1); // Clamp to 1

      // EaseOutQuad formula for luxury premium flow: f(t) = t*(2-t)
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.floor(easeProgress * target);

      element.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        element.textContent = target; // Ensure exact final value
      }
    };

    requestAnimationFrame(updateCount);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        counterElements.forEach(counter => countTo(counter));
        animated = true; // Run only once
        observer.unobserve(statsSection);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(statsSection);
}

/**
 * 5. FLUID ACCORDION FOR FAQ
 * Smoothly expands FAQ items, allowing only one item open at a time.
 */
function initFAQAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  if (accordionItems.length === 0) return;

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');

    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other accordion items first (premium singular accordion behavior)
      accordionItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.accordion-content');
          if (otherContent) {
            otherContent.style.maxHeight = null;
            otherItem.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
            otherContent.setAttribute('aria-hidden', 'true');
          }
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('active');
        content.style.maxHeight = null;
        trigger.setAttribute('aria-expanded', 'false');
        content.setAttribute('aria-hidden', 'true');
      } else {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + "px";
        trigger.setAttribute('aria-expanded', 'true');
        content.setAttribute('aria-hidden', 'false');
      }
    });
  });
}

/**
 * 6. ACTIVE MENU NAVIGATION HIGHLIGHTING
 * Highlights the appropriate header navigation item corresponding to current active viewport section.
 */
function initActiveMenuHighlighting() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightMenu = () => {
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120; // offset for fixed header

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', highlightMenu, { passive: true });
}
