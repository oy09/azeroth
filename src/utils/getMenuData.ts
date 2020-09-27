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

const getMenuData = (routes: Route[] = []) => {
  const data = defaultFilterMenuData(routes);
  return {
    menuData: data,
  };
};

export default getMenuData;
