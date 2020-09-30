import './AuthorizeLayout.scss';
import React from 'react';
import BasicLayout from './BasicLayout';
import { BreadcrumbItemType } from './getBreadcrumbProps';
import classnames from 'classnames';
import { head } from 'lodash';

export interface LayoutProps {
  className?: string;
}

const Layout: React.FC<LayoutProps> = props => {
  const headerRightMenu = (
    <React.Fragment>
      <span className="header-action">使用说明</span>
      <span className="header-action">通知信息</span>
      <span className="header-action">用户菜单</span>
      <span className="header-action">国际化</span>
    </React.Fragment>
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

  const authCls = classnames('authorize-layout', props.className);

  return (
    <BasicLayout
      {...props}
      className={authCls}
      breadcrumbRender={breadcrumbDataRender}
      rightContentRender={() => headerRightMenu}
    >
      {props.children}
    </BasicLayout>
  );
};

export default Layout;
