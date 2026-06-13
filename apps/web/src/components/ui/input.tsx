import { type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-11 w-full rounded-xl border border-edren-border bg-edren-surface px-3 text-sm text-edren-text outline-none transition-colors placeholder:text-edren-text-muted focus:border-edren-green focus:ring-2 focus:ring-edren-green/15',
        className,
      )}
      {...props}
    />
  );
}
