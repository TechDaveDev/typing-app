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

  // Usamos useRef para mantener los contadores sin provocar re-renders
  const totalTypedRef = useRef(0);
  const errorsRef = useRef(0);
  // Almacena los índices que fueron incorrectos para aplicar el estilo "corregido"
  const correctedIndexesRef = useRef(new Set<number>());

  const isFinished = useMemo(() => currentIndex === text.length, [currentIndex, text.length]);

  // --- LÓGICA DE CÁLCULO DE ESTADÍSTICAS ---
  useEffect(() => {
    if (startTime && !isFinished) {
      const interval = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000 / 60; // en minutos
        if (elapsedTime > 0) {
          const correctChars = currentIndex - errorsRef.current;
          const calculatedWpm = (correctChars / 5) / elapsedTime;
          setWpm(Math.round(calculatedWpm > 0 ? calculatedWpm : 0));
        }
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [startTime, currentIndex, isFinished]);

  // --- MANEJO DEL INPUT DEL TECLADO ---
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isFinished) return;

    // Iniciar el cronómetro con la primera tecla presionada
    if (!startTime) {
      setStartTime(Date.now());
    }

    const { key } = e;

    // Ignorar teclas especiales que no sean Backspace
    if (key.length > 1 && key !== 'Backspace') {
      e.preventDefault();
      return;
    }

    // Evitar que Backspace navegue hacia atrás en el navegador
    if (key === 'Backspace') {
      e.preventDefault();
    }


    setCharacters(prevChars => {
      const newChars = [...prevChars];

      if (key === 'Backspace') {
        if (currentIndex > 0) {
          // Marca el estado del caracter anterior como 'no tocado'
          newChars[currentIndex - 1].state = 'untouched';
          setCurrentIndex(c => c - 1);
        }
        return newChars;
      }

      // Si se presionó una tecla de caracter
      if (currentIndex < text.length) {
        totalTypedRef.current++;
        let isCorrect = false;

        if (key === newChars[currentIndex].char) {
          newChars[currentIndex].state = 'correct';
          isCorrect = true;
        } else {
          newChars[currentIndex].state = 'incorrect';
          errorsRef.current++;
          // Registrar que este índice tuvo un error
          correctedIndexesRef.current.add(currentIndex);
        }

        // Calcular precisión
        const newAccuracy = ((totalTypedRef.current - errorsRef.current) / totalTypedRef.current) * 100;
        setAccuracy(parseFloat(newAccuracy.toFixed(2)));

        setCurrentIndex(c => c + 1);
      }

      return newChars;
    });

  }, [currentIndex, startTime, text.length, isFinished]);

  // --- EFECTO PARA EL LISTENER DEL TECLADO ---
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // --- FUNCIÓN DE REINICIO ---
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