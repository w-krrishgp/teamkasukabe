import React from 'react';
import type { ReactNode } from 'react';
import { AlertTriangle, RefreshCw, WifiOff, FileQuestion } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils/cn';

export interface ErrorCardProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorCard: React.FC<ErrorCardProps> = ({
  title = 'Something went wrong',
  message = 'Unable to load agricultural telemetry. Please check your network and try again.',
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-[#FEF2F2] border border-[#FECACA] rounded-2xl p-5 text-center flex flex-col items-center space-y-3 shadow-soft',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-red-950">{title}</h4>
        <p className="text-xs text-red-700 mt-1 max-w-xs mx-auto">{message}</p>
      </div>
      {onRetry && (
        <Button
          size="sm"
          variant="outline"
          className="border-red-300 text-red-800 hover:bg-red-100"
          iconLeft={<RefreshCw className="w-3.5 h-3.5" />}
          onClick={onRetry}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-white border border-dashed border-harvest-border rounded-2xl p-6 text-center flex flex-col items-center justify-center space-y-3',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-harvest-warm flex items-center justify-center text-harvest-muted">
        {icon || <FileQuestion className="w-6 h-6 text-harvest-muted" />}
      </div>
      <div className="max-w-xs">
        <h4 className="text-sm font-bold text-harvest-deep">{title}</h4>
        <p className="text-xs text-harvest-muted mt-1 leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button size="sm" variant="secondary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export interface OfflineNoticeProps {
  onSync?: () => void;
}

export const OfflineNotice: React.FC<OfflineNoticeProps> = ({ onSync }) => {
  return (
    <div className="bg-[#FFFBEB] border-b border-[#FDE68A] px-4 py-2 flex items-center justify-between text-xs text-[#92400E]">
      <div className="flex items-center space-x-2">
        <WifiOff className="w-4 h-4 shrink-0 text-[#B45309]" />
        <span>You are offline. Showing cached field data.</span>
      </div>
      {onSync && (
        <button
          onClick={onSync}
          className="underline font-semibold hover:text-black shrink-0 ml-2"
        >
          Refresh
        </button>
      )}
    </div>
  );
};
