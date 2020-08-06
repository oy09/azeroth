import React from 'react';

export type WithFalse<T> = T | false;

export interface MenuDataItem {
  key?: string;
  name?: string;
  path?: string;
  icon?: React.ReactNode;
  hidden?: boolean;
  children?: MenuDataItem[];
  auth?: string[] | string;
  [key: string]: any;
}

export interface Route extends MenuDataItem {
  routes: Route[];
}
