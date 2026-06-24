/**
 * Route: /inkspire-cinematic-home
 *
 * Isolated experimental cinematic homepage for Inkspire.
 * Safe to merge into production homepage later — does not
 * touch or modify any existing routes or components.
 *
 * Brand: Inkspire — from ink, invention, sketches, and old plans
 *        into modern inspiration and creative systems.
 *
 * Future brand line: "from inkspire we make people inspire"
 */

import type { Metadata } from 'next';
// ── CSS must be imported from the Server Component page, not from a client component ──
import '@/styles/inkspire-cinematic-home.css';
import { InkspireCinematicHome } from '@/components/inkspire-home/InkspireCinematicHome';

export const metadata: Metadata = {
  title: 'Inkspire — Cinematic Experience',
  description:
    'A scroll-driven cinematic visual experience by Inkspire. ' +
    'From ink, invention, and old plans into modern creative systems.',
  robots: {
    index: false,  // experimental route — keep out of search engines for now
    follow: false,
  },
};

export default function InkspireCinematicHomePage() {
  return <InkspireCinematicHome />;
}
