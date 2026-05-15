'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

const CustomScrollbar: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [thumbTop, setThumbTop] = useState(0);
  const [thumbHeight, setThumbHeight] = useState(40);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartScrollRatio = useRef(0);

  const getMetrics = useCallback(() => {
    const viewportH = window.innerHeight;
    const documentH = document.documentElement.scrollHeight;
    const trackH = trackRef.current?.clientHeight ?? viewportH;
    const thumbH = Math.max(Math.round((viewportH / documentH) * trackH), 30);
    return { viewportH, documentH, trackH, thumbH };
  }, []);

  const syncThumb = useCallback((scrollY?: number) => {
    const { viewportH, documentH, trackH, thumbH } = getMetrics();
    setThumbHeight(thumbH);
    const y = scrollY ?? window.scrollY;
    const maxScroll = Math.max(documentH - viewportH, 1);
    const ratio = Math.min(y / maxScroll, 1);
    setThumbTop(Math.round(ratio * (trackH - thumbH)));
  }, [getMetrics]);

  useEffect(() => {
    syncThumb();

    const lenis = (window as any).lenis;
    const onLenisScroll = ({ scroll }: { scroll: number }) => syncThumb(scroll);
    if (lenis?.on) lenis.on('scroll', onLenisScroll);

    const onScroll = () => syncThumb();
    const onResize = () => syncThumb();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      if (lenis?.off) lenis.off('scroll', onLenisScroll);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [syncThumb]);

  const beginDrag = useCallback((clientY: number) => {
    const { viewportH, documentH } = getMetrics();
    const maxScroll = Math.max(documentH - viewportH, 1);
    isDragging.current = true;
    dragStartY.current = clientY;
    dragStartScrollRatio.current = window.scrollY / maxScroll;
    document.body.style.userSelect = 'none';
  }, [getMetrics]);

  const moveDrag = useCallback((clientY: number) => {
    if (!isDragging.current) return;
    const { viewportH, documentH, trackH, thumbH } = getMetrics();
    const maxThumbTravel = Math.max(trackH - thumbH, 1);
    const delta = clientY - dragStartY.current;
    const newRatio = Math.max(0, Math.min(1, dragStartScrollRatio.current + delta / maxThumbTravel));
    const targetScroll = newRatio * (documentH - viewportH);
    const lenis = (window as any).lenis;
    if (lenis?.scrollTo) {
      lenis.scrollTo(targetScroll, { immediate: true });
    } else {
      window.scrollTo({ top: targetScroll });
    }
  }, [getMetrics]);

  const endDrag = useCallback(() => {
    isDragging.current = false;
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => moveDrag(e.clientY);
    const onMouseUp = () => endDrag();
    const onTouchMove = (e: TouchEvent) => {
      if (isDragging.current) e.preventDefault();
      moveDrag(e.touches[0].clientY);
    };
    const onTouchEnd = () => endDrag();

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onTouchEnd);
    };
  }, [moveDrag, endDrag]);

  return (
    <div
      ref={trackRef}
      className="fixed top-0 right-1 hidden md:block z-40 group"
      style={{ width: '4px', height: '100vh' }}
      aria-hidden="true"
    >
      {/* Track */}
      <div className="rounded-full bg-white/5 group-hover:bg-white/10 h-full w-full transition-colors duration-300" />
      {/* Thumb */}
      <div
        className="rounded-full bg-gold/50 hover:bg-gold/80 absolute w-full cursor-grab active:cursor-grabbing transition-colors duration-300"
        style={{ top: thumbTop, height: thumbHeight }}
        onMouseDown={(e) => { e.preventDefault(); beginDrag(e.clientY); }}
        onTouchStart={(e) => { e.preventDefault(); beginDrag(e.touches[0].clientY); }}
      />
    </div>
  );
};

export default CustomScrollbar;
