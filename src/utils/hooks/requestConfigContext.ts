import React from 'react';
import { RequestOptions } from './type';

export type Config = RequestOptions;

const RequestConfigContext = React.createContext<Partial<Config>>({});

RequestConfigContext.displayName = 'useRequestConfigContext';

export default RequestConfigContext;
