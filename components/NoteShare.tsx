'use client';

import { useEffect, useState } from 'react';
import { Check, Copy, Share2 } from 'lucide-react';
import jumpStyles from '@/components/BlueHourJumpShell.module.css';

export function NoteShare({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  const copyLink = async () => {
    if (!navigator.clipboard) return;

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const share = async () => {
    try {
      await navigator.share({ title, url: window.location.href });
    } catch {
      // The native share sheet may be dismissed without completing.
    }
  };

  return (
    <div className={jumpStyles.articleShare}>
      <button type="button" onClick={copyLink}>
        {copied ? <Check size={15} /> : <Copy size={15} />}
        <span aria-live="polite">{copied ? 'Link copied' : 'Copy link'}</span>
      </button>
      {canShare && (
        <button type="button" onClick={share}>
          <Share2 size={15} />
          <span>Share</span>
        </button>
      )}
    </div>
  );
}
