'use client';

import { MemoizedCharacter } from "@/components/MemoizedCharacter";
import { useTypingTest } from "@/hooks/useTypingTest";

const INITIAL_TEXT = "hola mundo esta es una prueba de escritura para medir tu velocidad y precision al teclear";

import { NextPage } from "next";
import { useMemo, useRef } from "react";

const TypingTutorPage: NextPage = () => {
  const { characters, currentIndex, wpm, accuracy, isFinished, correctedIndexesRef, restartTest } = useTypingTest(INITIAL_TEXT);
  const restartButtonRef = useRef<HTMLButtonElement>(null);

  const words = useMemo(() => INITIAL_TEXT.split(' '), []);
  let charIndexCounter = 0;

  const handleRestart = () => {
    restartTest();
    restartButtonRef.current?.blur();
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center font-sans p-4">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-200 tracking-wider">Typing Test</h1>

        <div className="grid grid-cols-2 gap-4 md:gap-8 w-full max-w-md bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="text-center">
            <p className="text-gray-400 text-lg">Velocidad</p>
            <p className="text-yellow-400 text-4xl md:text-5xl font-bold">{wpm} <span className="text-2xl">WPM</span></p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-lg">Precisión</p>
            <p className="text-yellow-400 text-4xl md:text-5xl font-bold">{accuracy}%</p>
          </div>
        </div>

        <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg w-full">
          <div className="flex flex-wrap tracking-widest leading-relaxed">
            {words.map((word, wordIdx) => (
              <div key={wordIdx} className="flex">
                {word.split('').map(() => {
                  const charData = characters[charIndexCounter];
                  const globalIndex = charIndexCounter++;
                  return (
                    <MemoizedCharacter
                      key={globalIndex}
                      char={charData.char}
                      state={charData.state}
                      isCurrent={globalIndex === currentIndex}
                      wasCorrected={charData.state === 'correct' && correctedIndexesRef.current.has(globalIndex)}
                    />
                  );
                })}
                {wordIdx < words.length - 1 && (() => {
                  const charData = characters[charIndexCounter];
                  const globalIndex = charIndexCounter++;
                  return (
                    <MemoizedCharacter
                      key={globalIndex}
                      char={charData.char}
                      state={charData.state}
                      isCurrent={globalIndex === currentIndex}
                      wasCorrected={charData.state === 'correct' && correctedIndexesRef.current.has(globalIndex)}
                    />
                  );
                })()}
              </div>
            ))}
          </div>
        </div>

        <button ref={restartButtonRef} onClick={handleRestart} className="mt-4 px-6 py-3 bg-yellow-500 text-gray-900 font-bold text-lg rounded-lg hover:bg-yellow-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-300 shadow-md">
          Reiniciar
        </button>

        {isFinished && (
          <div className="mt-4 p-4 bg-green-900/50 border border-green-500 text-green-300 rounded-lg text-center">
            <p className="font-bold">¡Test completado!</p>
            <p>Presiona Reiniciar para volver a intentarlo.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingTutorPage;