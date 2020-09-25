import './AuthorizeLayout.scss';
import React from 'react';
import BasicLayout from './BasicLayout';
import classnames from 'classnames';

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

  const authCls = classnames('authorize-layout', props.className);

  return (
    <BasicLayout
      {...props}
      className={authCls}
      rightContentRender={() => headerRightMenu}
    >
      {props.children}
    </BasicLayout>
  );
};

export default Layout;
