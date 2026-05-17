import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeStyles = cva(
  'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
  {
    variants: {
      tone: {
        default: 'bg-muted text-foreground ring-border',
        brand: 'bg-brand-100 text-brand-800 ring-brand-300 dark:bg-brand-900/40 dark:text-brand-200 dark:ring-brand-800',
        accent: 'bg-accent-100 text-accent-800 ring-accent-300 dark:bg-accent-900/40 dark:text-accent-200 dark:ring-accent-800',
        success: 'bg-emerald-100 text-emerald-800 ring-emerald-300 dark:bg-emerald-900/40 dark:text-emerald-200 dark:ring-emerald-800',
        warning: 'bg-amber-100 text-amber-800 ring-amber-300 dark:bg-amber-900/40 dark:text-amber-200 dark:ring-amber-800',
        danger: 'bg-rose-100 text-rose-800 ring-rose-300 dark:bg-rose-900/40 dark:text-rose-200 dark:ring-rose-800'
      }
    },
    defaultVariants: { tone: 'default' }
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeStyles> {}

export function Badge({ tone, className, ...props }: BadgeProps) {
  return <span className={cn(badgeStyles({ tone }), className)} {...props} />;
}
