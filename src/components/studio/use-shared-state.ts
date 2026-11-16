"use client";

import { useCallback, useEffect, useReducer } from "react";
import { useStore, type WritableAtom } from "jotai";

/**
 * `useAtom` for the generation state that more than one route shares.
 *
 * Next keeps the previous route's tree mounted while another route is on
 * screen, and jotai holds on to the value it read for the last update it saw.
 * A write made from the other route — the studio resets the mode when it
 * opens — never reaches that cached value, so the home prompt bar keeps
 * rendering its old mode. Every tab click then writes the value it already
 * has, nothing changes, and the switch looks dead.
 *
 * Reading the store during render and reading it once more when the
 * subscription is (re)attached keeps the composer in step with the store.
 */
export function useSharedState<Value, Args extends unknown[], Result>(
  atom: WritableAtom<Value, Args, Result>,
) {
  const store = useStore();
  const [, resync] = useReducer((version: number) => version + 1, 0);

  useEffect(() => {
    resync();
    return store.sub(atom, resync);
  }, [store, atom]);

  const setValue = useCallback(
    (...args: Args) => store.set(atom, ...args),
    [store, atom],
  );

  return [store.get(atom), setValue] as const;
}
