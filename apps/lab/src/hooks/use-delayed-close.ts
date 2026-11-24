"use client";

import { useCallback, useEffect, useRef } from "react";

export function useDelayedClose(onClose: () => void, delay: number) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancel = useCallback(() => {
    if (timer.current === null) return;

    clearTimeout(timer.current);
    timer.current = null;
  }, []);

  const schedule = useCallback(() => {
    cancel();
    timer.current = setTimeout(() => {
      timer.current = null;
      onClose();
    }, delay);
  }, [cancel, delay, onClose]);

  useEffect(() => cancel, [cancel]);

  return { schedule, cancel };
}
