document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const hamburgerIcon = document.querySelector('.hamburger-icon');
  const closeIcon = document.querySelector('.close-icon');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      const isActive = navMenu.classList.contains('active');
      hamburgerIcon.style.display = isActive ? 'none' : 'block';
      closeIcon.style.display = isActive ? 'block' : 'none';
      mobileToggle.setAttribute('aria-expanded', isActive);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        hamburgerIcon.style.display = 'block';
        closeIcon.style.display = 'none';
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu.classList.remove('active');
        hamburgerIcon.style.display = 'block';
        closeIcon.style.display = 'none';
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Gallery carousel
  const galleryCarousel = document.getElementById('galleryCarousel');
  if (galleryCarousel) {
    const items = galleryCarousel.querySelectorAll('.gallery-item');
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    const progressCurrent = document.querySelector('.progress-current');
    let currentIndex = 2; // Start with middle item active

    function updateCarousel() {
      items.forEach((item, index) => {
        item.classList.remove('gallery-item-active');
        if (index === currentIndex) {
          item.classList.add('gallery-item-active');
        }
      });
      if (progressCurrent) {
        progressCurrent.textContent = String(currentIndex + 1).padStart(2, '0');
      }
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
      });
    }

    // Auto-advance carousel
    setInterval(function() {
      currentIndex = (currentIndex + 1) % items.length;
      updateCarousel();
    }, 5000);
  }

  // FAQ accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(question => {
    question.addEventListener('click', function() {
      const faqItem = this.closest('.faq-item');
      const answer = faqItem.querySelector('.faq-answer');
      const isExpanded = this.getAttribute('aria-expanded') === 'true';

      // Close all other FAQs
      faqQuestions.forEach(q => {
        if (q !== this) {
          q.setAttribute('aria-expanded', 'false');
          const otherAnswer = q.closest('.faq-item').querySelector('.faq-answer');
          otherAnswer.style.maxHeight = '0';
        }
      });

      // Toggle current FAQ
      this.setAttribute('aria-expanded', !isExpanded);
      if (!isExpanded) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = '0';
      }
    });
  });

  // Gallery filter (if on gallery page)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item-grid');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      // Filter items
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {

          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Lightbox for gallery
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    let currentLightboxIndex = 0;
    const allImages = Array.from(document.querySelectorAll('.gallery-item-grid img'));

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', function() {
        const img = this.querySelector('img');
        const title = this.querySelector('.gallery-item-title');
        currentLightboxIndex = index;
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxCaption.textContent = title ? title.textContent : img.alt;
        lightbox.classList.add('active');
      });
    });

    lightboxClose.addEventListener('click', function() {
      lightbox.classList.remove('active');
    });

    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        lightbox.classList.remove('active');
      }
    });

    lightboxNext.addEventListener('click', function() {
      currentLightboxIndex = (currentLightboxIndex + 1) % galleryItems.length;
      const nextItem = galleryItems[currentLightboxIndex];
      const img = nextItem.querySelector('img');
      const title = nextItem.querySelector('.gallery-item-title');
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightboxCaption.textContent = title ? title.textContent : img.alt;
    });

    lightboxPrev.addEventListener('click', function() {
      currentLightboxIndex = (currentLightboxIndex - 1 + galleryItems.length) % galleryItems.length;
      const prevItem = galleryItems[currentLightboxIndex];
      const img = prevItem.querySelector('img');
      const title = prevItem.querySelector('.gallery-item-title');
      lightboxImage.src = img.src;
      lightboxImage.alt = img.alt;
      lightboxCaption.textContent = title ? title.textContent : img.alt;
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
          lightbox.classList.remove('active');
        } else if (e.key === 'ArrowRight') {
          lightboxNext.click();
        } else if (e.key === 'ArrowLeft') {
          lightboxPrev.click();
        }
      }
    });
  }

  // Anchor navigation (shows page)
  const anchorLinks = document.querySelectorAll('.anchor-link');
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        // Update active link
        anchorLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');

        // Smooth scroll
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetElement.offsetTop - navHeight - 40;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Smooth scroll for all internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const navHeight = document.querySelector('.navbar').offsetHeight;
          const targetPosition = target.offsetTop - navHeight - 20;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Form submission (contact form)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      // Form will be handled by post-generation email integration
      alert('תודה על פנייתכם! נחזור אליכם בהקדם.');
    });
  }

  // Add active class to current page in navigation
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });

  // Navbar scroll effect
  let lastScroll = 0;
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
      navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
    } else {
      navbar.style.boxShadow = 'none';
    }
    lastScroll = currentScroll;
  });
});

/* Cookie Consent */

// Helper function to check cookie consent
function hasConsentFor(category) {
  if (typeof window.CookieConsent === 'undefined') {
    return false; // Default to no consent if cookie consent not loaded
  }
  
  return window.CookieConsent.validConsent(category);
}

