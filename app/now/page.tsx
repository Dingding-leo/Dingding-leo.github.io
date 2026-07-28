import Link from 'next/link';
import {
  ArrowUpRight,
  BookOpen,
  Braces,
  CandlestickChart,
  Camera,
  Languages,
  Stethoscope,
} from 'lucide-react';
import { BlueHourHero } from '@/components/BlueHourJumpShell';
import styles from '@/components/BlueHourJumpShell.module.css';
import { Nav } from '@/components/Nav';
import { pageMetadata } from '@/config/pageMetadata';

export const metadata = pageMetadata({
  title: 'Now — Austin Liu',
  description:
    'What Austin is studying, building, reading, and learning in Adelaide right now.',
  image: '/assets/blue-hour/afterlight-1200.jpg',
  imageAlt: 'A small stone cabin with one warm window on a blue moor',
});

const currentThreads = [
  {
    label: 'Building',
    copy: 'KnightClub is live, ScholarBank is in public beta, and Denki is becoming a calmer offline review tool.',
    icon: Braces,
    href: '/projects',
  },
  {
    label: 'Photographing',
    copy: 'Editing a seven-place visual journal from Adelaide, Melbourne, China, tropical Queensland, and the coast.',
    icon: Camera,
    href: '/moments',
  },
  {
    label: 'Studying',
    copy: 'Third-year dentistry at the University of Adelaide, with clinics and OSCEs on the near horizon.',
    icon: Stethoscope,
  },
  {
    label: 'Exploring',
    copy: 'Systematic crypto strategies, walk-forward validation, and what survives contact with real data.',
    icon: CandlestickChart,
  },
  {
    label: 'Reading',
    copy: 'A small shelf of systems thinking, design, fiction, and films that leave something behind.',
    icon: BookOpen,
    href: '/library',
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
      <main id="main-content" className={styles.page} tabIndex={-1}>
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
              {currentThreads.map(({ label, copy, icon: Icon, href }) => (
                <li key={label}>
                  <span className={styles.nowIcon}>
                    <Icon size={17} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{label}</strong> — {copy}
                    {href && (
                      <Link href={href} className={styles.nowThreadLink}>
                        Open <ArrowUpRight size={12} aria-hidden="true" />
                      </Link>
                    )}
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
