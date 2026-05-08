'use client';

import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current!;
    const ring = ringRef.current!;
    let rx = 0,
      ry = 0,
      dx = 0,
      dy = 0;
    let mouseX = 0,
      mouseY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const onEnter = () => {
      ring.style.width = '64px';
      ring.style.height = '64px';
      ring.style.borderColor = 'rgba(154, 208, 61, 0.95)';
    };
    const onLeave = () => {
      ring.style.width = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'rgba(118, 185, 0, 0.5)';
    };

    document.addEventListener('mousemove', onMove);
    document
      .querySelectorAll('a, button, [data-hover]')
      .forEach((el) => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });

    let rafId = 0;
    const tick = () => {
      dx += (mouseX - dx) * 0.5;
      dy += (mouseY - dy) * 0.5;
      rx += (mouseX - rx) * 0.15;
      ry += (mouseY - ry) * 0.15;
      dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
