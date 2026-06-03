'use client';

import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';

export default function BlogShare({ title, excerpt }: { title: string; excerpt?: string | null }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, text: excerpt || title, url });
      } catch {
        /* user cancelled */
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        /* noop */
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      aria-label="Share this article"
      className="inline-flex items-center gap-2 text-slate-400 hover:text-gold transition-colors text-xs uppercase tracking-[0.2em]"
    >
      {copied ? <Check size={15} className="text-gold" /> : <Share2 size={15} />}
      <span>{copied ? 'Link copied' : 'Share'}</span>
    </button>
  );
}
