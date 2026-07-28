'use client';

import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
    href: `/projects?project=${project.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')}`,
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
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [palette, setPalette] = useState(false);
  const [query, setQuery] = useState('');
  const [hash, setHash] = useState('');
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const paletteTriggerRef = useRef<HTMLElement | null>(null);
  const paletteScrollRef = useRef(0);

  const closePalette = useCallback((restoreFocus = true) => {
    setPalette(false);
    setQuery('');
    if (restoreFocus) {
      window.requestAnimationFrame(() => {
        window.scrollTo({
          top: paletteScrollRef.current,
          left: 0,
          behavior: 'auto',
        });
        const trigger = paletteTriggerRef.current;
        const fallback = [searchButtonRef.current, menuButtonRef.current].find(
          (node) => Boolean(node?.getClientRects().length),
        );
        (trigger?.isConnected ? trigger : fallback)?.focus({
          preventScroll: true,
        });
      });
    }
  }, []);

  const closeMobile = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => menuButtonRef.current?.focus());
    }
  }, []);

  const openPalette = useCallback(() => {
    const activeElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    paletteTriggerRef.current = open
      ? menuButtonRef.current
      : activeElement && activeElement !== document.body
        ? activeElement
        : [searchButtonRef.current, menuButtonRef.current].find((node) =>
            Boolean(node?.getClientRects().length),
          ) ?? null;
    paletteScrollRef.current = window.scrollY;
    setOpen(false);
    setPalette(true);
  }, [open]);

  useEffect(() => {
    const updateHash = () => setHash(window.location.hash);
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openPalette();
        return;
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
        openPalette();
        return;
      }
      if (event.key === 'Escape') {
        if (palette) {
          closePalette();
        } else if (open) {
          closeMobile();
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
  }, [closeMobile, closePalette, open, openPalette, palette]);

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => {
      mobileNavRef.current
        ?.querySelector<HTMLElement>('a[href], button:not([disabled])')
        ?.focus();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const focusable = [
        menuButtonRef.current,
        ...(mobileNavRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled])',
        ) ?? []),
      ].filter((item): item is HTMLElement => Boolean(item));
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

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open && !palette) return;
    const previousOverflow = document.body.style.overflow;
    const backgroundNodes = [
      ...document.querySelectorAll<HTMLElement>(
        'main, footer, [data-blue-hour-audio-root]',
      ),
    ].map((node) => ({
      node,
      inert: node.inert,
      ariaHidden: node.getAttribute('aria-hidden'),
    }));
    document.body.style.overflow = 'hidden';
    backgroundNodes.forEach(({ node }) => {
      node.inert = true;
      node.setAttribute('aria-hidden', 'true');
    });
    return () => {
      document.body.style.overflow = previousOverflow;
      backgroundNodes.forEach(({ node, inert, ariaHidden }) => {
        node.inert = inert;
        if (ariaHidden === null) {
          node.removeAttribute('aria-hidden');
        } else {
          node.setAttribute('aria-hidden', ariaHidden);
        }
      });
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
    const [rawPath, rawHash] = item.href.split('#');
    const targetPath = normalisePath(rawPath || '/');

    if (rawHash) {
      return currentPath === targetPath && hash === `#${rawHash}`;
    }
    if (targetPath === '/') {
      return currentPath === '/' && hash !== '#contact';
    }
    return (
      currentPath === targetPath ||
      currentPath.startsWith(`${targetPath}/`)
    );
  };

  const navigate = (item: Pick<SearchItem, 'href'>) => {
    closePalette(false);
    const requestedProject = new URL(item.href, window.location.href).searchParams.get(
      'project',
    );
    if (requestedProject) {
      window.dispatchEvent(
        new CustomEvent('project-deck-select', {
          detail: requestedProject,
        }),
      );
    }
    router.push(item.href);
  };

  const chooseSearchResult = (item: SearchItem) => {
    const requestedProject = new URL(item.href, window.location.href).searchParams.get(
      'project',
    );
    if (requestedProject) {
      window.dispatchEvent(
        new CustomEvent('project-deck-select', {
          detail: requestedProject,
        }),
      );
    }
    closePalette(false);
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
        <Link href="/" className="brand" aria-label="Austin Liu — home">
          AL<span>•</span>
        </Link>
        <nav aria-label="Primary navigation">
          {site.nav.map((item) => (
            <Link
              className={isActive(item) ? 'active' : ''}
              key={item.label}
              href={item.href}
              aria-current={isActive(item) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            ref={searchButtonRef}
            className="command"
            type="button"
            onClick={openPalette}
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
            onClick={() => (open ? closeMobile() : setOpen(true))}
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? (
              <X size={19} aria-hidden="true" />
            ) : (
              <Menu size={19} aria-hidden="true" />
            )}
          </button>
        </div>
      </header>

      {open && (
        <>
          <div
            className="mobile-backdrop"
            onClick={() => closeMobile()}
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 28,
              background: 'rgba(0,0,0,.35)',
            }}
          />
          <nav
            ref={mobileNavRef}
            id="mobile-navigation"
            className="mobile-nav"
            aria-label="Mobile navigation"
          >
            <button
              className="mobile-search"
              type="button"
              onClick={openPalette}
            >
              <Search size={16} aria-hidden="true" />
              <span>Search this journal</span>
              <kbd>⌘K</kbd>
            </button>
            {site.nav.map((item) => (
              <Link
                className={isActive(item) ? 'active' : ''}
                onClick={() => closeMobile(false)}
                key={item.label}
                href={item.href}
                aria-current={isActive(item) ? 'page' : undefined}
              >
                {item.label}
                <ChevronRight size={17} aria-hidden="true" />
              </Link>
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
                      <Link
                        className={isActive(item) ? 'active' : ''}
                        key={`${group}-${item.href}-${item.label}`}
                        href={item.href}
                        onClick={() => chooseSearchResult(item)}
                      >
                        <span>{item.label}</span>
                        {item.hint ? (
                          <small className="palette-hint">{item.hint}</small>
                        ) : (
                          <ArrowUpRight size={16} aria-hidden="true" />
                        )}
                      </Link>
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
