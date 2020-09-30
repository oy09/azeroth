import H from 'history';
import path from 'path';
import { pathToRegexp } from 'path-to-regexp';
import { MenuDataItem } from '@/typing';
import isBrowser from '@/utils/isBrowser';

export interface BreadcrumbProps {
  home?: string;
  location?: H.Location | { pathname?: string };
  breadcrumbMap?: Map<string, MenuDataItem>;
  breadcrumbRender?: (routers: any) => BreadcrumbItemType[];
}

export type BreadcrumbItemType = {
  // 路由路径
  path: string;
  // 名称
  name: string;
  target?: string;
  // 隐藏面包屑
  hiddenBreadcrumb?: boolean;
  // 参数
  query?: any;
  // 租金
  component?: any;
  // 重定向
  needRedirect?: string;
};

export interface BreadcrumbReturn {
  breadcrumb: BreadcrumbItemType[];
}

// 路由路径转换数组
const routePathToList = (url: string): string[] => {
  if (!url || url === '/') {
    return ['/'];
  }
  const urlList = url.split('/').filter(i => i);
  return urlList.map(
    (item, index) => `/${urlList.slice(0, index + 1).join('/')}`,
  );
};

const getBreadcrumb = (
  map: Map<string, MenuDataItem>,
  url: string,
): MenuDataItem => {
  if (!map) {
    return {
      path: '',
    };
  }
  let breadcrumb = map.get(url);
  if (!breadcrumb) {
    const targetPath = [...map.keys()].find(path => {
      // @ts-ignore
      return pathToRegexp(path.replace('?', '')).test(url);
    });
    if (targetPath) {
      breadcrumb = map.get(targetPath);
    }
  }

  return breadcrumb || { path: '' };
};

const getBreadcrumbList = (props: BreadcrumbProps): BreadcrumbItemType[] => {
  const { location, breadcrumbMap } = props;
  if (location && location.pathname && breadcrumbMap) {
    const pathList = routePathToList(location.pathname);
    const items = pathList
      .map(url => {
        // @ts-ignore
        const { routerBase = '/' } = isBrowser() ? window : {};
        const realPath = routerBase === '/' ? url : path.join(routerBase, url);
        const breadcrumbItem = getBreadcrumb(breadcrumbMap, url);
        if (breadcrumbItem.hidden || !breadcrumbItem.title) {
          return {
            path: '',
            name: '',
          };
        }

        return {
          path: realPath,
          name: breadcrumbItem.title,
          component: breadcrumbItem.component,
        };
      })
      .filter(item => item && item.path);
    return items;
  }
  return [];
};

export const getBreadcrumbProps = (
  props: BreadcrumbProps,
): BreadcrumbReturn => {
  const { breadcrumbRender } = props;
  const breadcrumbRoutes = getBreadcrumbList(props);
  let routes = breadcrumbRoutes;
  if (breadcrumbRender) {
    routes = breadcrumbRender(routes);
  }

  return {
    breadcrumb: routes,
  };
};
