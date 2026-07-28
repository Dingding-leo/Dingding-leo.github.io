'use client';

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { usePathname } from 'next/navigation';
import {
  ArrowUpRight,
  ChevronRight,
  Menu,
  Search,
  X,
} from 'lucide-react';
import { projects, site, type NavItem } from '@/config/site';
import { notes } from '@/config/notes';

type SearchItem = {
  label: string;
  href: string;
  group: 'Pages' | 'Notes' | 'Projects';
  hint?: string;
  keywords?: string;
};

const searchGroups: SearchItem['group'][] = ['Pages', 'Notes', 'Projects'];

const searchIndex: SearchItem[] = [
  ...site.nav.map((item) => ({
    label: item.label,
    href: item.href,
    group: 'Pages' as const,
  })),
  ...notes.map((note) => ({
    label: note.title,
    href: `/notes/${note.slug}`,
    group: 'Notes' as const,
    hint: note.label,
    keywords: [note.localTitle, note.excerpt, note.label, note.dateLabel]
      .filter(Boolean)
      .join(' '),
  })),
  ...projects.map((project) => ({
    label: project.title,
    href: '/projects',
    group: 'Projects' as const,
    hint: project.status,
    keywords: [project.tagline, project.tags.join(' ')].join(' '),
  })),
];

function normalisePath(path: string) {
  if (path === '/') return '/';
  return path.replace(/\/+$/, '');
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState(false);
  const [query, setQuery] = useState('');
  const [hash, setHash] = useState('');
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closePalette = useCallback((restoreFocus = true) => {
    setPalette(false);
    setQuery('');
    if (restoreFocus) {
      window.requestAnimationFrame(() => searchButtonRef.current?.focus());
    }
  }, []);

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setPalette(true);
      }
      if (
        event.key === '/' &&
        !event.metaKey &&
        !event.ctrlKey &&
        !(event.target instanceof HTMLElement &&
          (event.target.tagName === 'INPUT' ||
            event.target.tagName === 'TEXTAREA' ||
            event.target.isContentEditable))
      ) {
        event.preventDefault();
        setPalette(true);
      }
      if (event.key === 'Escape') {
        if (palette) closePalette();
        if (open) {
          setOpen(false);
          window.requestAnimationFrame(() => menuButtonRef.current?.focus());
        }
      }
    };

    updateHash();
    window.addEventListener('hashchange', updateHash);
    window.addEventListener('popstate', updateHash);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('hashchange', updateHash);
      window.removeEventListener('popstate', updateHash);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [closePalette, open, palette]);

  useEffect(() => {
    if (!open && !palette) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open, palette]);

  const filteredNav = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return searchIndex.filter((item) => item.group === 'Pages');
    return searchIndex.filter((item) =>
      [item.label, item.hint, item.keywords]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(value),
    );
  }, [query]);

  const isActive = (item: Pick<NavItem, 'href'>) => {
    const currentPath = normalisePath(pathname || '/');
    if (item.href === '/#contact') {
      return currentPath === '/' && hash === '#contact';
    }
    if (item.href === '/') {
      return currentPath === '/' && hash !== '#contact';
    }
    return currentPath === normalisePath(item.href);
  };

  const navigate = (item: NavItem) => {
    closePalette(false);
    window.location.href = item.href;
  };

  const trapDialogFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && document.activeElement?.tagName === 'INPUT') {
      const firstResult = filteredNav[0];
      if (firstResult) navigate(firstResult);
      return;
    }
    if (event.key !== 'Tab') return;

    const focusable = [
      ...event.currentTarget.querySelectorAll<HTMLElement>(
        'input, a[href], button:not([disabled])',
      ),
    ];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="nav">
        <a href="/" className="brand" aria-label="Austin Liu — home">
          AL<span>•</span>
        </a>
        <nav aria-label="Primary navigation">
          {site.nav.map((item) => (
            <a
              className={isActive(item) ? 'active' : ''}
              key={item.label}
              href={item.href}
              aria-current={isActive(item) ? 'page' : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            ref={searchButtonRef}
            className="command"
            type="button"
            onClick={() => setPalette(true)}
            aria-haspopup="dialog"
            aria-expanded={palette}
          >
            <Search size={15} aria-hidden="true" />
            <span>Search</span>
            <kbd>⌘K</kbd>
          </button>
          <button
            ref={menuButtonRef}
            className="icon-button mobile-only"
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </header>

      {open && (
        <>
          <div
            className="mobile-backdrop"
            onClick={() => setOpen(false)}
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 28,
              background: 'rgba(0,0,0,.35)',
              backdropFilter: 'blur(3px)',
            }}
          />
          <nav
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile navigation"
          >
            {site.nav.map((item) => (
              <a
                className={isActive(item) ? 'active' : ''}
                onClick={() => setOpen(false)}
                key={item.label}
                href={item.href}
                aria-current={isActive(item) ? 'page' : undefined}
              >
                {item.label}
                <ChevronRight size={17} aria-hidden="true" />
              </a>
            ))}
          </nav>
        </>
      )}

      {palette && (
        <div className="palette-backdrop" onClick={() => closePalette()}>
          <div
            className="palette"
            role="dialog"
            aria-modal="true"
            aria-label="Search pages, notes, and projects"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={trapDialogFocus}
          >
            <div className="palette-search">
              <Search size={18} aria-hidden="true" />
              <label className="sr-only" htmlFor="site-search">
                Search pages
              </label>
              <input
                id="site-search"
                autoFocus
                value={query}
                placeholder="Search pages, notes, projects..."
                onChange={(event) => setQuery(event.target.value)}
              />
              <button
                className="palette-close"
                type="button"
                onClick={() => closePalette()}
                aria-label="Close search"
              >
                ESC
              </button>
            </div>
            <div className="palette-results" aria-live="polite">
              {searchGroups.map((group) => {
                const items = filteredNav.filter((item) => item.group === group);
                if (!items.length) return null;
                return (
                  <Fragment key={group}>
                    {query.trim() !== '' && (
                      <p className="palette-group">{group}</p>
                    )}
                    {items.map((item) => (
                      <a
                        className={isActive(item) ? 'active' : ''}
                        key={`${group}-${item.href}-${item.label}`}
                        href={item.href}
                        onClick={() => closePalette(false)}
                      >
                        <span>{item.label}</span>
                        {item.hint ? (
                          <small className="palette-hint">{item.hint}</small>
                        ) : (
                          <ArrowUpRight size={16} aria-hidden="true" />
                        )}
                      </a>
                    ))}
                  </Fragment>
                );
              })}
              {!filteredNav.length && (
                <p className="palette-empty">
                  No matches. Try “notes”, a place, or a project name.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
