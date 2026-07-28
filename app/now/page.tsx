import type { Metadata } from 'next';
import {
  BookOpen,
  Braces,
  CandlestickChart,
  Languages,
  Stethoscope,
} from 'lucide-react';
import { Container, Nav } from '@/components/Site';

export const metadata: Metadata = {
  title: 'Now — Austin Liu',
  description:
    'What Austin is studying, building, reading, and learning in Adelaide right now.',
};

const currentThreads = [
  {
    label: 'Studying',
    copy: 'Third-year dentistry at the University of Adelaide, with clinics and OSCEs on the near horizon.',
    icon: Stethoscope,
  },
  {
    label: 'Building',
    copy: 'KnightClub, ScholarBank, Denki, and this evolving corner of the internet.',
    icon: Braces,
  },
  {
    label: 'Exploring',
    copy: 'Systematic crypto strategies, walk-forward validation, and what survives contact with real data.',
    icon: CandlestickChart,
  },
  {
    label: 'Reading',
    copy: 'Systems thinking, decision-making, design, and the quiet mechanics of compounding.',
    icon: BookOpen,
  },
  {
    label: 'Learning',
    copy: 'Japanese—slowly, deliberately, and without pretending that progress is linear.',
    icon: Languages,
  },
];

export default function Page() {
  return (
    <>
      <Nav />
      <main id="main-content" className="legacy-page">
        <section className="legacy-hero">
          <Container>
            <p className="eyebrow">Now / 20:19</p>
            <h1>One window left on.</h1>
            <p className="lede">
              The current season, without pretending it is the whole story.
            </p>
          </Container>
        </section>

        <Container className="legacy-content">
          <section className="legacy-now" aria-labelledby="now-heading">
            <p id="now-heading" className="now-updated">
              July 2026 · Adelaide
            </p>
            <ul>
              {currentThreads.map(({ label, copy, icon: Icon }) => (
                <li key={label}>
                  <Icon size={18} aria-hidden="true" />
                  <span>
                    <strong>{label}</strong> — {copy}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </Container>
      </main>

      <footer className="legacy-footer">
        <Container>
          <span>© 2026 Austin Liu</span>
          <a href="/projects">See what I&apos;m building</a>
        </Container>
      </footer>
    </>
  );
}
