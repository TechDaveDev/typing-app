import { CharState } from '@/infrastructure/types/types';
import { memo } from 'react';

interface CharacterProps {
  char: string;
  state: CharState;
  isCurrent: boolean;
  wasCorrected: boolean;
}

const Character = ({ char, state, isCurrent, wasCorrected }: CharacterProps) => {
  const getCharStyles = () => {
    if (state === 'correct') {
      if (wasCorrected) return 'text-slate-400 dark:text-slate-500';
      return 'text-blue-600 dark:text-blue-400';
    }

    if (state === 'incorrect') {
      return 'text-red-600 dark:text-red-500 bg-red-100 dark:bg-red-900/30 rounded-sm';
    }

    return 'text-slate-300 dark:text-slate-600';
  };

  return (
    <span className={`
      text-2xl md:text-3xl font-mono transition-all duration-100 ${getCharStyles()} ${isCurrent ? 'border-b-4 border-yellow-500 dark:border-yellow-400 animate-pulse' : 'border-b-4 border-transparent'}`}>
      {char === ' ' ? (state === 'incorrect' ? '_' : '\u00A0') : char}
    </span>
  );
};

export const MemoizedCharacter = memo(Character);