import type { ReactNode } from 'react';

export type StatusVariant = 'success' | 'warning' | 'error' | 'info' | 'earth' | 'neutral';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'earth';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
}

export type NetworkStatus = 'online' | 'offline' | 'syncing';
