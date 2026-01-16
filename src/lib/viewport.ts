export function setStableViewportHeight() {
  if (typeof window === 'undefined') return;

  let resizeTimeout: ReturnType<typeof setTimeout>;

  const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  // Set initial value
  setVh();

  // Handle orientation change
  window.addEventListener('orientationchange', () => {
    setTimeout(setVh, 100);
  });

  // Handle resize with debounce to prevent excessive updates
  // This helps with landscape mobile and window resizing
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(setVh, 100);
  });
}
