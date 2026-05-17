import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { ShieldCheck, ListChecks, BookOpen, Trophy, Users, Settings } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const items = [
    { href: '/admin', icon: ShieldCheck, label: 'Overview' },
    { href: '/admin/setup-wizard', icon: ListChecks, label: 'Launch wizard' },
    { href: '/admin/courses', icon: BookOpen, label: 'Courses' },
    { href: '/admin/challenges', icon: Trophy, label: 'Challenges' },
    { href: '/admin/users', icon: Users, label: 'Users' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 border-r border-border bg-card/30 md:block">
          <nav className="flex flex-col gap-1 p-4">
            {items.map((it) => (
              <Link
                key={it.href}
                href={it.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted-fg hover:bg-muted hover:text-foreground"
              >
                <it.icon className="h-4 w-4" />
                {it.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10">{children}</main>
      </div>
    </div>
  );
}
