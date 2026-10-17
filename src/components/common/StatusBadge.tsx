import React from 'react';
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import type { StatusVariant } from '@/types';

export interface StatusBadgeProps {
  variant?: StatusVariant;
  size?: 'sm' | 'md';
  children: ReactNode;
  icon?: ReactNode;
  showDot?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant = 'earth',
  size = 'md',
  children,
  icon,
  showDot = false,
  className,
}) => {
  const variantStyles: Record<StatusVariant, { badge: string; dot: string }> = {
    success: {
      badge: 'bg-[#D8F3DC] text-[#1B4332] border-[#B7E4C7]',
      dot: 'bg-[#2D6A4F]',
    },
    warning: {
      badge: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
      dot: 'bg-[#D97706]',
    },
    error: {
      badge: 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]',
      dot: 'bg-[#DC2626]',
    },
    info: {
      badge: 'bg-[#E0F2FE] text-[#075985] border-[#BAE6FD]',
      dot: 'bg-[#0284C7]',
    },
    earth: {
      badge: 'bg-[#F1F5EE] text-[#2D6A4F] border-[#D5E0D2]',
      dot: 'bg-[#52B788]',
    },
    neutral: {
      badge: 'bg-gray-100 text-gray-700 border-gray-200',
      dot: 'bg-gray-500',
    },
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
  };

  const selected = variantStyles[variant] || variantStyles.earth;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border tracking-wide select-none',
        selected.badge,
        sizeStyles[size],
        className
      )}
    >
      {showDot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', selected.dot)} />
      )}
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </span>
  );
};
