export function setStableViewportHeight() {
  if (typeof window === 'undefined') return;

  const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  setVh();
  window.addEventListener('orientationchange', () => {
    setTimeout(setVh, 100);
  });
}
