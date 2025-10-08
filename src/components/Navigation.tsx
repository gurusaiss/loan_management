import React from 'react';
import { useLanguage } from './LanguageProvider';
import { Home, Calculator, FileText, History, BarChart3, Bell, Building2 } from 'lucide-react';

type Screen = 'dashboard' | 'calculator' | 'comparison' | 'banking' | 'history' | 'alerts';

interface NavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function Navigation({ currentScreen, onNavigate }: NavigationProps) {
  const { currentLanguage, t } = useLanguage();

  const navigationItems = [
    {
      id: 'dashboard' as Screen,
      icon: Home,
      label: t('dashboard'),
      color: 'text-blue-600'
    },
    {
      id: 'calculator' as Screen,
      icon: Calculator,
      label: t('calculator'),
      color: 'text-green-600'
    },
    {
      id: 'comparison' as Screen,
      icon: BarChart3,
      label: t('comparison'),
      color: 'text-orange-600'
    },
    {
      id: 'banking' as Screen,
      icon: Building2,
      label: t('banking'),
      color: 'text-emerald-600'
    },
    {
      id: 'history' as Screen,
      icon: History,
      label: t('history'),
      color: 'text-indigo-600'
    }
  ];

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 shadow-2xl">
      {/* Background with blur effect */}
      <div className="absolute inset-0 bg-white/95 backdrop-blur-lg" />
      
      <div className="relative flex justify-around items-center py-2 px-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                flex flex-col items-center justify-center py-2 px-3 rounded-xl min-w-0 transition-all duration-200 group
                ${isActive 
                  ? `bg-gradient-to-t from-blue-50 to-blue-100/50 ${item.color} scale-105 shadow-sm` 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <div className={`
                p-1 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-white shadow-sm' 
                  : 'group-hover:bg-white/50'
                }
              `}>
                <Icon 
                  className={`
                    h-5 w-5 transition-all duration-200
                    ${isActive ? 'scale-110' : 'group-hover:scale-105'}
                  `} 
                />
              </div>
              <span className={`
                text-xs mt-1 font-medium transition-all duration-200 truncate
                ${isActive ? 'scale-95' : ''}
              `}>
                {item.label}
              </span>
              
              {/* Active indicator */}
              {isActive && (
                <div className={`
                  absolute -top-1 left-1/2 transform -translate-x-1/2 
                  w-8 h-1 ${item.color.replace('text-', 'bg-')} rounded-full
                  shadow-sm
                `} />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Subtle bottom indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20" />
    </div>
  );
}