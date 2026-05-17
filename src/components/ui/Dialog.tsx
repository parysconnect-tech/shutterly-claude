'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md'
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const widths = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className={cn(
              'relative z-10 w-full rounded-t-3xl sm:rounded-3xl bg-card border border-border shadow-soft',
              widths[size]
            )}
            role="dialog"
            aria-modal
          >
            {(title || description) && (
              <div className="p-6 pb-2">
                {title && <h2 className="heading-display text-xl">{title}</h2>}
                {description && (
                  <p className="mt-1 text-sm text-muted-fg">{description}</p>
                )}
              </div>
            )}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-fg hover:bg-muted"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="p-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
