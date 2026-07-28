import Link from 'next/link';
import { BlueHourPicture } from '@/components/BlueHourJumpShell';
import styles from '@/components/BlueHourJumpShell.module.css';
import { Nav } from '@/components/Nav';

const suggestions = [
  { label: 'Home', href: '/', copy: 'Start from the top.' },
  { label: 'Projects', href: '/projects', copy: 'KnightClub, ScholarBank, Denki.' },
  { label: 'Notes', href: '/notes', copy: 'Field notes and travel chapters.' },
  { label: 'Moments', href: '/moments', copy: 'Photos worth keeping.' },
];

export default function NotFound() {
  return (
    <div className={styles.shell}>
      <Nav />
      <main id="main-content" className={styles.notFound}>
        <BlueHourPicture scene="lighthouse" />
        <div className={styles.notFoundInner}>
          <p className={styles.kicker}>19:31 · Lost at the beacon / 404</p>
          <h1>This page took a quiet walk.</h1>
          <p className={styles.notFoundCopy}>
            The address doesn&apos;t match anything here — but the good parts of
            the site are one click away.
          </p>
          <div className={styles.suggestions}>
            {suggestions.map((item) => (
              <Link key={item.href} href={item.href} className={styles.suggestion}>
                <strong>{item.label}</strong>
                <span>{item.copy}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
