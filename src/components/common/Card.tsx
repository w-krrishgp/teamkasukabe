import React from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'warm' | 'elevated' | 'bordered';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  hoverable = false,
  ...props
}) => {
  const variants = {
    default: 'bg-white border border-harvest-border shadow-soft',
    warm: 'bg-harvest-warm border border-harvest-border/80 shadow-none',
    elevated: 'bg-white border border-harvest-border shadow-card',
    bordered: 'bg-transparent border-2 border-harvest-border',
  };

  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-150 overflow-hidden',
        variants[variant],
        hoverable && 'active:scale-[0.99] cursor-pointer hover:border-harvest-sage/60 hover:shadow-card',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('p-4 pb-2 flex flex-col space-y-1', className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({
  className,
  children,
  ...props
}) => (
  <h3
    className={cn('text-base font-bold text-harvest-deep tracking-tight flex items-center justify-between', className)}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription: React.FC<HTMLAttributes<HTMLParagraphElement>> = ({
  className,
  children,
  ...props
}) => (
  <p className={cn('text-xs text-harvest-muted font-normal leading-relaxed', className)} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div className={cn('p-4 pt-2', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  children,
  ...props
}) => (
  <div
    className={cn('p-4 pt-2 border-t border-harvest-border/60 flex items-center justify-between bg-harvest-cream/40', className)}
    {...props}
  >
    {children}
  </div>
);
