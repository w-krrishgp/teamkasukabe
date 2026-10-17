import React from 'react';
import { Loader2, Sprout } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className,
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-10 h-10',
  };

  return (
    <Loader2
      className={cn('animate-spin text-harvest-primary', sizeMap[size], className)}
    />
  );
};

export interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-harvest-warm/90 rounded-xl',
        className
      )}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-harvest-border rounded-2xl p-4 space-y-3 shadow-soft">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="pt-2 flex items-center justify-between border-t border-harvest-border/60">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
};

export interface PageLoaderProps {
  message?: string;
}

export const PageLoader: React.FC<PageLoaderProps> = ({
  message = 'Loading farm intelligence...',
}) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-3">
      <div className="relative">
        <div className="w-14 h-14 rounded-full bg-harvest-pale/60 flex items-center justify-center animate-pulse">
          <Sprout className="w-7 h-7 text-harvest-primary" />
        </div>
      </div>
      <p className="text-sm font-semibold text-harvest-deep tracking-wide">{message}</p>
      <p className="text-xs text-harvest-muted">Syncing real-time agronomic data</p>
    </div>
  );
};
