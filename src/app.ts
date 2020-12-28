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
