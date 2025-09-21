'use client';

import { useMemo } from "react";
import { Character } from "./Character";
import { CharState } from "@/infrastructure/types/types";

export const MemoizedCharacter = ({ char, state, isCurrent, wasCorrected }: { char: string; state: CharState; isCurrent: boolean; wasCorrected: boolean }) => useMemo(() => (
  <Character char={char} state={state} isCurrent={isCurrent} wasCorrected={wasCorrected} />
), [char, state, isCurrent, wasCorrected]);