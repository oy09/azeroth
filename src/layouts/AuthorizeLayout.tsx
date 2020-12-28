import './AuthorizeLayout.scss';
import React, { useState, useEffect } from 'react';
import { PageLoading } from '@ant-design/pro-layout';
import { useStore, Redirect } from 'umi';
import BasicLayout from './BasicLayout';
import { BreadcrumbItemType } from '@/utils/getBreadcrumbProps';
import RightContent from '@/components/GlobalHeader/RightContent';
import classnames from 'classnames';
import { head, isEmpty } from 'lodash';
import { stringify } from 'qs';

export interface LayoutProps {
  className?: string;
}

const Layout: React.FC<LayoutProps> = props => {
  const [collapsed, setCollapsed] = useState(() =>
    localStorage.getItem('sidebarState') ? !!+(localStorage.getItem('sidebarState') as string) : false,
  );
  const [ready, setReady] = useState<boolean>(false);

  const { getState, dispatch } = useStore();

  // 判断是否登录
  useEffect(() => {
    setReady(true);
    dispatch({
      type: 'user/getUser',
    });
    dispatch({
      type: 'user/getMenu',
    });
  }, []);

  const breadcrumbDataRender = (data: BreadcrumbItemType[]): BreadcrumbItemType[] => {
    const isHome = (route?: BreadcrumbItemType): boolean => {
      const name = route && route.path;
      if (!name) {
        return false;
      }
      return name.trim().toLocaleLowerCase() === '/home'.trim().toLocaleLowerCase();
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
    // console.log('collapse:', value);
  };

  const classNames = classnames('authorize-layout', props.className);

  const {
    user: { user },
    loading: {
      models: { user: loading },
    },
  } = getState();

  const isLogin = !isEmpty(user);

  // 页面加载
  if ((!isLogin && loading) || !ready) {
    return <PageLoading />;
  }

  // 判断是否登录
  if (!isLogin && window.location.pathname !== '/user/login') {
    const queryString = stringify({
      redirect: window.location.href,
    });
    return <Redirect to={`/user/login?${queryString}`} />;
  }

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
