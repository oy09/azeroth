import { Route, MenuDataItem } from '@/typing';

const defaultFilterMenuData = (data: MenuDataItem[] = []): MenuDataItem[] => {
  return data
    .filter((item: MenuDataItem) => {
      return (
        item && (item.title || item.children) && !item.hidden && !item.redirect
      );
    })
    .map((item: MenuDataItem) => {
      if (
        item.children &&
        Array.isArray(item.children) &&
        item.children.some((child: MenuDataItem) => child && child.title)
      ) {
        const children = defaultFilterMenuData(item.children);
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

const transformToBreadcrumbMap = (
  routes: Route[],
): Map<string, MenuDataItem> => {
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

  return arrayToMap(routes, new Map());
};

const getMenuData = (routes: Route[] = []) => {
  const data = defaultFilterMenuData(routes);
  const breadcrumbMap = transformToBreadcrumbMap(routes);

  return {
    menuData: data,
    // 面包屑数据
    breadcrumbMap: breadcrumbMap,
  };
};

export default getMenuData;
