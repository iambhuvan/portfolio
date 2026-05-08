'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';

export default function ScrollCamera() {
  const mouse = useRef({ x: 0, y: 0 });
  const { camera, size } = useThree();

  useFrame(() => {
    const mx = mouse.current.x;
    const my = mouse.current.y;
    const p = window.__scrollProgress ?? 0;
    const targetX = mx * 0.6 + Math.sin(p * Math.PI * 2) * 0.4;
    const targetY = -my * 0.6 + p * 0.6;
    const targetZ = 6 - p * 1.5;
    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  if (typeof window !== 'undefined') {
    window.onmousemove = (e) => {
      mouse.current.x = (e.clientX / size.width) * 2 - 1;
      mouse.current.y = (e.clientY / size.height) * 2 - 1;
    };
  }

  return null;
}
