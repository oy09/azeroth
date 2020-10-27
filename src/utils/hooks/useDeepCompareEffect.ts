import { fromPairs } from 'lodash';
import { useRef, useEffect, DependencyList, EffectCallback } from 'react';
import { isEqual } from 'lodash';

const isDeepEqual: (a: any, b: any) => boolean = isEqual;

function useDeepCompareMemoize(value: any) {
  const ref = useRef();
  if (!isDeepEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

/**
 * 深比较依赖项
 * @param effect
 * @param dependencyList
 */
function useDeepCompareEffect(
  effect: EffectCallback,
  dependencyList: DependencyList = [],
) {
  useEffect(effect, useDeepCompareMemoize(dependencyList));
}

export default useDeepCompareEffect;
