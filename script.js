document.addEventListener('DOMContentLoaded', () => {
  // Add scroll animations for sections
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -80px 0px',
    threshold: 0.01
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add basic animation classes via JS to keep CSS clean
  const sectionsToAnimate = [
    // Landing Page sections & components
    '.hero-intro-content',
    '.problem-notes-header',
    '.retro-notes-board',
    '.equation-container',
    '.how-works-header',
    '.how-step-card',
    '.vision-lab-card',
    '.features-fireplace-container',
    '.cta-floating-container',
    
    // Existing project layout elements
    '.problem-header',
    '.problem-card',
    '.features-container h2',
    '.feature-card',
    '.step-card',
    '.profile-card',
    '.goal-card',
    '.oops-note-card',
    '.profile-quote-card',
    '.profile-portrait-wrapper',
    '.profile-role-badge',
    '.goal-graphic-wrapper',
    '.cta-inner',

    // Product Page sections & components
    '.product-hero-bg-text',
    '.product-hero-image-container',
    '.product-intro-text',
    '.product-video-section',
    '.steps-section-title',
    '.step-item',
    '.steps-showcase-card',
    '.bento-section-header',
    '.bento-item',
    '.product-cta-container'
  ];

  // Premium Scroll Reveal float up style (similar to gethapply.com)
  const style = document.createElement('style');
  style.textContent = `
    .animate-up {
      opacity: 0;
      transform: translateY(60px);
      transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
      will-change: opacity, transform;
    }
    .animate-up.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  sectionsToAnimate.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
      el.classList.add('animate-up');
      // Add slight delay for grid/timeline items to stagger their reveal
      if (el.classList.contains('problem-card') || el.classList.contains('feature-card') || el.classList.contains('step-card') || el.classList.contains('how-step-card') || el.classList.contains('profile-card') || el.classList.contains('goal-card') || el.classList.contains('bento-item') || el.classList.contains('step-item')) {
        el.style.transitionDelay = `${index * 0.15}s`;
      }
      observer.observe(el);
    });
  });

  // Ticker content cloning for seamless infinite scroll
  const tickers = document.querySelectorAll('.ticker-track');
  tickers.forEach(track => {
    // Clone children to ensure enough content for seamless loop
    const children = Array.from(track.children);
    children.forEach(child => {
      const clone = child.cloneNode(true);
      track.appendChild(clone);
    });
  });

  // Observe bounce animated elements
  document.querySelectorAll('.animate-bounce-up').forEach(el => {
    observer.observe(el);
  });

  // Parallax scroll effect for sections with requestAnimationFrame
  const bgImg = document.querySelector('.main-bg-img');
  const textOverlay = document.querySelector('.oopslab-huge-text');
  const visionBg = document.querySelector('.vision-bg-img');
  
  if (visionBg) {
    visionBg.style.transform = 'scale(1.15)';
    visionBg.style.willChange = 'transform';
  }
  
  let ticking = false;
  
  function updateParallax() {
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Main Hero Section Parallax
    if (bgImg) {
      bgImg.style.transform = `scale(1.15) translate3d(0, ${scrolled * 0.2}px, 0)`;
    }
    if (textOverlay) {
      textOverlay.style.transform = `translate3d(0, ${scrolled * 0.4}px, 0)`;
    }
    
    // Vision Section Parallax
    if (visionBg) {
      const visionRect = visionBg.getBoundingClientRect();
      const visionTop = visionRect.top + scrolled;
      
      if (visionRect.top < windowHeight && visionRect.bottom > 0) {
        const offset = (scrolled - visionTop) * 0.15;
        visionBg.style.transform = `scale(1.15) translate3d(0, ${offset}px, 0)`;
      }
    }
    
    ticking = false;
  }
  
  if (bgImg || textOverlay || visionBg) {
    updateParallax();
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    }, { passive: true });
  }

  // Custom Cursor spotter/finder interaction (Oops Lab Concept)
  if (window.matchMedia('(pointer: fine)').matches) {
    const cursorDot = document.createElement('div');
    cursorDot.className = 'custom-cursor-dot';
    cursorDot.style.pointerEvents = 'none'; // absolute guarantee
    const cursorRing = document.createElement('div');
    cursorRing.className = 'custom-cursor-ring';
    cursorRing.style.pointerEvents = 'none'; // absolute guarantee
    
    const cursorText = document.createElement('span');
    cursorText.className = 'custom-cursor-text';
    cursorText.style.pointerEvents = 'none'; // absolute guarantee
    cursorRing.appendChild(cursorText);
    
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorRing);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Center the dot by appending translate(-50%, -50%)
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    });

    function animateCursor() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      
      // Center the ring by appending translate(-50%, -50%)
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Event delegation for hover states
    const interactiveSelectors = 'a, button, .btn, .note-card, .equation-twist-box-container, .oops-box-container, .note-icon-circle, .logo, .ticker-item, .bento-item, .steps-showcase-card, .video-play-btn';
    
    document.addEventListener('mouseover', (e) => {
      // Exclude custom cursor elements from event responses
      if (e.target === cursorDot || e.target === cursorRing || cursorRing.contains(e.target)) return;

      const target = e.target.closest(interactiveSelectors);
      // Ignore hover effects if target is inside the navigation bar (.navbar)
      if (target && !target.closest('.navbar')) {
        cursorRing.classList.add('hovered');
        cursorDot.classList.add('hovered');
        
        // Custom text based on hovered element type
        if (target.classList.contains('note-card') || target.classList.contains('note-icon-circle') || target.classList.contains('steps-showcase-card')) {
          cursorText.textContent = 'oops';
        } else if (target.classList.contains('equation-twist-box-container')) {
          cursorText.textContent = 'twist';
        } else if (target.classList.contains('oops-box-container')) {
          cursorText.textContent = 'oops';
        } else if (target.classList.contains('video-play-btn')) {
          cursorText.textContent = 'play';
        } else if (target.classList.contains('btn') || target.tagName === 'BUTTON') {
          cursorText.textContent = 'go';
        } else if (target.classList.contains('logo')) {
          cursorText.textContent = 'home';
        } else {
          cursorText.textContent = 'view';
        }
      }
    });

    document.addEventListener('mouseout', (e) => {
      // Exclude custom cursor elements from event responses
      if (e.target === cursorDot || e.target === cursorRing || cursorRing.contains(e.target)) return;

      const target = e.target.closest(interactiveSelectors);
      // Remove hover state if leaving interactive element or entering the navbar
      if (!target || target.closest('.navbar') || !e.relatedTarget || !e.relatedTarget.closest(interactiveSelectors) || e.relatedTarget.closest('.navbar')) {
        cursorRing.classList.remove('hovered');
        cursorDot.classList.remove('hovered');
        cursorText.textContent = '';
      }
    });

    document.addEventListener('mouseleave', () => {
      cursorRing.style.opacity = '0';
      cursorDot.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      cursorRing.style.opacity = '1';
      cursorDot.style.opacity = '1';
    });
  }

  // Premium Video Player Controller
  const videoContainer = document.getElementById('video-container');
  const productVideo = document.getElementById('product-video');
  const playButton = document.getElementById('play-button');

  if (videoContainer && productVideo && playButton) {
    // Play video on button click
    playButton.addEventListener('click', (e) => {
      e.stopPropagation(); // prevent container click trigger
      playVideo();
    });

    // Toggle play/pause on container click
    videoContainer.addEventListener('click', () => {
      if (productVideo.paused) {
        playVideo();
      } else {
        pauseVideo();
      }
    });

    function playVideo() {
      productVideo.play().then(() => {
        videoContainer.classList.add('playing');
        productVideo.muted = false; // unmute when user clicks play
      }).catch(err => {
        console.warn("Unmuted play blocked, falling back to muted play:", err);
        productVideo.muted = true;
        productVideo.play();
        videoContainer.classList.add('playing');
      });
    }

    function pauseVideo() {
      productVideo.pause();
      videoContainer.classList.remove('playing');
    }
  }

  // Preorder Section Popup Hover and Close interaction
  const preorderSection = document.querySelector('.product-preorder-section');
  const preorderBadge = document.querySelector('.preorder-badge-wrapper');
  const preorderCloseBtn = document.querySelector('.preorder-popup-close');

  if (preorderSection && preorderBadge && preorderCloseBtn) {
    let wasClosed = false;

    preorderSection.addEventListener('mouseenter', () => {
      if (!wasClosed) {
        preorderBadge.classList.add('active');
      }
    });

    preorderSection.addEventListener('mouseleave', () => {
      preorderBadge.classList.remove('active');
      wasClosed = false; // Reset close state so it can appear next time
    });

    preorderCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent triggering enter/leave events or clicks
      preorderBadge.classList.remove('active');
      wasClosed = true; // Mark as closed manually
    });
  }
});
