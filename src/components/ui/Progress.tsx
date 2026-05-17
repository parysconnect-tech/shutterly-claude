import { cn } from '@/lib/utils';

export function Progress({
  value,
  className,
  showLabel = false,
  size = 'md'
}: {
  value: number;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}) {
  const v = Math.max(0, Math.min(100, value));
  const h = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }[size];
  return (
    <div className={cn('w-full', className)}>
      <div
        className={cn('w-full overflow-hidden rounded-full bg-muted', h)}
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all duration-500"
          style={{ width: `${v}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1.5 flex justify-between text-xs text-muted-fg">
          <span>{v}%</span>
          <span>{100 - v}% to go</span>
        </div>
      )}
    </div>
  );
}
