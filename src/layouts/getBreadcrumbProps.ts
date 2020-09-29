import { MenuDataItem } from '@/typing';
import H from 'history';
import pathToRegexp from 'path-to-regexp';
import { BreadcrumbItemType } from './Header';

export interface BreadcrumbProps {
  home?: string;
  location?: H.Location | { pathname?: string };
  breadcrumbMap?: Map<string, MenuDataItem>;
}

const urlToList = (url: string): string[] => {
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

export const getBreadcrumbProps = (
  props: BreadcrumbProps,
): BreadcrumbItemType[] => {
  const { location, breadcrumbMap } = props;

  if (location && location.pathname && breadcrumbMap) {
    // @ts-ignore
    const { routerBase = '/' } = window || {};
    const pathList = urlToList(location.pathname);
    const items = pathList
      .map(url => {
        const realPath = routerBase === '/' ? url : `${routerBase}${url}`;
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
