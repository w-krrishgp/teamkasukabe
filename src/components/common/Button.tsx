import React from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { ButtonVariant, ButtonSize } from '@/types';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  iconLeft,
  iconRight,
  fullWidth = false,
  type = 'button',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100';

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-harvest-primary text-white hover:bg-[#23533e] active:bg-[#1a3d2e] focus-visible:ring-harvest-primary shadow-sm shadow-harvest-primary/20',
    secondary:
      'bg-harvest-warm text-harvest-text hover:bg-[#e4ece0] active:bg-[#d6e2d1] border border-harvest-border focus-visible:ring-harvest-emerald',
    outline:
      'border-2 border-harvest-primary text-harvest-primary hover:bg-harvest-pale/30 active:bg-harvest-pale/50 focus-visible:ring-harvest-primary',
    ghost:
      'text-harvest-text hover:bg-harvest-warm/70 active:bg-harvest-warm focus-visible:ring-harvest-primary',
    earth:
      'bg-harvest-clay text-white hover:bg-[#b85e43] active:bg-[#a3523a] focus-visible:ring-harvest-clay shadow-sm shadow-harvest-clay/20',
    destructive:
      'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-600 shadow-sm shadow-red-600/20',
  };

  const sizes: Record<ButtonSize, string> = {
    sm: 'h-9 px-3 text-xs gap-1.5',
    md: 'h-11 px-4 text-sm gap-2', // 44px min touch target for mobile
    lg: 'h-13 py-3.5 px-6 text-base gap-2.5 font-semibold',
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        iconLeft && <span className="inline-flex shrink-0">{iconLeft}</span>
      )}
      <span className="truncate">{children}</span>
      {!isLoading && iconRight && <span className="inline-flex shrink-0">{iconRight}</span>}
    </button>
  );
};
