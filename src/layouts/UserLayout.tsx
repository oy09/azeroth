import './UserLayout.scss';
import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import { Link } from 'umi';
import { DefaultFooter } from '@ant-design/pro-layout';
import { RouterTypes, Route } from '@/typing';
import getMenuData from '@/utils/getMenuData';
import getMatchMenu from '@/utils/getMatchMenu';
import useDocumentTitle from '@/utils/hooks/useDocumentTitle';

export type UserLayoutProps = Partial<RouterTypes<Route>> & {
  style?: CSSProperties;
  className?: string;
  prefixCls?: string;
};

const UserLayout: React.FC<UserLayoutProps> = props => {
  const {
    children,
    route = {
      routes: [],
    },
    location = {
      pathname: '',
    },
    prefixCls = 'az',
  } = props;
  const { routes } = route;
  const { menuData } = getMenuData(routes);
  const currentRoute = getMatchMenu(location.pathname, menuData);
  const pageTitle = currentRoute.title || '';

  useDocumentTitle({ title: pageTitle, id: '', pageName: pageTitle }, '登录');

  const basicClassName = `${prefixCls}-userLayout`;
  const className = classnames(props.className, basicClassName, {
    //
  });

  return (
    <div className={className}>
      <div className="content">
        <div className="top">
          <div className="header">
            <Link to="/">
              {/* <img src="/favicon.png" className="logo" alt="logo" title="logo" /> */}
              <span className="title">后台管理系统</span>
            </Link>
          </div>
          <div className="desc">南沙部落运营</div>
        </div>
        <div className="main">{children}</div>
      </div>
      <DefaultFooter />
    </div>
  );
};

UserLayout.defaultProps = {
  prefixCls: 'az',
};

export default UserLayout;
