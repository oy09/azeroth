import { useEffect, useRef, DependencyList, useCallback } from 'react';

export interface ReturnValue<T extends any[]> {
  run: (...args: T) => void;
  cancel: () => void;
}

const useUpdateEffect: typeof useEffect = (effect, deeps) => {
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect();
    }

    return () => undefined;
  }, deeps);
};

const useDebounceFn = <T extends any[]>(
  fn: (...args: T) => any,
  deeps?: DependencyList | number,
  wait?: number,
) => {
  const hooksDeeps = Array.isArray(deeps) ? deeps : [];
  const hookWait = typeof deeps === 'number' ? deeps : wait || 0;
  const timerRef = useRef<any>();
  const fnRef = useRef<any>();

  fnRef.current = fn;

  const cancel = useCallback((...args: any) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  const run = useCallback(
    (...args: any) => {
      cancel();
      timerRef.current = setTimeout(() => {
        timerRef.current(...args);
      }, hookWait);
    },
    [hookWait, cancel],
  );

  useUpdateEffect(() => {
    run();
    return cancel;
  }, [...hooksDeeps, run]);

  useEffect(() => cancel, []);

  return {
    run,
    cancel,
  };
};

export default useDebounceFn;
