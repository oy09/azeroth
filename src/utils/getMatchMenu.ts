import { MenuDataItem } from '@/typing';

/**
 * 数组拍平
 */
const getFlatMenu = (data: MenuDataItem[]): { [key: string]: MenuDataItem } => {
  let menus: { [key: string]: MenuDataItem } = {};

  data.forEach(item => {
    if (!item || !item.path) {
      return;
    }
    menus[item.path || '/'] = item;

    if (item.children) {
      menus = getFlatMenu(item.children);
    }
  });

  return menus;
};

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

export default getMathMenu;
