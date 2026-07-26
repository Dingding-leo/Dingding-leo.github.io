import Link from 'next/link';
import { Nav } from '@/components/Site';

const suggestions = [
  { label: 'Home', href: '/', copy: 'Start from the top.' },
  { label: 'Projects', href: '/projects', copy: 'KnightClub, ScholarBank, Denki.' },
  { label: 'Notes', href: '/notes', copy: 'Field notes and travel chapters.' },
  { label: 'Moments', href: '/moments', copy: 'Photos worth keeping.' },
];

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main-content" className="not-found">
        <p className="eyebrow">404 / lost in the notes</p>
        <h1>This page took a quiet walk.</h1>
        <p>
          The address doesn&apos;t match anything here — but the good parts of
          the site are one click away.
        </p>
        <div className="not-found-links">
          {suggestions.map((item) => (
            <Link key={item.href} href={item.href} className="not-found-link">
              <strong>{item.label}</strong>
              <span>{item.copy}</span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
