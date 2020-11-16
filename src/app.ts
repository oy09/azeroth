import '@/styles/index.scss';
import { createLogger } from 'redux-logger';
import React from 'react';
import RequestConfigContext, { Config } from '@/utils/hooks/requestConfigContext';

export const dva = {
  config: {
    onAction: createLogger(),
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
