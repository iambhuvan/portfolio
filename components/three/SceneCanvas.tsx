'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import HeroOrb from './HeroOrb';
import ParticleField from './ParticleField';
import ScrollCamera from './ScrollCamera';

export default function SceneCanvas() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 6], fov: 45 }}
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#070403']} />
          <fog attach="fog" args={['#070403', 6, 22]} />
          <ambientLight intensity={0.15} />
          <pointLight position={[5, 5, 5]} intensity={2.5} color="#ff7a18" />
          <pointLight position={[-5, -3, -5]} intensity={1.2} color="#f5b100" />
          <ParticleField count={2400} />
          <HeroOrb />
          <ScrollCamera />
        </Suspense>
      </Canvas>
    </div>
  );
}
