import '@/styles/index.scss';
import { createLogger } from 'redux-logger';

export const dva = {
  config: {
    onAction: createLogger(),
    onError(e: Error) {
      console.log('dva error:', e);
    },
  },
};
