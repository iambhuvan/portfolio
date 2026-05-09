'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Experience from '@/components/Experience';
import Skills from '@/components/Skills';
import Contact from '@/components/Contact';
import SmoothScroll from '@/components/SmoothScroll';
import Marquee from '@/components/Marquee';

const ChipDieBackground = dynamic(() => import('@/components/ChipDieBackground'), { ssr: false });

export default function Home() {
  return (
    <SmoothScroll>
      <ChipDieBackground />
      <div className="grain" />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <Marquee />
        <About />
        <Projects />
        <Experience />
        <Skills />
        <Contact />
      </main>
    </SmoothScroll>
  );
}
