import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-black text-white border-black',
      success: 'bg-white text-black border-black',
      error: 'bg-black text-white border-black',
      warning: 'bg-white text-black border-black',
      info: 'bg-white text-black border-black',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wide border-2',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';