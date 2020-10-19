import './AuthorizeLayout.scss';
import React, { useState } from 'react';
import BasicLayout from './BasicLayout';
import { BreadcrumbItemType } from '@/utils/getBreadcrumbProps';
import RightContent from '@/components/GlobalHeader/RightContent';
import classnames from 'classnames';
import { head } from 'lodash';

export interface LayoutProps {
  className?: string;
}

const Layout: React.FC<LayoutProps> = props => {
  const [collapsed, setCollapsed] = useState(() =>
    localStorage.getItem('sidebarState')
      ? !!+(localStorage.getItem('sidebarState') as string)
      : false,
  );

  const breadcrumbDataRender = (
    data: BreadcrumbItemType[],
  ): BreadcrumbItemType[] => {
    const isHome = (route?: BreadcrumbItemType): boolean => {
      const name = route && route.path;
      if (!name) {
        return false;
      }
      return (
        name.trim().toLocaleLowerCase() === '/home'.trim().toLocaleLowerCase()
      );
    };
    if (!isHome(head<BreadcrumbItemType>(data))) {
      data.unshift({ path: '/home', name: '首页' });
    }
    return data;
  };

  // 本地记录菜单状态
  const handleCollapse = (value: boolean) => {
    setCollapsed(value);
    if (collapsed) {
      localStorage.setItem('sidebarState', '0');
    } else {
      localStorage.setItem('sidebarState', '1');
    }
    console.log('collapse:', value);
  };

  const classNames = classnames('authorize-layout', props.className);

  return (
    <BasicLayout
      {...props}
      className={classNames}
      collapsed={collapsed}
      breadcrumbRender={breadcrumbDataRender}
      rightContentRender={() => <RightContent />}
      onCollapse={handleCollapse}
    >
      {props.children}
    </BasicLayout>
  );
};

export default Layout;
