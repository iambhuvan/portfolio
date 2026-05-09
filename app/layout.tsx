import type { Metadata } from 'next';
import { Inter, Instrument_Serif, JetBrains_Mono, Cormorant_Garamond, Fraunces, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal'],
  variable: '--font-inter',
  display: 'swap',
});

const display = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://iambhuvan.github.io/portfolio';

export const metadata: Metadata = {
  title: 'Bhuvan Nallamothu — AI Inference Researcher',
  description:
    'Carnegie Mellon graduate researcher engineering inference for diffusion and language models — CUDA kernels, NKI for Trainium, recursive LM scaffolds, long-tail synthesis for driving VLMs.',
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: '/' },
  authors: [{ name: 'Bhuvan Nallamothu', url: 'https://github.com/iambhuvan' }],
  creator: 'Bhuvan Nallamothu',
  keywords: [
    'AI inference', 'diffusion models', 'CUDA', 'Triton', 'Flash Attention',
    'NVIDIA', 'CMU', 'machine learning systems', 'recursive language models',
    'Bhuvan Nallamothu',
  ],
  openGraph: {
    title: 'Bhuvan Nallamothu — AI Inference Researcher',
    description: 'CMU graduate researcher · diffusion inference · CUDA kernels · recursive LMs',
    url: SITE_URL,
    siteName: 'Bhuvan Nallamothu',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bhuvan Nallamothu',
    description: 'AI inference researcher · CMU',
    creator: '@NallamothuBhuv2',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} ${mono.variable} ${cormorant.variable} ${fraunces.variable} ${playfair.variable}`}>
      <body>{children}</body>
    </html>
  );
}
