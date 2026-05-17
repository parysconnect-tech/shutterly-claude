'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonStyles = cva(
  'inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 select-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-focus active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-brand-500 text-brand-fg hover:bg-brand-600 shadow-soft hover:shadow-ring',
        secondary:
          'bg-foreground text-background hover:bg-foreground/85',
        outline:
          'border border-border bg-transparent hover:bg-muted',
        ghost: 'hover:bg-muted',
        link: 'underline-offset-4 hover:underline text-brand-600 dark:text-brand-300',
        danger: 'bg-danger text-white hover:bg-danger/90'
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-7 text-base',
        icon: 'h-10 w-10 p-0'
      }
    },
    defaultVariants: { variant: 'primary', size: 'md' }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {
  loading?: boolean;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonStyles({ variant, size }), className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
