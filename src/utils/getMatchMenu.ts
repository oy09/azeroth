import { MenuDataItem } from '@/typing';
import { isUrl } from '@/utils/typeUtils';
import { pathToRegexp } from 'path-to-regexp';

/**
 * 数组拍平
 */
const getFlatMenu = (data: MenuDataItem[]): { [key: string]: MenuDataItem } => {
  let menus: { [key: string]: MenuDataItem } = {};

  data.forEach(item => {
    if (!item || !item.path) {
      return;
    }
    menus[item.path || '/'] = {
      ...item,
    };

    if (item.children) {
      menus = {
        ...menus,
        ...getFlatMenu(item.children),
      };
    }
  });

  return menus;
};

export function stripQueryStringAndHashFromPath(url: string) {
  return url.split('?')[0].split('#')[0];
}

/**
 * 返回匹配路由
 */
const getMathMenu = (
  path?: string,
  data: MenuDataItem[] = [],
): MenuDataItem => {
  const flatMenus = getFlatMenu(data);
  const flatMenuKeys = Object.keys(flatMenus);
  const key = flatMenuKeys.find(key => key === path);
  return flatMenus[key || ''];
};

export const getMenuMatches = (
  flatMenuKeys: string[] = [],
  path: string,
): string[] | undefined => {
  return flatMenuKeys
    .filter(item => {
      if (item === '/' && path === '/') {
        return true;
      }
      if (item !== '/' && item !== '/*' && item && !isUrl(item)) {
        const pathKey = stripQueryStringAndHashFromPath(item);
        try {
          if (pathToRegexp(`${pathKey}`, []).test(path)) {
            return true;
          }
          if (pathToRegexp(`${pathKey}/(.*)`).test(path)) {
            return true;
          }
        } catch (error) {
          //
        }
      }
      return false;
    })
    .sort((a, b) => {
      if (a === path) {
        return 10;
      }
      if (b === path) {
        return -10;
      }
      return a.substr(1).split('/').length - b.substr(1).split('/').length;
    });
};

export const getMatchMenu = (
  pathname: string,
  data: MenuDataItem[],
  fullKeys?: boolean,
): MenuDataItem[] => {
  const flatMenus = getFlatMenu(data);
  const flatMenuKeys = Object.keys(flatMenus);
  const menuPathKeys = getMenuMatches(flatMenuKeys, pathname);
  if (!menuPathKeys || menuPathKeys.length < 1) {
    return [];
  }

  return menuPathKeys
    .map(menuPathKey => {
      const menuItem = flatMenus[menuPathKey] || { key: '' };
      // TODO 没有做去重处理

      return menuItem;
    })
    .flat(1);
};

export const getSelectedMenuKeys = (
  path: string,
  menuData: MenuDataItem[],
): string[] => {
  const menus = getMatchMenu(path, menuData);
  return menus.map(item => item.key || item.path || '');
};

export default getMathMenu;
