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

  function startScrollAnimations() {
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
      // ※ product-hero-bg-text, product-hero-image-container, product-video-section 제외
      //   → 섹션 전체/배경이 translateY로 올라오면 아래 빈 공간 발생
      '.product-intro-text',
      '.steps-section-title',
      '.step-item',
      '.steps-showcase-card',
      '.bento-section-header',
      '.bento-item'
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

    // Observe bounce animated elements
    document.querySelectorAll('.animate-bounce-up').forEach(el => {
      observer.observe(el);
    });

    // Trigger glitch texts
    glitchSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        const label = el.textContent.trim().replace(/\s+/g, ' ');
        if (label) {
          el.dataset.oopsText = label;
          el.classList.add('oops-glitch-text');
        }
      });
    });

    const sharedCtaTitles = document.querySelectorAll('.cta-floating-title, .product-cta-title');
    sharedCtaTitles.forEach(title => title.classList.add('oops-cta-reveal'));

    if (prefersReducedMotion) {
      sharedCtaTitles.forEach(title => title.classList.add('oops-cta-reveal-in'));
    } else {
      const sharedCtaObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('oops-cta-reveal-in');
          sharedCtaObserver.unobserve(entry.target);
        });
      }, {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.28
      });

      sharedCtaTitles.forEach(title => sharedCtaObserver.observe(title));
    }

    if (!prefersReducedMotion) {
      const immersiveObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('oops-in-view');

            if (entry.target.classList.contains('oops-glitch-text')) {
              entry.target.classList.add('oops-glitch-play');
              entry.target.addEventListener('animationend', () => {
                entry.target.classList.remove('oops-glitch-play');
              }, { once: true });
            }
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.12
      });

      document.querySelectorAll('.oops-kinetic-ready, .oops-kinetic-soft, .oops-glitch-text').forEach(el => immersiveObserver.observe(el));
    } else {
      document.querySelectorAll('.oops-kinetic-ready, .oops-kinetic-soft').forEach(el => el.classList.add('oops-in-view'));
    }
  }



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

  // Parallax scroll effect for sections with requestAnimationFrame
  const bgImg = document.querySelector('.main-bg-img');
  const textOverlay = document.querySelector('.oopslab-huge-text');
  // Vision imagery uses its own spring-based gimbal interaction below.
  const visionBg = null;

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

  // ── Product Hero Image: 물리 hover 인터랙션 ──
  const heroImg = document.querySelector('.product-hero-floating-img');
  if (heroImg) {
    // 최초 진입: is-idle → floatBobbing 시작
    heroImg.classList.add('is-idle');

    let settleTimer = null;

    heroImg.addEventListener('mouseenter', () => {
      if (settleTimer) clearTimeout(settleTimer);
      heroImg.classList.remove('is-idle'); // hover CSS 규칙 발동
    });

    heroImg.addEventListener('mouseleave', () => {
      // settle 완료(650ms) 후 bobbing 재개
      settleTimer = setTimeout(() => {
        heroImg.classList.add('is-idle');
      }, 680);
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

  // ── OOPS LAB Immersive Interaction Add-on ──
  // Layout-safe: add/toggle state classes only. No markup restructuring.
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const kineticSelectors = [
    '.hero-intro-title',
    '.problem-notes-header',
    '.equation-container',
    '.how-works-header',
    '.features-fireplace-title',
    '.vision-quote',
    '.objectives-title',
    '.steps-section-title',
    '.bento-section-header'
  ];

  const softRevealSelectors = [
    '.main-peeking-section',
    '.retro-notes-board',
    '.features-fireplace-container',
    '.vision-lab-card',
    '.team-hero',
    '.team-problems',
    '.product-hero',
    '.video-container-inner',
    '.steps-showcase-card',
    '.product-preorder-section'
  ];

  const mediaSelectors = [
    '.main-background-wrapper',
    '.features-fireplace-section',
    '.features-fireplace-card',
    '.equation-arrow-container',
    '.note-icon-circle',
    '.product-hero-floating-img',
    '.video-container-inner',
    '.bento-item',
    '.bento-card-icon-wrapper',
    '.product-preorder-section'
  ];

  const cardSelectors = [
    '.note-card',
    '.note-icon-circle',
    '.feature-card',
    '.bento-item',
    '.product-cta-buttons button',
    '.cta-floating-buttons button',
    '.btn'
  ];

  const glitchSelectors = [
    '.oopslab-huge-text',
    '.hero-intro-title',
    '.problem-notes-header h2',
    '.product-hero-bg-text',
    '.steps-section-title',
    '.bento-section-title',
    '.hero-giant-text',
    '.problems-giant-line'
  ];

  const addClassToMatches = (selectors, className) => {
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        if (className === 'oops-magnetic-hover') {
          const baseTransform = getComputedStyle(el).transform;
          el.style.setProperty('--oops-base-transform', baseTransform === 'none' ? 'none' : baseTransform);
        }
        el.classList.add(className);
      });
    });
  };

  addClassToMatches(kineticSelectors, 'oops-kinetic-ready');
  addClassToMatches(softRevealSelectors, 'oops-kinetic-soft');
  addClassToMatches(mediaSelectors, 'oops-media-kinetic');
  addClassToMatches(cardSelectors, 'oops-magnetic-hover');
  document.querySelectorAll('.bento-item, .feature-fireplace-card').forEach(el => {
    if (!el.style.getPropertyValue('--oops-base-transform')) {
      const baseTransform = getComputedStyle(el).transform;
      el.style.setProperty('--oops-base-transform', baseTransform === 'none' ? 'none' : baseTransform);
    }
    el.classList.add('oops-card-3d');
  });
  document.querySelectorAll('.ticker').forEach(el => el.classList.add('oops-ticker-reactive'));

  document.querySelectorAll('.how-step-card').forEach(card => {
    if (!card.querySelector('.how-step-flip-shell')) return;
    card.classList.add('oops-step-flip');
    card.tabIndex = 0;
  });



  const hoverDelegationSelectors = '.oops-media-kinetic, .oops-card-3d, .oops-magnetic-hover';
  document.addEventListener('pointerover', (event) => {
    const target = event.target.closest(hoverDelegationSelectors);
    if (target && !target.closest('.navbar')) target.classList.add('is-oops-hover');
  });

  document.addEventListener('pointerout', (event) => {
    const target = event.target.closest(hoverDelegationSelectors);
    if (target && (!event.relatedTarget || !target.contains(event.relatedTarget))) {
      target.classList.remove('is-oops-hover');
    }
  });

  document.addEventListener('pointerdown', () => {
    const ring = document.querySelector('.custom-cursor-ring');
    if (!ring) return;
    ring.classList.add('oops-clicked');
    ring.addEventListener('animationend', () => ring.classList.remove('oops-clicked'), { once: true });
  });

  // Pointer velocity, physical toss, 3D lighting and cursor particles.
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    const interactiveSurfaces = Array.from(document.querySelectorAll(
      '.oops-card-3d, .oops-magnetic-hover, .oops-media-kinetic'
    ));

    let lastPointerX = window.innerWidth / 2;
    let lastPointerY = window.innerHeight / 2;
    let lastPointerTime = performance.now();
    let pointerSpeed = 0;
    let sparkDistance = 0;
    let pointerIdleTimer = null;

    document.addEventListener('pointermove', event => {
      const now = performance.now();
      const elapsed = Math.max(8, now - lastPointerTime);
      const dx = event.clientX - lastPointerX;
      const dy = event.clientY - lastPointerY;
      const distance = Math.hypot(dx, dy);
      pointerSpeed += ((distance / elapsed) - pointerSpeed) * 0.32;

      const ring = document.querySelector('.custom-cursor-ring');
      if (ring) {
        ring.classList.add('oops-velocity');
        ring.style.setProperty('--oops-cursor-speed', Math.min(pointerSpeed / 2.4, 1).toFixed(3));
        clearTimeout(pointerIdleTimer);
        pointerIdleTimer = setTimeout(() => {
          pointerSpeed = 0;
          ring.style.setProperty('--oops-cursor-speed', '0');
        }, 90);
      }

      const surface = event.target.closest('.oops-card-3d, .oops-magnetic-hover, .oops-media-kinetic');
      if (surface && !surface.closest('.navbar')) {
        const rect = surface.getBoundingClientRect();
        const localX = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
        const localY = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
        const velocityKick = Math.min(pointerSpeed * 1.8, 4);

        surface.style.setProperty('--oops-light-x', `${(localX * 100).toFixed(1)}%`);
        surface.style.setProperty('--oops-light-y', `${(localY * 100).toFixed(1)}%`);
        surface.style.setProperty('--oops-rx', `${((0.5 - localY) * 12 - dy * 0.035 - velocityKick * Math.sign(dy || 1)).toFixed(2)}deg`);
        surface.style.setProperty('--oops-ry', `${((localX - 0.5) * 14 + dx * 0.035 + velocityKick * Math.sign(dx || 1)).toFixed(2)}deg`);
      }

      sparkDistance += distance;
      if (sparkDistance > 82 && pointerSpeed > 0.72) {
        sparkDistance = 0;
        const spark = document.createElement('i');
        spark.className = 'oops-cursor-spark';
        spark.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
        spark.style.setProperty('--oops-spark-x', `${Math.max(-22, Math.min(22, -dx * 1.6))}px`);
        spark.style.setProperty('--oops-spark-y', `${Math.max(-22, Math.min(22, -dy * 1.6))}px`);
        document.body.appendChild(spark);
        spark.addEventListener('animationend', () => spark.remove(), { once: true });
      }

      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      lastPointerTime = now;
    }, { passive: true });

    interactiveSurfaces.forEach(surface => {
      surface.addEventListener('pointerleave', () => {
        surface.style.setProperty('--oops-rx', '0deg');
        surface.style.setProperty('--oops-ry', '0deg');
        surface.style.setProperty('--oops-light-x', '50%');
        surface.style.setProperty('--oops-light-y', '50%');
      });
    });
  }

  if (!prefersReducedMotion) {
    const kineticMedia = Array.from(document.querySelectorAll('.oops-media-kinetic'));
    let previousScrollY = window.scrollY;
    let scrollVelocity = 0;
    let scrollFrame = null;

    const updateScrollPhysics = () => {
      const currentScrollY = window.scrollY;
      scrollVelocity = scrollVelocity * 0.72 + (currentScrollY - previousScrollY) * 0.28;
      previousScrollY = currentScrollY;
      const normalized = Math.max(-1, Math.min(1, scrollVelocity / 42));

      kineticMedia.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return;
        const direction = index % 2 === 0 ? 1 : -1;
        el.style.setProperty('--oops-scroll-toss', `${(normalized * 8 * direction).toFixed(2)}px`);
        el.style.setProperty('--oops-scroll-spin', `${(normalized * 0.55 * direction).toFixed(2)}deg`);
      });

      scrollVelocity *= 0.78;
      scrollFrame = Math.abs(scrollVelocity) > 0.08
        ? requestAnimationFrame(updateScrollPhysics)
        : null;
    };

    window.addEventListener('scroll', () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollPhysics);
    }, { passive: true });
  }

  // Product page: one typing sequence and varied physical media behaviors.
  const productPage = document.body.classList.contains('product-page');
  if (productPage) {
    const labNote = document.querySelector('.vision-quote');
    const labNoteLines = labNote ? Array.from(labNote.querySelectorAll('p')) : [];

    if (labNote && labNoteLines.length) {
      labNote.classList.add('oops-labnote-typing');
      const originalLines = labNoteLines.map(line => line.textContent);

      if (prefersReducedMotion) {
        labNoteLines.forEach((line, index) => {
          line.textContent = originalLines[index];
        });
      } else {
        labNoteLines.forEach(line => {
          line.textContent = '';
        });

        let typingStarted = false;
        const typeLabNote = async () => {
          if (typingStarted) return;
          typingStarted = true;

          for (let lineIndex = 0; lineIndex < labNoteLines.length; lineIndex += 1) {
            const line = labNoteLines[lineIndex];
            const text = originalLines[lineIndex];
            line.classList.add('is-typing');

            for (let charIndex = 0; charIndex < text.length; charIndex += 1) {
              line.textContent += text[charIndex];
              const character = text[charIndex];
              const delay = character === ' ' ? 18 : (character === '.' || character === '?' ? 115 : 34);
              await new Promise(resolve => setTimeout(resolve, delay));
            }

            line.classList.remove('is-typing');
            await new Promise(resolve => setTimeout(resolve, 95));
          }
        };

        const typingObserver = new IntersectionObserver(entries => {
          if (entries.some(entry => entry.isIntersecting)) {
            typeLabNote();
            typingObserver.disconnect();
          }
        }, { threshold: 0.42 });

        typingObserver.observe(labNote);
      }
    }

    const labFinderCard = document.querySelector('.product-page .vision-lab-card');
    if (labFinderCard && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
      labFinderCard.classList.add('oops-lab-finder');

      const finderTarget = document.createElement('div');
      finderTarget.className = 'oops-lab-finder-target';
      finderTarget.setAttribute('aria-hidden', 'true');

      const finderFrame = document.createElement('span');
      finderFrame.className = 'oops-lab-finder-frame';
      const finderLabel = document.createElement('span');
      finderLabel.className = 'oops-lab-finder-label';
      finderLabel.textContent = 'OOPS! FOUND';

      finderTarget.appendChild(finderFrame);
      finderTarget.appendChild(finderLabel);
      labFinderCard.appendChild(finderTarget);

      let finderMouseX = 0;
      let finderMouseY = 0;
      let finderX = 0;
      let finderY = 0;
      let finderFrameId = null;
      let finderCaptureTimer = null;

      const animateFinder = () => {
        finderX += (finderMouseX - finderX) * 0.16;
        finderY += (finderMouseY - finderY) * 0.16;
        finderTarget.style.setProperty('--finder-x', `${finderX.toFixed(2)}px`);
        finderTarget.style.setProperty('--finder-y', `${finderY.toFixed(2)}px`);

        const distance = Math.hypot(finderMouseX - finderX, finderMouseY - finderY);
        finderFrameId = distance > 0.08 ? requestAnimationFrame(animateFinder) : null;
      };

      const startFinder = () => {
        if (!finderFrameId) finderFrameId = requestAnimationFrame(animateFinder);
      };

      const burstFinderParticles = () => {
        for (let index = 0; index < 10; index += 1) {
          const angle = (Math.PI * 2 * index) / 10 + (Math.random() - 0.5) * 0.35;
          const distance = 78 + Math.random() * 54;
          const particle = document.createElement('i');
          particle.className = 'oops-lab-finder-particle';
          particle.style.setProperty('--particle-x', `${(Math.cos(angle) * distance).toFixed(1)}px`);
          particle.style.setProperty('--particle-y', `${(Math.sin(angle) * distance).toFixed(1)}px`);
          particle.style.setProperty('--particle-rotate', `${Math.round(Math.random() * 180)}deg`);
          finderTarget.appendChild(particle);
          particle.addEventListener('animationend', () => particle.remove(), { once: true });
        }
      };

      labFinderCard.addEventListener('pointerenter', event => {
        const rect = labFinderCard.getBoundingClientRect();
        finderMouseX = event.clientX - rect.left;
        finderMouseY = event.clientY - rect.top;
        finderX = finderMouseX;
        finderY = finderMouseY;
        finderTarget.classList.add('is-finder-visible');
        document.querySelector('.custom-cursor-ring')?.style.setProperty('opacity', '0');
        document.querySelector('.custom-cursor-dot')?.style.setProperty('opacity', '0');
        startFinder();
      });

      labFinderCard.addEventListener('pointermove', event => {
        const rect = labFinderCard.getBoundingClientRect();
        finderMouseX = Math.max(96, Math.min(rect.width - 96, event.clientX - rect.left));
        finderMouseY = Math.max(96, Math.min(rect.height - 118, event.clientY - rect.top));
        startFinder();

        clearTimeout(finderCaptureTimer);
        finderCaptureTimer = setTimeout(() => {
          finderTarget.classList.remove('is-finder-captured');
          void finderTarget.offsetWidth;
          finderTarget.classList.add('is-finder-captured');
          finderLabel.textContent = Math.random() > 0.5 ? 'OOPS! FOUND' : 'TARGET LOCKED';
          burstFinderParticles();
        }, 240);
      }, { passive: true });

      labFinderCard.addEventListener('pointerleave', () => {
        clearTimeout(finderCaptureTimer);
        finderTarget.classList.remove('is-finder-visible', 'is-finder-captured');
        document.querySelector('.custom-cursor-ring')?.style.setProperty('opacity', '1');
        document.querySelector('.custom-cursor-dot')?.style.setProperty('opacity', '1');
      });

      finderFrame.addEventListener('animationend', event => {
        if (event.animationName === 'oopsFinderCapture') {
          finderTarget.classList.remove('is-finder-captured');
        }
      });
    }

    const bentoGrid = document.querySelector('.bento-grid');
    if (bentoGrid) {
      bentoGrid.classList.add('oops-product-tilt');
    }

    const showcase = document.querySelector('.steps-showcase-card');
    const cinematicVideo = document.querySelector('.video-container-inner');
    const productLabCard = document.querySelector('.vision-lab-card');
    const productPreorder = document.querySelector('.product-preorder-section');

    if (cinematicVideo) cinematicVideo.classList.add('oops-product-cinematic');
    if (productLabCard) productLabCard.classList.add('oops-product-depth');
    if (productPreorder) productPreorder.classList.add('oops-product-drift');

    if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
      const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
      const pointerRatio = (event, element) => {
        const rect = element.getBoundingClientRect();
        return {
          x: clamp((event.clientX - rect.left) / rect.width, 0, 1),
          y: clamp((event.clientY - rect.top) / rect.height, 0, 1)
        };
      };

      if (bentoGrid) {
        let velocityX = 0;
        let velocityY = 0;
        let previousX = 0;
        let previousY = 0;

        bentoGrid.addEventListener('pointerenter', event => {
          previousX = event.clientX;
          previousY = event.clientY;
          bentoGrid.classList.add('is-product-hover');
        });

        bentoGrid.addEventListener('pointermove', event => {
          const point = pointerRatio(event, bentoGrid);
          velocityX = velocityX * 0.58 + (event.clientX - previousX) * 0.42;
          velocityY = velocityY * 0.58 + (event.clientY - previousY) * 0.42;
          previousX = event.clientX;
          previousY = event.clientY;

          const strength = 12;
          const rx = (0.5 - point.y) * strength - clamp(velocityY * 0.045, -3.5, 3.5);
          const ry = (point.x - 0.5) * strength + clamp(velocityX * 0.045, -3.5, 3.5);

          bentoGrid.style.setProperty('--product-rx', `${rx.toFixed(2)}deg`);
          bentoGrid.style.setProperty('--product-ry', `${ry.toFixed(2)}deg`);
          bentoGrid.style.setProperty('--product-light-x', `${(point.x * 100).toFixed(1)}%`);
          bentoGrid.style.setProperty('--product-light-y', `${(point.y * 100).toFixed(1)}%`);

          const orangeCard = bentoGrid.querySelector('.bento-card-orange');
          if (orangeCard) {
            const pointOrange = pointerRatio(event, orangeCard);
            orangeCard.style.setProperty('--product-icon-x', `${((pointOrange.x - 0.5) * 28).toFixed(1)}px`);
            orangeCard.style.setProperty('--product-icon-y', `${((pointOrange.y - 0.5) * 22).toFixed(1)}px`);
            orangeCard.style.setProperty('--product-icon-spin', `${(velocityX * 0.65).toFixed(1)}deg`);
          }
        });

        bentoGrid.addEventListener('pointerleave', () => {
          bentoGrid.classList.remove('is-product-hover');
          bentoGrid.style.setProperty('--product-rx', '0deg');
          bentoGrid.style.setProperty('--product-ry', '0deg');
          bentoGrid.style.setProperty('--product-light-x', '50%');
          bentoGrid.style.setProperty('--product-light-y', '50%');

          const orangeCard = bentoGrid.querySelector('.bento-card-orange');
          if (orangeCard) {
            orangeCard.style.setProperty('--product-icon-x', '0px');
            orangeCard.style.setProperty('--product-icon-y', '0px');
            orangeCard.style.setProperty('--product-icon-spin', '0deg');
          }
        });
      }

      const addDepthPan = (element, xProperty, yProperty, amount) => {
        if (!element) return;
        element.addEventListener('pointermove', event => {
          const point = pointerRatio(event, element);
          element.classList.add('is-product-hover');
          element.style.setProperty(xProperty, `${((0.5 - point.x) * amount).toFixed(1)}px`);
          element.style.setProperty(yProperty, `${((0.5 - point.y) * amount).toFixed(1)}px`);
        });
        element.addEventListener('pointerleave', () => {
          element.classList.remove('is-product-hover');
          element.style.setProperty(xProperty, '0px');
          element.style.setProperty(yProperty, '0px');
        });
      };

      addDepthPan(cinematicVideo, '--video-pan-x', '--video-pan-y', 18);
      addDepthPan(productLabCard, '--lab-pan-x', '--lab-pan-y', 24);
      addDepthPan(productPreorder, '--preorder-pan-x', '--preorder-pan-y', 20);
    }

    const stepsSection = document.querySelector('.product-steps-section');
    const showcaseImages = showcase ? Array.from(showcase.querySelectorAll('.steps-showcase-img')) : [];
    const showcaseChannel = showcase?.querySelector('.steps-retro-channel');
    if (stepsSection && showcase && showcaseImages.length === 3) {
      let activeShowcaseIndex = 0;
      let showcaseScrollFrame = null;
      let showcaseSwitchTimer = null;

      const setShowcaseImage = nextIndex => {
        if (nextIndex === activeShowcaseIndex) return;
        activeShowcaseIndex = nextIndex;
        showcaseImages.forEach((image, index) => {
          image.classList.toggle('is-showcase-active', index === activeShowcaseIndex);
        });

        if (showcaseChannel) {
          showcaseChannel.textContent = `CH 0${activeShowcaseIndex + 1}`;
        }

        if (!prefersReducedMotion) {
          showcase.classList.remove('is-retro-switching');
          void showcase.offsetWidth;
          showcase.classList.add('is-retro-switching');
          clearTimeout(showcaseSwitchTimer);
          showcaseSwitchTimer = setTimeout(() => {
            showcase.classList.remove('is-retro-switching');
          }, 500);
        }
      };

      const updateShowcaseFromScroll = () => {
        const rect = stepsSection.getBoundingClientRect();
        const isPinnedLayout = window.innerWidth > 1024;
        const travel = isPinnedLayout
          ? Math.max(1, rect.height - window.innerHeight)
          : window.innerHeight + rect.height;
        const progress = isPinnedLayout
          ? Math.max(0, Math.min(1, -rect.top / travel))
          : Math.max(0, Math.min(1, (window.innerHeight - rect.top) / travel));
        const nextIndex = progress < 0.3 ? 0 : (progress < 0.62 ? 1 : 2);
        setShowcaseImage(nextIndex);
        showcaseScrollFrame = null;
      };

      window.addEventListener('scroll', () => {
        if (!showcaseScrollFrame) {
          showcaseScrollFrame = requestAnimationFrame(updateShowcaseFromScroll);
        }
      }, { passive: true });

      window.addEventListener('resize', updateShowcaseFromScroll);
      updateShowcaseFromScroll();
    }

    const productHero = document.querySelector('.product-hero');
    const productStickerTrail = productHero?.querySelector('.product-sticker-trail');
    if (productHero && productStickerTrail && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
      const productStickerLabels = ['CLIP IT', 'OOPS 01', 'QUICK FIX', 'LAB GOODS', 'KEEP CLOSE'];
      let productStickerIndex = 0;
      let productPreviousX = null;
      let productPreviousY = null;
      let productPreviousTime = 0;

      productHero.addEventListener('pointermove', event => {
        const rect = productHero.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const now = performance.now();

        if (productPreviousX === null) {
          productPreviousX = x;
          productPreviousY = y;
          productPreviousTime = now;
          return;
        }

        const dx = x - productPreviousX;
        const dy = y - productPreviousY;
        const distance = Math.hypot(dx, dy);
        if (distance < 82 || now - productPreviousTime < 78) return;

        const sticker = document.createElement('span');
        const variation = productStickerIndex % 4;
        sticker.className = 'product-cursor-sticker';
        if (variation === 1) sticker.classList.add('is-product-orange');
        if (variation === 2) sticker.classList.add('is-product-black');
        if (variation === 3) sticker.classList.add('is-product-vertical');
        sticker.textContent = productStickerLabels[productStickerIndex % productStickerLabels.length];
        productStickerIndex += 1;

        const isVertical = variation === 3;
        const edgeX = isVertical ? 54 : 82;
        const edgeY = isVertical ? 70 : 44;
        sticker.style.left = `${Math.max(edgeX, Math.min(rect.width - edgeX, x))}px`;
        sticker.style.top = `${Math.max(edgeY, Math.min(rect.height - edgeY, y))}px`;
        sticker.style.setProperty('--product-sticker-rotate', `${(-10 + Math.random() * 20).toFixed(1)}deg`);
        sticker.style.setProperty('--product-sticker-scale', (0.88 + Math.random() * 0.24).toFixed(2));
        if (!isVertical) {
          sticker.style.setProperty('--product-sticker-width', `${118 + Math.round(Math.random() * 54)}px`);
          sticker.style.setProperty('--product-sticker-height', `${54 + Math.round(Math.random() * 22)}px`);
        }
        productStickerTrail.appendChild(sticker);

        while (productStickerTrail.children.length > 8) {
          productStickerTrail.firstElementChild?.remove();
        }

        sticker.addEventListener('animationend', () => sticker.remove(), { once: true });
        productPreviousX = x;
        productPreviousY = y;
        productPreviousTime = now;
      }, { passive: true });

      productHero.addEventListener('pointerleave', () => {
        productPreviousX = null;
        productPreviousY = null;
      });
    }
  }

  // Distinct spring-based movement for imagery that does not already have
  // a dedicated product interaction.
  if (!prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    const physicalMediaConfigs = [];

    physicalMediaConfigs.forEach(config => {
      document.querySelectorAll(config.wrapper).forEach(wrapper => {
        const media = wrapper.querySelector(config.media);
        if (!media) return;

        wrapper.classList.add('oops-physical-frame', config.mode);
        media.classList.add('oops-physical-media');

        const state = {
          x: 0,
          y: 0,
          rx: 0,
          ry: 0,
          rotate: 0,
          scale: config.baseScale || null,
          vx: 0,
          vy: 0,
          vrx: 0,
          vry: 0,
          vrotate: 0,
          vscale: 0,
          targetX: 0,
          targetY: 0,
          targetRx: 0,
          targetRy: 0,
          targetRotate: 0,
          targetScale: config.baseScale || null,
          pointerX: 0,
          pointerY: 0,
          frame: null
        };

        const animatePhysicalMedia = () => {
          state.vx = (state.vx + (state.targetX - state.x) * config.spring) * config.friction;
          state.vy = (state.vy + (state.targetY - state.y) * config.spring) * config.friction;
          state.vrx = (state.vrx + (state.targetRx - state.rx) * config.spring) * config.friction;
          state.vry = (state.vry + (state.targetRy - state.ry) * config.spring) * config.friction;
          state.vrotate = (state.vrotate + (state.targetRotate - state.rotate) * config.spring) * config.friction;
          if (state.scale !== null) {
            state.vscale = (
              state.vscale +
              (state.targetScale - state.scale) * (config.scaleSpring || config.spring)
            ) * (config.scaleFriction || config.friction);
          }

          state.x += state.vx;
          state.y += state.vy;
          state.rx += state.vrx;
          state.ry += state.vry;
          state.rotate += state.vrotate;
          if (state.scale !== null) state.scale += state.vscale;

          wrapper.style.setProperty('--oops-media-x', `${state.x.toFixed(2)}px`);
          wrapper.style.setProperty('--oops-media-y', `${state.y.toFixed(2)}px`);
          wrapper.style.setProperty('--oops-media-rx', `${state.rx.toFixed(2)}deg`);
          wrapper.style.setProperty('--oops-media-ry', `${state.ry.toFixed(2)}deg`);
          wrapper.style.setProperty('--oops-media-rotate', `${state.rotate.toFixed(2)}deg`);
          if (state.scale !== null) {
            wrapper.style.setProperty('--oops-media-scale', state.scale.toFixed(4));
          }

          const motion = Math.abs(state.vx) + Math.abs(state.vy) + Math.abs(state.vrx) + Math.abs(state.vry) + Math.abs(state.vscale);
          const distance = Math.abs(state.targetX - state.x) + Math.abs(state.targetY - state.y) +
            (state.scale === null ? 0 : Math.abs(state.targetScale - state.scale) * 100);
          if (motion > 0.015 || distance > 0.04) {
            state.frame = requestAnimationFrame(animatePhysicalMedia);
          } else {
            state.frame = null;
          }
        };

        const startPhysicalAnimation = () => {
          if (!state.frame) state.frame = requestAnimationFrame(animatePhysicalMedia);
        };

        wrapper.addEventListener('pointerenter', () => {
          wrapper.classList.add('is-physical-active');
          if (state.scale !== null) state.targetScale = config.hoverScale;
          startPhysicalAnimation();
        });

        wrapper.addEventListener('pointermove', event => {
          const rect = wrapper.getBoundingClientRect();
          const nx = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
          const ny = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
          const pointerDx = state.pointerX ? event.clientX - state.pointerX : 0;
          const pointerDy = state.pointerY ? event.clientY - state.pointerY : 0;
          state.pointerX = event.clientX;
          state.pointerY = event.clientY;

          if (config.mode === 'oops-vision-gimbal') {
            wrapper.style.setProperty('--oops-vision-origin-x', `${((nx + 1) * 50).toFixed(1)}%`);
            wrapper.style.setProperty('--oops-vision-origin-y', `${((ny + 1) * 50).toFixed(1)}%`);
          }

          state.targetX = -nx * config.x;
          state.targetY = -ny * config.y;
          state.targetRx = -ny * config.tilt;
          state.targetRy = nx * config.tilt;
          state.targetRotate = config.mode === 'oops-elastic-follow'
            ? nx * 1.2
            : (config.mode === 'oops-vision-gimbal' ? nx * 0.25 : nx * 0.35);

          if (config.impulse) {
            state.vx += Math.max(-1.8, Math.min(1.8, -pointerDx * config.impulse));
            state.vy += Math.max(-1.4, Math.min(1.4, -pointerDy * config.impulse));
            state.vry += Math.max(-0.28, Math.min(0.28, pointerDx * config.impulse * 0.12));
          }
          startPhysicalAnimation();
        });

        wrapper.addEventListener('pointerleave', () => {
          wrapper.classList.remove('is-physical-active');
          state.targetX = 0;
          state.targetY = 0;
          state.targetRx = 0;
          state.targetRy = 0;
          state.targetRotate = 0;
          if (state.scale !== null) state.targetScale = config.baseScale;
          state.pointerX = 0;
          state.pointerY = 0;
          if (config.mode === 'oops-vision-gimbal') {
            wrapper.style.setProperty('--oops-vision-origin-x', '50%');
            wrapper.style.setProperty('--oops-vision-origin-y', '50%');
          }
          startPhysicalAnimation();
        });
      });
    });
  }

  const simpleVisionFrame = document.querySelector('body:not(.product-page) .vision-lab-card');
  const simpleVisionImage = simpleVisionFrame?.querySelector('.vision-bg-img');
  if (simpleVisionFrame && simpleVisionImage) {
    simpleVisionFrame.classList.add('oops-physical-frame', 'oops-vision-gimbal');
    simpleVisionImage.classList.add('oops-physical-media');
  }

  const teamObjectives = document.querySelector('.team-page-wrapper .team-objectives');
  if (teamObjectives) {
    teamObjectives.classList.add('oops-sequence-ready');

    if (prefersReducedMotion) {
      teamObjectives.classList.add('oops-sequence-in');
    } else {
      const teamSequenceObserver = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          teamObjectives.classList.add('oops-sequence-in');
          teamSequenceObserver.disconnect();
        }
      }, {
        rootMargin: '0px 0px -18% 0px',
        threshold: 0.18
      });

      teamSequenceObserver.observe(teamObjectives);
    }
  }

  const teamHero = document.querySelector('.team-page-wrapper .team-hero');
  const teamStickerTrail = teamHero?.querySelector('.team-sticker-trail');
  if (teamHero && teamStickerTrail && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    const teamStickerLabels = ['OOPS FINDER', 'LOOK CLOSER', 'TEAM NOTE', 'SPOTTED'];
    let teamStickerIndex = 0;
    let teamPreviousX = null;
    let teamPreviousY = null;
    let teamPreviousTime = 0;

    teamHero.addEventListener('pointermove', event => {
      const rect = teamHero.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const now = performance.now();

      if (teamPreviousX === null) {
        teamPreviousX = x;
        teamPreviousY = y;
        teamPreviousTime = now;
        return;
      }

      const dx = x - teamPreviousX;
      const dy = y - teamPreviousY;
      const distance = Math.hypot(dx, dy);
      if (distance < 92 || now - teamPreviousTime < 90) return;

      const sticker = document.createElement('span');
      const variation = teamStickerIndex % 3;
      sticker.className = `team-cursor-sticker${variation === 1 ? ' is-team-tape' : variation === 2 ? ' is-team-burst' : ''}`;
      sticker.textContent = teamStickerLabels[teamStickerIndex % teamStickerLabels.length];
      teamStickerIndex += 1;

      sticker.style.left = `${Math.max(72, Math.min(rect.width - 72, x))}px`;
      sticker.style.top = `${Math.max(62, Math.min(rect.height - 62, y))}px`;
      sticker.style.setProperty('--team-sticker-rotate', `${(-16 + Math.random() * 32).toFixed(1)}deg`);
      sticker.style.setProperty('--team-sticker-scale', (0.88 + Math.random() * 0.28).toFixed(2));
      teamStickerTrail.appendChild(sticker);

      while (teamStickerTrail.children.length > 7) {
        teamStickerTrail.firstElementChild?.remove();
      }

      sticker.addEventListener('animationend', () => sticker.remove(), { once: true });
      teamPreviousX = x;
      teamPreviousY = y;
      teamPreviousTime = now;
    }, { passive: true });

    teamHero.addEventListener('pointerleave', () => {
      teamPreviousX = null;
      teamPreviousY = null;
    });
  }

  const teamPageWrapper = document.querySelector('.team-page-wrapper');
  if (teamPageWrapper && !prefersReducedMotion) {
    const teamProblemSection = teamPageWrapper.querySelector('.team-problems');
    const teamProfiles = Array.from(teamPageWrapper.querySelectorAll('.intro-section'));
    const teamScrollSections = [teamProblemSection].filter(Boolean);

    teamProblemSection?.classList.add('team-scroll-physical');

    let teamPreviousScroll = window.scrollY;
    let teamScrollVelocity = 0;
    let teamPhysicsFrame = null;

    const updateTeamScrollPhysics = () => {
      const currentScroll = window.scrollY;
      teamScrollVelocity = teamScrollVelocity * 0.7 + (currentScroll - teamPreviousScroll) * 0.3;
      teamPreviousScroll = currentScroll;
      const velocity = Math.max(-1, Math.min(1, teamScrollVelocity / 52));

      teamScrollSections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.bottom < -160 || rect.top > window.innerHeight + 160) return;

        const viewportProgress = Math.max(-1, Math.min(1,
          (window.innerHeight * 0.5 - (rect.top + rect.height * 0.5)) /
          Math.max(window.innerHeight, rect.height)
        ));
        const direction = index % 2 === 0 ? 1 : -1;

        section.style.setProperty('--team-scroll-y', `${(velocity * 5 * direction).toFixed(2)}px`);
        section.style.setProperty('--team-scroll-rotate', `${(velocity * 0.22 * direction).toFixed(2)}deg`);

        if (section.classList.contains('team-problems')) {
          section.style.setProperty('--team-text-depth', `${(viewportProgress * -10).toFixed(2)}px`);
          section.style.setProperty('--team-problem-scale', (1.05 + Math.abs(viewportProgress) * 0.055).toFixed(4));
          section.style.setProperty('--team-problem-rotate', `${(velocity * 0.65).toFixed(2)}deg`);
          section.style.setProperty('--team-problem-x', `${(viewportProgress * 20).toFixed(2)}px`);
        }
      });

      teamScrollVelocity *= 0.78;
      teamPhysicsFrame = Math.abs(teamScrollVelocity) > 0.08
        ? requestAnimationFrame(updateTeamScrollPhysics)
        : null;
    };

    window.addEventListener('scroll', () => {
      if (!teamPhysicsFrame) teamPhysicsFrame = requestAnimationFrame(updateTeamScrollPhysics);
    }, { passive: true });

    updateTeamScrollPhysics();
  }

  const teamProfileStory = document.querySelector('.team-profile-story');
  const minseoProfile = teamProfileStory?.querySelector('.intro-minseo');
  const yuriProfile = teamProfileStory?.querySelector('.intro-yuri');
  if (teamProfileStory && minseoProfile && yuriProfile && !prefersReducedMotion) {
    let profileStoryFrame = null;
    const smoothStep = value => {
      const t = Math.max(0, Math.min(1, value));
      return t * t * (3 - 2 * t);
    };

    const updateProfileStory = () => {
      if (window.innerWidth <= 900) {
        [minseoProfile, yuriProfile].forEach(profile => {
          [
            '--profile-pointer',
            '--profile-image-opacity',
            '--profile-heading-opacity', '--profile-heading-x', '--profile-heading-y', '--profile-heading-rotate',
            '--profile-copy-opacity', '--profile-copy-x', '--profile-copy-y', '--profile-copy-rotate',
            '--profile-sticker-opacity', '--profile-sticker-scale',
            '--profile-role-opacity', '--profile-role-x', '--profile-role-y', '--profile-role-rotate'
          ]
            .forEach(name => profile.style.removeProperty(name));
        });
        profileStoryFrame = null;
        return;
      }

      const rect = teamProfileStory.getBoundingClientRect();
      const scrollRange = Math.max(1, rect.height - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -rect.top / scrollRange));
      const minseoExit = smoothStep((progress - 0.22) / 0.34);
      const yuriEnter = smoothStep((progress - 0.4) / 0.34);

      minseoProfile.style.setProperty('--profile-pointer', minseoExit > 0.7 ? 'none' : 'auto');
      yuriProfile.style.setProperty('--profile-pointer', yuriEnter > 0.45 ? 'auto' : 'none');

      minseoProfile.style.setProperty('--profile-image-opacity', (1 - minseoExit).toFixed(3));
      minseoProfile.style.setProperty('--profile-heading-opacity', (1 - minseoExit).toFixed(3));
      minseoProfile.style.setProperty('--profile-heading-x', `${(-110 * minseoExit).toFixed(2)}px`);
      minseoProfile.style.setProperty('--profile-heading-y', `${(-24 * minseoExit).toFixed(2)}px`);
      minseoProfile.style.setProperty('--profile-heading-rotate', `${(-3 * minseoExit).toFixed(2)}deg`);
      minseoProfile.style.setProperty('--profile-copy-opacity', (1 - minseoExit).toFixed(3));
      minseoProfile.style.setProperty('--profile-copy-x', `${(-80 * minseoExit).toFixed(2)}px`);
      minseoProfile.style.setProperty('--profile-copy-y', `${(42 * minseoExit).toFixed(2)}px`);
      minseoProfile.style.setProperty('--profile-copy-rotate', `${(-5 * minseoExit).toFixed(2)}deg`);
      minseoProfile.style.setProperty('--profile-sticker-opacity', (1 - minseoExit).toFixed(3));
      minseoProfile.style.setProperty('--profile-sticker-scale', (1 - minseoExit * 0.28).toFixed(3));
      minseoProfile.style.setProperty('--profile-role-opacity', (1 - minseoExit).toFixed(3));
      minseoProfile.style.setProperty('--profile-role-x', `${(70 * minseoExit).toFixed(2)}px`);
      minseoProfile.style.setProperty('--profile-role-y', `${(28 * minseoExit).toFixed(2)}px`);
      minseoProfile.style.setProperty('--profile-role-rotate', `${(7 * minseoExit).toFixed(2)}deg`);

      const yuriHidden = 1 - yuriEnter;
      yuriProfile.style.setProperty('--profile-image-opacity', yuriEnter.toFixed(3));
      yuriProfile.style.setProperty('--profile-heading-opacity', yuriEnter.toFixed(3));
      yuriProfile.style.setProperty('--profile-heading-x', `${(-110 * yuriHidden).toFixed(2)}px`);
      yuriProfile.style.setProperty('--profile-heading-y', `${(-24 * yuriHidden).toFixed(2)}px`);
      yuriProfile.style.setProperty('--profile-heading-rotate', `${(3 * yuriHidden).toFixed(2)}deg`);
      yuriProfile.style.setProperty('--profile-copy-opacity', yuriEnter.toFixed(3));
      yuriProfile.style.setProperty('--profile-copy-x', `${(80 * yuriHidden).toFixed(2)}px`);
      yuriProfile.style.setProperty('--profile-copy-y', `${(42 * yuriHidden).toFixed(2)}px`);
      yuriProfile.style.setProperty('--profile-copy-rotate', `${(5 * yuriHidden).toFixed(2)}deg`);
      yuriProfile.style.setProperty('--profile-sticker-opacity', yuriEnter.toFixed(3));
      yuriProfile.style.setProperty('--profile-sticker-scale', (0.72 + yuriEnter * 0.28).toFixed(3));
      yuriProfile.style.setProperty('--profile-role-opacity', yuriEnter.toFixed(3));
      yuriProfile.style.setProperty('--profile-role-x', `${(-70 * yuriHidden).toFixed(2)}px`);
      yuriProfile.style.setProperty('--profile-role-y', `${(28 * yuriHidden).toFixed(2)}px`);
      yuriProfile.style.setProperty('--profile-role-rotate', `${(-7 * yuriHidden).toFixed(2)}deg`);
      teamProfileStory.style.setProperty('--profile-progress', progress.toFixed(4));

      const activeProfile = progress < 0.5 ? minseoProfile : yuriProfile;
      if (teamProfileStory.dataset.activeProfile !== activeProfile.id) {
        teamProfileStory.dataset.activeProfile = activeProfile.id;
        activeProfile.classList.remove('is-profile-glitching');
        void activeProfile.offsetWidth;
        activeProfile.classList.add('is-profile-glitching');
        const activeRoleTag = activeProfile.querySelector('.role-tag');
        activeRoleTag?.addEventListener('animationend', () => {
          activeProfile.classList.remove('is-profile-glitching');
        }, { once: true });
      }

      profileStoryFrame = null;
    };

    const requestProfileStoryUpdate = () => {
      if (!profileStoryFrame) profileStoryFrame = requestAnimationFrame(updateProfileStory);
    };

    window.addEventListener('scroll', requestProfileStoryUpdate, { passive: true });
    window.addEventListener('resize', requestProfileStoryUpdate);
    updateProfileStory();
  }

  // Index hero only: cursor movement leaves short-lived stamped stickers.
  const stickerHero = document.querySelector('body:not(.product-page) .main-peeking-section');
  const stickerTrail = stickerHero?.querySelector('.oops-sticker-trail');

  if (stickerHero && stickerTrail && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    const stickerLabels = ['OOPS!', 'FOUND IT', 'FIX IT', 'LAB NOTE', 'AHA!'];
    let stickerLabelIndex = 0;
    let previousStickerX = null;
    let previousStickerY = null;
    let previousStickerTime = 0;

    stickerHero.addEventListener('pointermove', event => {
      const rect = stickerHero.getBoundingClientRect();
      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      const now = performance.now();

      if (previousStickerX === null) {
        previousStickerX = localX;
        previousStickerY = localY;
        previousStickerTime = now;
        return;
      }

      const dx = localX - previousStickerX;
      const dy = localY - previousStickerY;
      const distance = Math.hypot(dx, dy);
      if (distance < 72 || now - previousStickerTime < 70) return;

      const sticker = document.createElement('span');
      sticker.className = 'oops-cursor-sticker';
      sticker.textContent = stickerLabels[stickerLabelIndex % stickerLabels.length];
      stickerLabelIndex += 1;

      const speed = Math.min(distance / Math.max(16, now - previousStickerTime), 2.5);
      const randomScale = 0.86 + Math.random() * 0.62;
      const randomRotation = -18 + Math.random() * 36;
      const rotation = Math.max(-24, Math.min(24, dx * 0.11 + randomRotation));
      const settleX = Math.max(-10, Math.min(10, dx * 0.08));
      const settleY = Math.max(5, Math.min(13, 7 + Math.abs(dy) * 0.035 + speed));
      const randomRadius = Math.random() > 0.64
        ? '999px'
        : `${4 + Math.round(Math.random() * 14)}px`;
      const randomShadow = `${4 + Math.round(Math.random() * 6)}px`;

      sticker.style.left = `${Math.max(74, Math.min(rect.width - 74, localX))}px`;
      sticker.style.top = `${Math.max(48, Math.min(rect.height - 48, localY))}px`;
      sticker.style.setProperty('--sticker-rotate', `${rotation.toFixed(1)}deg`);
      sticker.style.setProperty('--sticker-settle-x', `${settleX.toFixed(1)}px`);
      sticker.style.setProperty('--sticker-settle-y', `${settleY.toFixed(1)}px`);
      sticker.style.setProperty('--sticker-scale', randomScale.toFixed(2));
      sticker.style.setProperty('--sticker-radius', randomRadius);
      sticker.style.setProperty('--sticker-shadow', randomShadow);
      stickerTrail.appendChild(sticker);

      while (stickerTrail.children.length > 9) {
        stickerTrail.firstElementChild?.remove();
      }

      sticker.addEventListener('animationend', () => sticker.remove(), { once: true });
      previousStickerX = localX;
      previousStickerY = localY;
      previousStickerTime = now;
    }, { passive: true });

    stickerHero.addEventListener('pointerleave', () => {
      previousStickerX = null;
      previousStickerY = null;
    });
  }

  // Features background: localized glitch follows pointer position and speed.
  const featureGlitchSection = document.querySelector('.features-fireplace-section');
  if (featureGlitchSection && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
    featureGlitchSection.classList.add('oops-feature-glitch');
    let previousFeatureX = 0;
    let previousFeatureY = 0;
    let previousFeatureTime = performance.now();
    let featureIdleTimer = null;

    featureGlitchSection.addEventListener('pointerenter', event => {
      previousFeatureX = event.clientX;
      previousFeatureY = event.clientY;
      previousFeatureTime = performance.now();
      featureGlitchSection.classList.add('is-feature-glitching');
    });

    featureGlitchSection.addEventListener('pointermove', event => {
      const rect = featureGlitchSection.getBoundingClientRect();
      const now = performance.now();
      const elapsed = Math.max(12, now - previousFeatureTime);
      const dx = event.clientX - previousFeatureX;
      const dy = event.clientY - previousFeatureY;
      const speed = Math.min(Math.hypot(dx, dy) / elapsed, 2.6);
      const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));

      featureGlitchSection.style.setProperty('--feature-glitch-x', `${x.toFixed(2)}%`);
      featureGlitchSection.style.setProperty('--feature-glitch-y', `${y.toFixed(2)}%`);
      featureGlitchSection.style.setProperty('--feature-glitch-strength', (0.22 + speed * 0.2).toFixed(2));
      const shiftX = Math.max(-12, Math.min(12, dx * 0.28));
      const shiftY = Math.max(-7, Math.min(7, dy * 0.18));
      featureGlitchSection.style.setProperty('--feature-glitch-shift-x', `${shiftX.toFixed(1)}px`);
      featureGlitchSection.style.setProperty('--feature-glitch-shift-y', `${shiftY.toFixed(1)}px`);
      featureGlitchSection.style.setProperty('--feature-glitch-shift-x-reverse', `${(-shiftX * 0.75).toFixed(1)}px`);
      featureGlitchSection.style.setProperty('--feature-glitch-shift-y-reverse', `${(-shiftY * 0.5).toFixed(1)}px`);
      featureGlitchSection.classList.add('is-feature-glitching');

      clearTimeout(featureIdleTimer);
      featureIdleTimer = setTimeout(() => {
        featureGlitchSection.classList.remove('is-feature-glitching');
        featureGlitchSection.style.setProperty('--feature-glitch-strength', '0.12');
      }, 110);

      previousFeatureX = event.clientX;
      previousFeatureY = event.clientY;
      previousFeatureTime = now;
    }, { passive: true });

    featureGlitchSection.addEventListener('pointerleave', () => {
      clearTimeout(featureIdleTimer);
      featureGlitchSection.classList.remove('is-feature-glitching');
      featureGlitchSection.style.setProperty('--feature-glitch-strength', '0');
      featureGlitchSection.style.setProperty('--feature-glitch-shift-x', '0px');
      featureGlitchSection.style.setProperty('--feature-glitch-shift-y', '0px');
      featureGlitchSection.style.setProperty('--feature-glitch-shift-x-reverse', '0px');
      featureGlitchSection.style.setProperty('--feature-glitch-shift-y-reverse', '0px');
    });
  }

  // Immersive Intro Screen Sequence (Bouncing Letters)
  const introScreen = document.getElementById('oops-intro-screen');
  if (introScreen) {
    if (sessionStorage.getItem('oopsIntroRun') === 'true') {
      introScreen.remove();
      startScrollAnimations();
    } else {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('intro-active');
      
      // Keep the bouncing letters active for 2.2 seconds (approx 2 animation cycles)
      setTimeout(() => {
        introScreen.classList.add('fade-out');
        document.body.style.overflow = '';
        document.body.classList.remove('intro-active');
        sessionStorage.setItem('oopsIntroRun', 'true');
        
        // Start scroll animations as the intro screen fades out
        startScrollAnimations();
        
        setTimeout(() => {
          introScreen.remove();
        }, 800);
      }, 2200);
    }
  } else {
    // If no intro screen on the page (other pages), start animations immediately
    startScrollAnimations();
  }

});
