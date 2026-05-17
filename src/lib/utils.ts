import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelative(date: Date | string, locale = 'en') {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diff = (Date.now() - d.getTime()) / 1000;
  const rtf = new Intl.RelativeTimeFormat(locale === 'af' ? 'af' : 'en', { numeric: 'auto' });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['week', 60 * 60 * 24 * 7],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
    ['second', 1]
  ];
  for (const [unit, secs] of units) {
    if (Math.abs(diff) >= secs) {
      return rtf.format(-Math.round(diff / secs), unit);
    }
  }
  return rtf.format(0, 'second');
}

export function readingTime(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export function percent(part: number, whole: number) {
  if (!whole) return 0;
  return Math.min(100, Math.round((part / whole) * 100));
}
