import * as React from 'react';

import { cn } from '@/shared/lib/cn';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'text', ...rest }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        'flex w-full bg-transparent text-b2 text-ink-primary placeholder:text-ink-subtitle',
        'focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...rest}
    />
  ),
);
Input.displayName = 'Input';
