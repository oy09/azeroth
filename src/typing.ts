import React from 'react';
import { RouteComponentProps as BasicRouterProps, match } from 'react-router-dom';
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

/**
 * 业务Table组件Ref操作接口描述
 */
export interface CoreTableActionType {
  reload: (resetPage?: boolean) => void;
  reloadAndRest?: () => void;
  rest?: () => void;
  cleanSelected?: () => void;
}

/**
 * 公共组件模型
 */
export type AzSchema<T = unknown, U = string, Extra = unknown> = {
  key?: React.ReactText;
  dataIndex?: string | number | (string | number)[];
  // 渲染模式
  valueType?: ((entity: T) => U) | U;
  // 值枚举
  valueEnum?: any;
  // 标题组件
  title?: any;
  // 展示提示信息
  tooltip?: string;
  render?: (
    text: string,
    record: T,
    index: number,
    action: CoreTableActionType,
    schema: AzSchema<T, U, Extra>,
  ) => React.ReactNode;
  renderFormItem?: (...args: any[]) => React.ReactNode;
  renderText?: (text: string, record: T, index: number, action: CoreTableActionType) => any;
  request?: any;
  params?: {
    [key: string]: any;
  };
  hideInDescription?: boolean;
} & Extra;

export interface IntlType {
  locale?: string;
  getMessage: (id: string, defaultMessage: string) => string;
}
