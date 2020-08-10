import React from 'react';

interface Option<T> {
  defaultValue?: T | (() => T);
  value?: T;
  onChange?: (value: T, prevValue: T) => void;
}

export default function useMergedState<T, R = T>(
  defaultStateValue: T | (() => T),
  option?: Option<T>,
): [R, (value: T) => void] {
  const { defaultValue, value, onChange } = option || {};
  const [innerValue, setInnerValue] = React.useState<T>(() => {
    console.log('lazy useState');
    if (value !== undefined) {
      return value;
    }
    if (defaultValue !== undefined) {
      return typeof defaultValue === 'function'
        ? (defaultValue as any)()
        : defaultStateValue;
    }
    return typeof defaultStateValue === 'function'
      ? (defaultStateValue as any)()
      : defaultStateValue;
  });

  let mergedValue = value !== undefined ? value : innerValue;

  function triggerChange(newValue: T) {
    setInnerValue(newValue);
    if (mergedValue !== newValue && onChange) {
      onChange(newValue, mergedValue);
    }
  }

  const firstRenderRef = React.useRef(true);
  React.useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    if (value === undefined) {
      setInnerValue(value as any);
    }
  }, [value]);

  return [(mergedValue as unknown) as R, triggerChange];
}
