import { CharState } from "@/infrastructure/types/types";

export const Character = ({ char, state, isCurrent, wasCorrected }: { char: string; state: CharState; isCurrent: boolean; wasCorrected: boolean }) => {
  const getCharColor = () => {
    if (state === 'correct') {
      return wasCorrected ? 'text-gray-400' : 'text-blue-500';
    }
    if (state === 'incorrect') {
      return 'text-red-500';
    }
    return 'text-gray-500';
  };

  return (
    <span className={`text-2xl md:text-3xl font-mono transition-colors duration-200 ease-in-out ${getCharColor()} ${isCurrent ? 'border-b-2 border-yellow-400 animate-pulse' : ''}`}>
      {char === ' ' && state === 'incorrect' ? '_' : char}
    </span>
  );
};