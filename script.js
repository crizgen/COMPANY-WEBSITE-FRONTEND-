/**
 * Crizgen Website Scripts
 * Plain Vanilla JavaScript - No frameworks, zero external dependencies
 */

// =========================================================================
// WEB3FORMS ACCESS KEY CONFIGURATION
// Replace 'YOUR_ACCESS_KEY' with your Web3Forms access key from https://web3forms.com
// =========================================================================
const WEB3FORMS_ACCESS_KEY = 'a36a7bc4-94f9-43da-9a90-aef23a661abf';

(function () {
  'use strict';

  // =========================================================================
  // 1. THEME TOGGLE (Dark / Light Theme with localStorage persistence)
  // =========================================================================
  const THEME_STORAGE_KEY = 'crizgen_theme_preference';
  const htmlRoot = document.documentElement;
  const themeToggleBtn = document.getElementById('themeToggle');
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');

  /**
   * Safe localStorage getter with try/catch fallback
   */
  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY);
    } catch (e) {
      console.warn('localStorage is not accessible:', e);
      return null;
    }
  }

  /**
   * Safe localStorage setter with try/catch fallback
   */
  function setStoredTheme(theme) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (e) {
      console.warn('localStorage is not writable:', e);
    }
  }

  /**
   * Apply theme to DOM and update meta theme-color
   */
  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'light' ? '#f8fafc' : '#090d16');
    }
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        'aria-label',
        theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'
      );
      themeToggleBtn.setAttribute(
        'title',
        theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'
      );
    }
  }

  /**
   * Determine initial theme:
   * 1. URL parameter (?theme=light or ?theme=dark)
   * 2. Saved preference in localStorage
   * 3. Otherwise default to 'dark' as specified in requirements
   */
  function initTheme() {
    const urlParams = new URLSearchParams(window.location.search);
    const themeParam = urlParams.get('theme');
    if (themeParam === 'light' || themeParam === 'dark') {
      applyTheme(themeParam);
      setStoredTheme(themeParam);
      return;
    }

    const saved = getStoredTheme();
    if (saved === 'light' || saved === 'dark') {
      applyTheme(saved);
    } else {
      // Dark theme by default
      applyTheme('dark');
    }
  }

  /**
   * Toggle between dark and light themes
   */
  function toggleTheme() {
    const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    setStoredTheme(newTheme);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  // Initialize theme immediately
  initTheme();

  // =========================================================================
  // 2. MOBILE NAVIGATION DRAWER
  // =========================================================================
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileNavItems = document.querySelectorAll('.mobile-nav-item, .mobile-drawer-cta a');

  function openMobileMenu() {
    if (!mobileMenuToggle || !mobileDrawer) return;
    mobileMenuToggle.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
  }

  function closeMobileMenu() {
    if (!mobileMenuToggle || !mobileDrawer) return;
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
  }

  if (mobileMenuToggle && mobileDrawer) {
    mobileMenuToggle.addEventListener('click', function () {
      const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close when clicking any nav item inside the drawer
    mobileNavItems.forEach(function (item) {
      item.addEventListener('click', function () {
        closeMobileMenu();
      });
    });

    // Close when clicking outside drawer
    document.addEventListener('click', function (e) {
      if (
        mobileDrawer.classList.contains('open') &&
        !mobileDrawer.contains(e.target) &&
        !mobileMenuToggle.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeMobileMenu();
        mobileMenuToggle.focus();
      }
    });
  }

  // =========================================================================
  // 3. SCROLLSPY / ACTIVE NAV ITEM INDICATOR
  // =========================================================================
  const navLinks = document.querySelectorAll('.nav-links .nav-item');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollPosition = window.scrollY + 120; // Offset for navbar

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          if (link.getAttribute('href') === '#' + sectionId) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // =========================================================================
  // 4. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
  // =========================================================================
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const urlParams = new URLSearchParams(window.location.search);
  const forceReveal = urlParams.get('revealed') === 'true';
  const revealElements = document.querySelectorAll('.reveal-fade');

  if (forceReveal || prefersReducedMotion || !('IntersectionObserver' in window)) {
    // Reveal all elements immediately if forced, reduced motion, or no observer support
    revealElements.forEach(function (el) {
      el.classList.add('revealed');
    });
  } else {
    const observerOptions = {
      root: null,
      rootMargin: '50px 0px 0px 0px',
      threshold: 0.05,
    };

    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });

    // Safety fallback: Reveal elements that are already within view
    window.addEventListener('scroll', function () {
      revealElements.forEach(function (el) {
        if (!el.classList.contains('revealed')) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= (window.innerHeight || document.documentElement.clientHeight) + 100) {
            el.classList.add('revealed');
          }
        }
      });
    }, { passive: true });
  }

  // =========================================================================
  // 5. CONTACT FORM (Web3Forms JSON Submission & Validation)
  // =========================================================================
  const contactForm = document.getElementById('contactForm');
  const userName = document.getElementById('userName');
  const userEmail = document.getElementById('userEmail');
  const userMessage = document.getElementById('userMessage');
  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  const submitBtnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const originalBtnText = submitBtnText ? submitBtnText.textContent.trim() : 'Submit Project Inquiry';

  function clearErrors() {
    if (nameError) nameError.textContent = '';
    if (emailError) emailError.textContent = '';
    if (messageError) messageError.textContent = '';
    if (userName) userName.classList.remove('error');
    if (userEmail) userEmail.classList.remove('error');
    if (userMessage) userMessage.classList.remove('error');
    if (formStatus) {
      formStatus.className = 'form-status';
      formStatus.textContent = '';
    }
  }

  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function validateForm() {
    let isValid = true;
    clearErrors();

    // Name check
    if (!userName.value.trim()) {
      nameError.textContent = 'Please enter your full name.';
      userName.classList.add('error');
      isValid = false;
    }

    // Email check
    if (!userEmail.value.trim()) {
      emailError.textContent = 'Please enter your email address.';
      userEmail.classList.add('error');
      isValid = false;
    } else if (!isValidEmail(userEmail.value.trim())) {
      emailError.textContent = 'Please enter a valid email address.';
      userEmail.classList.add('error');
      isValid = false;
    }

    // Message check
    if (!userMessage.value.trim()) {
      messageError.textContent = 'Please describe your project requirements.';
      userMessage.classList.add('error');
      isValid = false;
    } else if (userMessage.value.trim().length < 10) {
      messageError.textContent = 'Please provide a bit more detail (at least 10 characters).';
      userMessage.classList.add('error');
      isValid = false;
    }

    return isValid;
  }

  function setButtonSending(isSending) {
    if (!submitBtn) return;
    if (isSending) {
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      if (submitBtnText) {
        submitBtnText.textContent = 'Sending...';
      } else {
        submitBtn.textContent = 'Sending...';
      }
    } else {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      if (submitBtnText) {
        submitBtnText.textContent = originalBtnText;
      } else {
        submitBtn.textContent = originalBtnText;
      }
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      // UX: While sending, disable the button and change its text to "Sending..."
      setButtonSending(true);

      // Prepare form data as an object
      const formData = new FormData(contactForm);
      const payload = Object.fromEntries(formData);

      // Resolve access key from constant (top of script) or hidden form input
      const accessKeyInput = contactForm.querySelector('input[name="access_key"]');
      const resolvedKey =
        WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY !== 'YOUR_ACCESS_KEY'
          ? WEB3FORMS_ACCESS_KEY
          : (accessKeyInput && accessKeyInput.value ? accessKeyInput.value : WEB3FORMS_ACCESS_KEY);

      payload.access_key = resolvedKey;

      // Handle honeypot botcheck checkbox: remove if not filled/checked
      if (contactForm.botcheck && !contactForm.botcheck.checked) {
        delete payload.botcheck;
      }

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json().catch(function () {
          return {};
        });

        if (response.status === 200 && data.success) {
          // On success, show a green message under the form ("Thanks! We'll get back to you soon.") and reset the form
          formStatus.className = 'form-status success';
          formStatus.textContent = "Thanks! We'll get back to you soon.";
          contactForm.reset();
          setButtonSending(false);
        } else {
          // On failure, show a red error message and re-enable the button
          formStatus.className = 'form-status error';
          formStatus.textContent =
            data.message || 'Unable to submit your inquiry at this time. Please check your details and try again.';
          setButtonSending(false);
        }
      } catch (err) {
        // On network error, show a red error message and re-enable the button
        console.error('Web3Forms submission error:', err);
        formStatus.className = 'form-status error';
        formStatus.textContent = 'Network error. Please check your connection and try again.';
        setButtonSending(false);
      }
    });

    // Real-time error clearance on input
    [userName, userEmail, userMessage].forEach(function (input) {
      if (input) {
        input.addEventListener('input', function () {
          if (this.classList.contains('error')) {
            this.classList.remove('error');
            const errSpan = document.getElementById(this.id.replace('user', '').toLowerCase() + 'Error');
            if (errSpan) errSpan.textContent = '';
          }
        });
      }
    });
  }

  // =========================================================================
  // 6. BACK TO TOP BUTTON
  // =========================================================================
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // =========================================================================
  // 7. DYNAMIC COPYRIGHT YEAR
  // =========================================================================
  const currentYearSpan = document.getElementById('currentYear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
})();
