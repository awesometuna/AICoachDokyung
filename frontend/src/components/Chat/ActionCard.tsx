import React from 'react';
import type { SuggestedAction } from '../../services/api';

interface ActionCardProps {
  action: SuggestedAction;
  onClick?: () => void;
}

const ActionCard: React.FC<ActionCardProps> = ({ action, onClick }) => {
  const getBorderColor = (type: string) => {
    switch (type) {
      case 'start': return 'border-sunset-coral bg-orange-50';
      case 'rest': return 'border-green-400 bg-green-50';
      case 'drop': return 'border-red-400 bg-red-50';
      default: return 'border-sunset-border bg-white';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`mt-2 p-3 rounded-xl border-l-4 cursor-pointer hover:shadow-md transition-all ${getBorderColor(action.type)}`}
    >
      <div className="text-xs font-bold text-warm-gray uppercase mb-1">{action.type} Action</div>
      <div className="font-bold text-charcoal text-sm">{action.title}</div>
      <div className="text-xs text-charcoal mt-1">Expected Time: {action.duration_min} min</div>
    </div>
  );
};

export default ActionCard;
