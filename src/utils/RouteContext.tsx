import { createContext } from 'react';
import { MenuDataItem } from '@/typing';

export interface RouteContextType {
  menuData?: MenuDataItem[];
  isMobile?: boolean;
  collapsed?: boolean;
  siderWidth?: number;
  prefixCls?: string;
}

const routeContext: React.Context<RouteContextType> = createContext({});

export default routeContext;
