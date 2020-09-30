import { createContext } from 'react';
import { MenuDataItem } from '@/typing';
import { BreadcrumbReturn } from '@/layouts/getBreadcrumbProps';

export interface RouteContextType {
  menuData?: MenuDataItem[];
  isMobile?: boolean;
  collapsed?: boolean;
  siderWidth?: number;
  prefixCls?: string;
  title?: string;
  breadcrumb?: BreadcrumbReturn;
}

const routeContext: React.Context<RouteContextType> = createContext({});

export default routeContext;
