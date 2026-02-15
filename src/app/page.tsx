'use client';

import { useMemo, useRef } from "react";

import { NextPage } from "next";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MemoizedCharacter } from "@/components/MemoizedCharacter";

import { useTypingTest } from "@/hooks/useTypingTest";

const INITIAL_TEXT = "hola mundo esta es una prueba de escritura para medir tu velocidad y precision al teclear";

const TypingTutorPage: NextPage = () => {
  const {
    characters,
    currentIndex,
    wpm,
    accuracy,
    isFinished,
    correctedIndexesRef,
    restartTest
  } = useTypingTest(INITIAL_TEXT);

  const restartButtonRef = useRef<HTMLButtonElement>(null);

  const words = useMemo(() => INITIAL_TEXT.split(' '), []);
  let charIndexCounter = 0;

  const handleRestart = () => {
    restartTest();
    restartButtonRef.current?.blur();
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
      <Header />

      <main className="flex-grow w-full max-w-4xl mx-auto flex flex-col items-center justify-center px-6 py-12 gap-12">

        <div className="w-full flex flex-col items-center gap-8">
          <div className="text-center space-y-2">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-800 dark:text-white">
              Prueba de escritura
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Mide tu velocidad y precisión al escribir.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 w-full max-w-md">
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700/50 text-center backdrop-blur-sm transition-all">
              <p className="text-slate-400 dark:text-slate-500 text-xs uppercase font-bold tracking-widest mb-1">Velocidad</p>
              <p className="text-yellow-600 dark:text-yellow-500 text-5xl font-black">
                {wpm} <span className="text-xl font-bold opacity-70">WPM</span>
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700/50 text-center backdrop-blur-sm transition-all">
              <p className="text-slate-400 dark:text-slate-500 text-xs uppercase font-bold tracking-widest mb-1">Precisión</p>
              <p className="text-yellow-600 dark:text-yellow-500 text-5xl font-black">
                {Math.floor(accuracy)}<span className="text-xl font-bold opacity-70">%</span>
              </p>
            </div>
          </div>
        </div>

        <div className="w-full relative group">
          <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 w-full min-h-[200px] flex items-center transition-all">
            <div className="flex flex-wrap tracking-wide leading-relaxed select-none">
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

          {currentIndex === 0 && !isFinished && (
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-slate-400 dark:text-slate-500 text-sm font-medium animate-bounce">
              Presiona cualquier tecla para comenzar...
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-6">
          <button
            ref={restartButtonRef}
            onClick={handleRestart}
            className="px-10 py-4 bg-slate-900 dark:bg-yellow-500 text-white dark:text-slate-900 font-bold text-lg rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-slate-300 dark:shadow-yellow-500/20"
          >
            Reiniciar
          </button>

          {isFinished && (
            <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-2xl text-center animate-in fade-in zoom-in duration-500">
              <p className="text-xl font-bold">Prueba completada</p>
              <p className="opacity-80">Puedes reiniciar la prueba para intentar obtener un mejor resultado.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TypingTutorPage;