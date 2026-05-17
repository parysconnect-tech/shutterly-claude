import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { label?: string }
>(({ className, label, id, ...props }, ref) => {
  const autoId = React.useId();
  const checkId = id ?? autoId;
  return (
    <label htmlFor={checkId} className="inline-flex items-center gap-2.5 cursor-pointer text-sm">
      <span className="relative inline-flex">
        <input
          ref={ref}
          type="checkbox"
          id={checkId}
          className={cn('peer h-5 w-5 appearance-none rounded-md border border-border bg-background checked:bg-brand-500 checked:border-brand-500 transition', className)}
          {...props}
        />
        <Check className="pointer-events-none absolute inset-0 m-auto h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100" />
      </span>
      {label && <span className="select-none">{label}</span>}
    </label>
  );
});
Checkbox.displayName = 'Checkbox';