// Helper function to execute code only with consent
function withConsent(category, callback) {
  if (hasConsentFor(category)) {
    callback();
  } else {
    console.log(`[WARNING] Skipping ${category} code - no user consent`);
  }
}

// Cookie Consent Initialization

(function() {
  'use strict';
  
  let initAttempts = 0;
  const maxAttempts = 50; // 5 seconds max wait
  
  // Wait for DOM and vanilla-cookieconsent to be ready
  function initCookieConsent() {
    initAttempts++;
    
    
    if (typeof window.CookieConsent === 'undefined') {
      if (initAttempts < maxAttempts) {
        setTimeout(initCookieConsent, 100);
      } else {
      }
      return;
    }

    const cc = window.CookieConsent;
    
    
    // Initialize cookie consent
    try {
      cc.run({
  "autoShow": true,
  "mode": "opt-in",
  "revision": 0,
  "categories": {
    "necessary": {
      "enabled": true,
      "readOnly": true
    },
    "analytics": {
      "enabled": false,
      "readOnly": false,
      "autoClear": {
        "cookies": [
          {
            "name": "_ga"
          },
          {
            "name": "_ga_*"
          },
          {
            "name": "_gid"
          },
          {
            "name": "_gat"
          }
        ]
      }
    },
    "marketing": {
      "enabled": false,
      "readOnly": false,
      "autoClear": {
        "cookies": [
          {
            "name": "_fbp"
          },
          {
            "name": "_fbc"
          },
          {
            "name": "fr"
          }
        ]
      }
    }
  },
  "language": {
    "default": "he",
    "translations": {
      "he": {
        "consentModal": {
          "title": "אנחנו משתמשים בעוגיות 🍪",
          "description": "קסם של סיפור משתמש בעוגיות כדי לשפר את החוויה שלך, לנתח שימוש באתר ולסייע במאמצי השיווק שלנו.",
          "acceptAllBtn": "אשר הכל",
          "acceptNecessaryBtn": "רק הכרחי",
          "showPreferencesBtn": "נהל העדפות",
          "footer": "<a href=\"#privacy-policy\">מדיניות פרטיות</a> | <a href=\"#terms-conditions\">תנאי שימוש</a>"
        },
        "preferencesModal": {
          "title": "העדפות עוגיות",
          "acceptAllBtn": "אשר הכל",
          "acceptNecessaryBtn": "רק הכרחי",
          "savePreferencesBtn": "שמור העדפות",
          "closeIconLabel": "סגור",
          "sections": [
            {
              "title": "עוגיות חיוניות",
              "description": "עוגיות אלה הכרחיות לתפקוד האתר ולא ניתן להשבית אותן.",
              "linkedCategory": "necessary"
            },
            {
              "title": "עוגיות ניתוח",
              "description": "עוגיות אלה עוזרות לנו להבין איך המבקרים מתקשרים עם האתר שלנו.",
              "linkedCategory": "analytics"
            },
            {
              "title": "עוגיות שיווקיות",
              "description": "עוגיות אלה משמשות להצגת פרסומות מותאמות אישית.",
              "linkedCategory": "marketing"
            }
          ]
        }
      }
    }
  },
  "guiOptions": {
    "consentModal": {
      "layout": "box",
      "position": "bottom right",
      "equalWeightButtons": true,
      "flipButtons": false
    },
    "preferencesModal": {
      "layout": "box",
      "equalWeightButtons": true,
      "flipButtons": false
    }
  }
});
      
      // Optional: Handle consent changes (check if onChange is available)
      if (typeof cc.onChange === 'function') {
        cc.onChange(function(cookie, changed_preferences) {
      
      // Enable/disable analytics based on consent
      if (changed_preferences.includes('analytics')) {
        if (cc.validConsent('analytics')) {
          // Enable analytics (e.g., Google Analytics)
          // Example: gtag('consent', 'update', { analytics_storage: 'granted' });
        } else {
          // Example: gtag('consent', 'update', { analytics_storage: 'denied' });
        }
      }
      
      // Enable/disable marketing based on consent
      if (changed_preferences.includes('marketing')) {
        if (cc.validConsent('marketing')) {
          // Example: gtag('consent', 'update', { ad_storage: 'granted' });
        } else {
          // Example: gtag('consent', 'update', { ad_storage: 'denied' });
        }
      }
        });
      } else {
      }

      // Note: Cookie Preferences button removed per marketing guidelines
      // Footer should be clean and minimal - users can manage cookies via banner
    } catch (error) {
    }
  }

  // Initialize when DOM is ready - multiple approaches for reliability
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieConsent);
    // Backup timeout in case DOMContentLoaded doesn't fire
    setTimeout(initCookieConsent, 1000);
  } else if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initCookieConsent();
  } else {
    // Fallback - try after a short delay
    setTimeout(initCookieConsent, 500);
  }
  
  // Additional fallback - try after page load
  if (typeof window !== 'undefined') {
    if (window.addEventListener) {
      window.addEventListener('load', initCookieConsent, { once: true });
    }
  }
})();

