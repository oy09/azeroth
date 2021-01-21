import '@/styles/index.scss';
import { createLogger } from 'redux-logger';
import React from 'react';
import RequestConfigContext, { Config } from '@/utils/hooks/requestConfigContext';

const frameworkReg = new RegExp('@@');

export const dva = {
  config: {
    onAction: createLogger({
      collapsed: true,
      predicate: (state, action) => {
        const type = action.type as string;
        if (type.match(frameworkReg)) {
          return false;
        }
        return true;
      },
    }),
    onError(e: Error) {
      console.log('dva error:', e);
    },
  },
};

export const rootContainer = (container: React.ReactNode) => {
  return React.createElement<React.ProviderProps<Partial<Config>>>(
    RequestConfigContext.Provider,
    {
      value: {
        baseURL: BASE_URL,
      },
    },
    container,
  );
};

const solution = (values: number[] = []) => {
  const set1 = new Set();
  values.forEach(a => {
    if (a > 0) {
      set1.add(a);
    }
  });
  for (let i = 1; i <= values.length + 1; i++) {
    if (set1.has(i) === false) {
      return i;
    }
  }
};

const reuslt = solution([1, 2, 3]);
console.log('result:', reuslt);

// 从前往后插，排个序
// 或者，正数从前往后找第一个比他小的
const solution2 = (value: number): string => {
  const insertNum = 5;
  const numberStr: string[] = (value + '').split('');
  if (numberStr[0] === '0') {
    numberStr.splice(1, 0, insertNum + '');
    return numberStr.join('');
  }
  if (numberStr[0] === '-') {
    numberStr.splice(1, 0, insertNum + '');
    if (parseInt(numberStr.join('')) < -8000) {
      return value + '';
    }
    return numberStr.join('');
  }
  const result: string[] = [];
  let tag = true;
  numberStr.forEach(i => {
    if (tag && parseInt(i) < insertNum) {
      result.push(insertNum + '');
      result.push(i);
      tag = false;
    } else {
      result.push(i);
    }
  });
  if (tag) {
    result.push(insertNum + '');
  }
  const numberValue = result.join('');
  if (parseInt(numberValue) > 8000) {
    return value + '';
  }
  return numberValue;
};

console.log('solution2:', solution2(799));
