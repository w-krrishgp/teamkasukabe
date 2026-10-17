import React from 'react';
import { Sparkles } from 'lucide-react';
import { SAMPLE_SCENARIOS, type SampleScenario } from '../sampleScenarios';
import { useLanguage } from '@/context/LanguageContext';

interface ScenarioSelectorProps {
  selectedScenarioId: string;
  onSelectScenario: (scenario: SampleScenario) => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  selectedScenarioId,
  onSelectScenario,
}) => {
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const getLocalizedName = (id: string, name: string) => {
    if (!isHi) return name.split('(')[0].trim();
    switch (id) {
      case 'wheat-mehsana':
        return 'गेहूं (शरबती HD-2967)';
      case 'tomato-nashik':
        return 'टमाटर (हिमसोना)';
      case 'potato-agra':
        return 'आलू (कुफरी पुखराज)';
      case 'mustard-patan':
        return 'सरसों (पूसा बोल्ड)';
      default:
        return name;
    }
  };

  const getLocalizedBadge = (id: string, badge: string) => {
    if (!isHi) return badge.split('•')[0].trim();
    switch (id) {
      case 'wheat-mehsana':
        return 'अनाज • भंडारण';
      case 'tomato-nashik':
        return 'नाशवान • अधिक जोखिम';
      case 'potato-agra':
        return 'कोल्ड स्टोर अवसर';
      case 'mustard-patan':
        return 'तिलहन • उच्च मूल्य';
      default:
        return badge;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-harvest-primary" />
          <span>{isHi ? 'इंटरैक्टिव परिदृश्य (4 डेमो विकल्प)' : 'Interactive Scenarios (Pre-Configured Demos)'}</span>
        </span>
        <span className="text-[10px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full font-medium">
          {isHi ? '4 फ़ील्ड विकल्प' : '4 Field Presets'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SAMPLE_SCENARIOS.map((scenario) => {
          const isSelected = scenario.id === selectedScenarioId;

          return (
            <button
              key={scenario.id}
              onClick={() => onSelectScenario(scenario)}
              className={`p-2.5 rounded-2xl text-left border transition-all relative overflow-hidden select-none active:scale-98 ${
                isSelected
                  ? 'border-harvest-primary bg-harvest-pale/60 text-harvest-deep shadow-xs ring-1 ring-harvest-primary/30'
                  : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider block text-stone-500 truncate">
                  {getLocalizedBadge(scenario.id, scenario.cropBadge)}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-harvest-primary animate-pulse" />
                )}
              </div>

              <div className="text-xs font-black text-harvest-deep mt-0.5 truncate">
                {getLocalizedName(scenario.id, scenario.name)}
              </div>

              <div className="text-[10px] text-stone-500 line-clamp-1 mt-0.5 font-medium">
                {scenario.inputs.quantityQuintals} Qtl • {scenario.inputs.location.district}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
