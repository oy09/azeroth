/**
 * Umi路由辅助工具函数
 * @author ouyang
 */

import { MenuDataItem, Route } from '@/typing';

const createMenuData = (menuData: MenuDataItem[]): MenuDataItem[] => {
  return menuData
    .filter(item => {
      return item && (item.name || item.children) && !item.hidden && !item.redirect;
    })
    .map(item => {
      if (item.children && Array.isArray(item.children) && item.children.some(child => child && child.title)) {
        const children = createMenuData(item.children);
        if (children.length) {
          return {
            ...item,
            children,
          };
        }
      }
      return {
        ...item,
        children: undefined,
      };
    })
    .filter(item => item);
};

const createBreadcrumbMap = (menuData: Route[] = []): Map<string, MenuDataItem> => {
  const arrayToMap = (routes: Route[], initialValue = new Map()) => {
    return routes.reduce((acc, current) => {
      if (!current.hidden && current.title) {
        acc.set(current.path, current);
        if (current.routes) {
          arrayToMap(current.routes, acc);
        }
      }
      return acc;
    }, initialValue);
  };
  return arrayToMap(menuData, new Map());
};

const stripQueryStringAndHashFromPath = (url: string) => {
  return url.split('?')[0].split('#')[0];
};

/**
 * 将路由列表数据转换为菜单列表数据
 * @param routes 路由配置
 */
export const getMenuData = (routes: Route[]) => {
  return {
    menuData: createMenuData(routes),
    breadcrumbMap: createBreadcrumbMap(routes),
  };
};

/**
 * 查询当前列表中符合路径的路由
 */
export const getMatchMenu = (path?: string, data: MenuDataItem[] = []): MenuDataItem => {
  const flatMenus = getFlatMenu(data);
  const flatMenuKeys = Object.keys(flatMenus);
  const key = flatMenuKeys.find(key => key === path) as string;
  return flatMenus[key];
};

/**
 * 查询当前选中路由的路径
 */
export const getSelectedMenuKeys = (path: string, data: MenuDataItem[] = []): string[] => {
  return [];
};

/**
 * 路由拍平
 */
export const getFlatMenu = (menu: MenuDataItem[]): { [key: string]: MenuDataItem } => {
  return {};
};
