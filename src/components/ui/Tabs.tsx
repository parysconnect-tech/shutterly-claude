'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TabsContextValue {
  value: string;
  set: (v: string) => void;
}
const TabsCtx = React.createContext<TabsContextValue | null>(null);

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  className,
  children
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  className?: string;
  children: React.ReactNode;
}) {
  const [internal, setInternal] = React.useState(defaultValue ?? '');
  const v = value ?? internal;
  const set = (next: string) => {
    if (!value) setInternal(next);
    onValueChange?.(next);
  };
  return (
    <TabsCtx.Provider value={{ value: v, set }}>
      <div className={className}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabsList({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex h-11 items-center justify-center rounded-full bg-muted p-1 text-sm',
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children
}: {
  value: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(TabsCtx)!;
  const active = ctx.value === value;
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={() => ctx.set(value)}
      className={cn(
        'inline-flex h-9 items-center justify-center whitespace-nowrap rounded-full px-4 transition-all',
        active ? 'bg-card text-foreground shadow-soft' : 'text-muted-fg hover:text-foreground'
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(TabsCtx)!;
  if (ctx.value !== value) return null;
  return <div className={cn('mt-6', className)}>{children}</div>;
}
