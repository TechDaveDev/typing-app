'use client';

import { TypingCharacter } from "@/infrastructure/interfaces/interfaces";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export const useTypingTest = (text: string) => {
  const [characters, setCharacters] = useState<TypingCharacter[]>(
    text.split('').map(char => ({ char, state: 'untouched' }))
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const totalTypedRef = useRef(0);
  const errorsRef = useRef(0);

  const correctedIndexesRef = useRef(new Set<number>());
  const isFinished = useMemo(() => currentIndex === text.length, [currentIndex, text.length]);


  useEffect(() => {
    if (!startTime || isFinished) return;

    const elapsedTimeInMinutes = (Date.now() - startTime) / 1000 / 60;

    if (elapsedTimeInMinutes > 0) {
      const typedChars = currentIndex;
      const calculatedWpm = (typedChars / 5) / elapsedTimeInMinutes;
      setWpm(Math.round(calculatedWpm > 0 ? calculatedWpm : 0));
    }

  }, [currentIndex, startTime, isFinished]);

  useEffect(() => {
    if (currentIndex === 0) {
      setAccuracy(100);
      return;
    }
    const typedCharacters = characters.slice(0, currentIndex);
    const correctCharsCount = typedCharacters.filter(c => c.state === 'correct').length;

    const newAccuracy = (correctCharsCount / currentIndex) * 100;

    setAccuracy(parseFloat(newAccuracy.toFixed(2)));

  }, [characters, currentIndex]);


  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isFinished) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    const { key } = e;

    if (key.length > 1 && key !== 'Backspace') {
      e.preventDefault();
      return;
    }

    if (key === 'Backspace') {
      e.preventDefault();
      if (currentIndex > 0) {
        setCharacters(prevChars => {
          const newChars = [...prevChars];
          newChars[currentIndex - 1].state = 'untouched';
          return newChars;
        });
        setCurrentIndex(c => c - 1);
      }
      return;
    }

    if (currentIndex < text.length) {
      setCharacters(prevChars => {
        const newChars = [...prevChars];
        const expectedChar = newChars[currentIndex].char;

        if (key === expectedChar) {
          newChars[currentIndex].state = 'correct';
        } else {
          newChars[currentIndex].state = 'incorrect';
          correctedIndexesRef.current.add(currentIndex);
        }
        return newChars;
      });

      setCurrentIndex(c => c + 1);
    }

  }, [currentIndex, startTime, text.length, isFinished]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const restartTest = useCallback(() => {
    setCharacters(text.split('').map(char => ({ char, state: 'untouched' })));
    setCurrentIndex(0);
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    totalTypedRef.current = 0;
    errorsRef.current = 0;
    correctedIndexesRef.current.clear();
  }, [text]);

  return { characters, currentIndex, wpm, accuracy, isFinished, correctedIndexesRef, restartTest };
};