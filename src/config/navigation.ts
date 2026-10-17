import {
  LayoutDashboard,
  ShieldCheck,
  BrainCircuit,
  Coins,
  Store,
  User,
} from 'lucide-react';
import type { ElementType } from 'react';

export interface NavItem {
  id: string;
  label: string;
  hindiLabel?: string;
  path: string;
  icon: ElementType;
  badge?: string;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    hindiLabel: 'डैशबोर्ड',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    id: 'farm-care',
    label: 'Farm Care',
    hindiLabel: 'फसल सुरक्षा',
    path: '/farm-care',
    icon: ShieldCheck,
    badge: 'Scan',
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    hindiLabel: 'कृषि ज्ञान',
    path: '/intelligence',
    icon: BrainCircuit,
  },
  {
    id: 'finance',
    label: 'Money & Schemes',
    hindiLabel: 'योजना व ऋण',
    path: '/finance',
    icon: Coins,
    badge: 'PMK',
  },
  {
    id: 'market',
    label: 'Market Access',
    hindiLabel: 'मंडी भाव',
    path: '/market',
    icon: Store,
  },
];

export const PROFILE_NAV_ITEM: NavItem = {
  id: 'profile',
  label: 'Profile',
  hindiLabel: 'प्रोफ़ाइल',
  path: '/profile',
  icon: User,
};
