import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  BrainCircuit,
  Coins,
  Store,
  User,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useLanguage } from '@/context/LanguageContext';

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    {
      id: 'dashboard',
      label: t('navDashboard'),
      path: '/',
      icon: LayoutDashboard,
    },
    {
      id: 'farm-care',
      label: t('navFarmCare'),
      path: '/farm-care',
      icon: ShieldCheck,
      badge: 'Scan',
    },
    {
      id: 'intelligence',
      label: t('navIntelligence'),
      path: '/intelligence',
      icon: BrainCircuit,
    },
    {
      id: 'finance',
      label: t('navFinance'),
      path: '/finance',
      icon: Coins,
      badge: 'PMK',
    },
    {
      id: 'market',
      label: t('navMarket'),
      path: '/market',
      icon: Store,
    },
    {
      id: 'profile',
      label: t('navProfile'),
      path: '/profile',
      icon: User,
    },
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="w-full bg-white/98 backdrop-blur-md border-t border-stone-200 pb-safe shadow-[0_-2px_12px_rgba(20,35,24,0.06)]"
    >
      <div className="flex items-center justify-around px-1 py-1 max-w-md mx-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                'relative flex flex-col items-center justify-center flex-1 py-1.5 px-0.5 min-w-0 min-h-[50px]',
                'transition-all duration-150 select-none group focus:outline-none',
                active ? 'text-harvest-primary' : 'text-stone-500 hover:text-stone-800'
              )}
            >
              {/* Active pill indicator */}
              <div
                className={cn(
                  'relative flex items-center justify-center w-11 h-7 rounded-full transition-all duration-150',
                  active
                    ? 'bg-harvest-pale text-harvest-primary font-bold scale-105'
                    : 'group-active:scale-95'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 transition-transform duration-150',
                    active ? 'stroke-[2.4px]' : 'stroke-[1.8px]'
                  )}
                />
                {item.badge && !active && (
                  <span className="absolute -top-1 -right-1 text-[8px] bg-harvest-clay text-white px-1 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={cn(
                  'text-[10px] tracking-tight mt-0.5 truncate w-full text-center transition-colors',
                  active ? 'font-bold text-harvest-deep' : 'font-medium text-stone-500'
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
