import { createContext } from 'react';
import { MenuDataItem } from '@/typing';
import { BreadcrumbReturn } from '@/utils/getBreadcrumbProps';

export interface RouteContextType {
  menuData?: MenuDataItem[];
  isMobile?: boolean;
  collapsed?: boolean;
  siderWidth?: number;
  prefixCls?: string;
  title?: string;
  breadcrumb?: BreadcrumbReturn;
  contentWidth?: 'Fluid' | 'Fixed';
}

const routeContext: React.Context<RouteContextType> = createContext({});

export default routeContext;
