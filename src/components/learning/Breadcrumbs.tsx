import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-muted-fg">
      {items.map((it, i) => (
        <span key={i} className="inline-flex items-center gap-1">
          {it.href ? (
            <Link href={it.href} className="hover:text-foreground">{it.label}</Link>
          ) : (
            <span className="text-foreground">{it.label}</span>
          )}
          {i < items.length - 1 && <ChevronRight className="h-3 w-3" />}
        </span>
      ))}
    </nav>
  );
}