/* Accessibility Features */

/* Mickidum Accessibility Toolbar Initialization - Zappy Style */

window.onload = function() {
    
    try {
        window.micAccessTool = new MicAccessTool({
            buttonPosition: 'left', // Position on left side
            forceLang: 'he-IL', // Force language
            icon: {
                position: {
                    bottom: { size: 50, units: 'px' },
                    left: { size: 20, units: 'px' },
                    type: 'fixed'
                },
                backgroundColor: 'transparent', // Transparent to allow CSS styling
                color: 'transparent', // Let CSS handle coloring
                img: 'accessible',
                circular: false // Square button for consistent styling
            },
            menu: {
                dimensions: {
                    width: { size: 300, units: 'px' },
                    height: { size: 'auto', units: 'px' }
                }
            }
        });
        
    } catch (error) {
    }
    
    // Keyboard shortcut handler: ALT+A (Option+A on Mac) to toggle accessibility widget visibility (desktop only)
    document.addEventListener('keydown', function(event) {
        // Check if ALT+A is pressed (ALT on Windows/Linux, Option on Mac)
        var isAltOrOption = event.altKey || event.metaKey;
        var isAKey = event.keyCode === 65 || event.which === 65 || 
                      (event.key && (event.key.toLowerCase() === 'a' || event.key === 'å' || event.key === 'Å'));
        
        if (isAltOrOption && isAKey) {
            // Only work on desktop (screen width > 768px)
            if (window.innerWidth > 768) {
                event.preventDefault();
                event.stopPropagation();
                
                // Toggle visibility class on body
                var isVisible = document.body.classList.contains('accessibility-widget-visible');
                
                if (isVisible) {
                    // Hide the widget
                    document.body.classList.remove('accessibility-widget-visible');
                } else {
                    // Show the widget
                    document.body.classList.add('accessibility-widget-visible');
                    
                    // After a short delay, click the button to open the menu
                    setTimeout(function() {
                        var accessButton = document.getElementById('mic-access-tool-general-button');
                        if (accessButton) {
                            accessButton.click();
                        }
                    }, 200);
                }
            }
        }
    }, true);
};


// Zappy Contact Form API Integration (Fallback)
(function() {
    if (window.zappyContactFormLoaded) {
        console.log('📧 Zappy contact form already loaded');
        return;
    }
    window.zappyContactFormLoaded = true;

    function initContactFormIntegration() {
        console.log('📧 Zappy: Initializing contact form API integration...');

        // Find the contact form (try multiple selectors for flexibility)
        const contactForm = document.querySelector('.contact-form') || 
                           document.querySelector('form[action*="contact"]') ||
                           document.querySelector('form#contact') ||
                           document.querySelector('form#contactForm') ||
                           document.getElementById('contactForm') ||
                           document.querySelector('section.contact form') ||
                           document.querySelector('section#contact form') ||
                           document.querySelector('form');
        
        if (!contactForm) {
            console.log('⚠️ Zappy: No contact form found on page');
            return;
        }
        
        console.log('✅ Zappy: Contact form found:', contactForm.className || contactForm.id || 'unnamed form');

        // Store original submit handler if exists
        const originalOnSubmit = contactForm.onsubmit;

    // Add Zappy API integration using capture phase to run before other handlers
    contactForm.addEventListener('submit', async function(e) {
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        // Send to Zappy backend API (don't prevent default, let other handlers run)
        try {
            console.log('📧 Zappy: Sending contact form to backend API...');
            const response = await fetch('http://localhost:5001/api/email/contact-form', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    websiteId: 'edf450ce-2b1a-44d5-b4aa-1b7a5f1ed6c9',
                    name: data.name || '',
                    email: data.email || '',
                    subject: data.subject || 'Contact Form Submission',
                    message: data.message || '',
                    phone: data.phone || null
                })
            });

            const result = await response.json();
            
            if (result.success) {
                console.log('✅ Zappy: Contact form data sent successfully to backend');
            } else {
                console.log('⚠️ Zappy: Backend returned error:', result.error);
            }
        } catch (error) {
            console.error('❌ Zappy: Failed to send to backend API:', error);
            // Don't break the existing form submission
        }
        }, true); // Use capture phase to run before other handlers

        console.log('✅ Zappy: Contact form API integration initialized');
    } // End of initContactFormIntegration
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContactFormIntegration);
    } else {
        // DOM is already ready, initialize immediately
        initContactFormIntegration();
    }
})();
