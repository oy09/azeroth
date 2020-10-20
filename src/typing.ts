import React from 'react';
import {
  RouteComponentProps as BasicRouterProps,
  match,
} from 'react-router-dom';
import { IRoute } from 'umi';

export type WithFalse<T> = T | false;

export interface MenuDataItem {
  key?: string;
  title?: string;
  name?: string;
  path?: string;
  icon?: React.ReactNode;
  hidden?: boolean;
  children?: MenuDataItem[];
  roles?: string[] | string;
  target?: string;
  component?: string;
  [key: string]: any;
}

export interface Route extends MenuDataItem {
  routes: Route[];
}

export interface RouterTypes<P> extends Omit<BasicRouterProps, 'location'> {
  computedMatch?: match<P>;
  route?: Route;
  location: BasicRouterProps['location'] | { pathname?: string };
}

export type AzRoute = IRoute & {
  needRedirect?: string;
};

export type ParamsType = {
  [key: string]: React.ReactText | React.ReactText[];
};
