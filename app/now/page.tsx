import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BookOpen,
  Braces,
  CandlestickChart,
  Languages,
  Stethoscope,
} from 'lucide-react';
import { BlueHourHero } from '@/components/BlueHourJumpShell';
import styles from '@/components/BlueHourJumpShell.module.css';
import { Nav } from '@/components/Nav';

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
    <div className={styles.shell}>
      <Nav />
      <main id="main-content" className={styles.page}>
        <BlueHourHero
          scene="afterlight"
          kicker="20:19 · One Window Left / Now"
          title="One window left on."
          copy="The current season, without pretending it is the whole story."
        />

        <div className={`container ${styles.content}`}>
          <section
            className={`${styles.surface} ${styles.nowCard}`}
            aria-labelledby="now-heading"
          >
            <p id="now-heading" className={styles.nowUpdated}>
              July 2026 · Adelaide
            </p>
            <ul className={styles.nowList}>
              {currentThreads.map(({ label, copy, icon: Icon }) => (
                <li key={label}>
                  <span className={styles.nowIcon}>
                    <Icon size={17} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{label}</strong> — {copy}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className="container">
          <span>© 2026 Austin Liu</span>
          <Link href="/#afterlight">Return to the last blue hour</Link>
        </div>
      </footer>
    </div>
  );
}
