import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1495312040802-a929cd14a6ab?auto=format&fit=crop&w=1600&q=70"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-foreground/70 via-foreground/40 to-transparent" />
        <div className="relative z-10 flex h-full flex-col p-10 text-white">
          <Logo />
          <div className="mt-auto max-w-md">
            <p className="heading-display text-3xl leading-tight">
              Make the photographs that already live in your head.
            </p>
            <p className="mt-3 text-sm text-white/80">
              Free, modern photography courses with weekly challenges, interactive simulators and a South African heart.
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="container-wide flex h-16 items-center justify-between">
          <Link href="/" className="lg:invisible"><Logo /></Link>
          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle compact />
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">{children}</div>
        </div>
      </div>
    </div>
  );
}
