document.addEventListener('DOMContentLoaded', () => {
  // Add scroll animations for sections
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
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
    '.problem-header',
    '.problem-card',
    '.features-container h2',
    '.feature-card',
    '.step-card',
    '.profile-card',
    '.goal-card'
  ];

  // We can dynamically add CSS rules for the animations if they aren't in style.css
  const style = document.createElement('style');
  style.textContent = `
    .animate-up {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.6s ease, transform 0.6s ease;
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
      // Add slight delay for grid items
      if (el.classList.contains('problem-card') || el.classList.contains('feature-card') || el.classList.contains('step-card') || el.classList.contains('profile-card') || el.classList.contains('goal-card')) {
        el.style.transitionDelay = `${index * 0.1}s`;
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
});
