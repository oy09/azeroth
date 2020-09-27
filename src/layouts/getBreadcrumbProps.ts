import { MenuDataItem } from '@/typing';
import H from 'history';
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

export const getBreadcrumbProps = (
  props: BreadcrumbProps,
): BreadcrumbItemType[] => {
  const { location, breadcrumbMap } = props;

  if (location && location.pathname && breadcrumbMap) {
    const pathList = urlToList(location.pathname);
    console.log('pathList:', pathList);
  }

  return [];
};
