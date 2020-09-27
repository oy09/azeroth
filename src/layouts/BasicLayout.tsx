import './BasicLayout.scss';
import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import { Layout } from 'antd';
import { omit } from 'lodash';
import { WithFalse, MenuDataItem, RouterTypes, Route } from '@/typing';
import RouteContext from '@/utils/RouteContext';
import useMergedState from '@/utils/hooks/useMergedState';
import getMenuData from '@/utils/getMenuData';
import getMatchMenu from '@/utils/getMatchMenu';
import AppMain from './AppMain';
import Siderbar, { SiderbarProps } from './Siderbar';
import Header, { HeaderProps } from './Header';
import Footer, { FooterProps } from './Footer';
import defaultSetting from './defaultSettings';
import useDocumentTitle, {
  Info as TitleInfo,
} from '@/utils/hooks/useDocumentTitle';

export type BasicLayoutProps = Partial<RouterTypes<Route>> &
  SiderbarProps &
  HeaderProps &
  FooterProps & {
    prefixCls?: string;
    className?: string;
    style?: CSSProperties;
    contentStyle?: CSSProperties;
    logo?: React.ReactNode;
    collapsed?: boolean;
    siderWidth?: number;
    onCollapse?: (collapsed: boolean) => void;
    footerRender?: WithFalse<
      (props: any, defaultDom: React.ReactNode) => React.ReactNode
    >;
    headerRender?: WithFalse<
      (props: any, defautDom: React.ReactNode) => React.ReactNode
    >;
    menuDataRender?: (data: MenuDataItem[]) => MenuDataItem[];
    isMobile?: boolean;
    fixSiderbar?: boolean;
  };

const renderSiderbar = (props: BasicLayoutProps): React.ReactNode => {
  return <Siderbar {...props} />;
};

const renderHeader = (props: BasicLayoutProps): React.ReactNode => {
  if (props.headerRender === false) {
    return null;
  }
  return <Header {...props} />;
};

const renderNavTag = (props: BasicLayoutProps): React.ReactNode => {
  const style: CSSProperties = {
    padding: '10px 0',
  };

  return <div style={style}>nav tag list</div>;
};

const renderFooter = (props: BasicLayoutProps): React.ReactNode => {
  const { footerRender } = props;
  if (footerRender === false) {
    return null;
  }
  return <Footer {...props} />;
};

const renderDeafultTitle = (
  props: BasicLayoutProps,
  menuData?: MenuDataItem[],
): TitleInfo => {
  const getTitle = (item: MenuDataItem) => `${item.title}-${props.title}`;

  const currentRoute = getMatchMenu(props.location?.pathname, menuData) || {
    title: props.title,
  };
  return {
    title: getTitle(currentRoute),
    id: '',
    pageName: currentRoute.title || '',
  };
};

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const {
    style,
    prefixCls,
    isMobile,
    // collapsed,
    location,
    route = {
      routes: [],
    },
    siderWidth,
    contentStyle,
    onCollapse: propsOnCollapse,
    ...rest
  } = props;
  // console.log('basicLayout props:', props);
  const { routes = [] } = route;

  const [collapsed, onCollapse] = useMergedState<boolean>(false, {
    value: props.collapsed,
    onChange: propsOnCollapse,
  });
  const [menuInfoData] = useMergedState<{ menuData?: MenuDataItem[] }>(() =>
    getMenuData(routes),
  );

  const { menuData } = menuInfoData;
  const pageInfo = renderDeafultTitle(props, menuData);
  useDocumentTitle(pageInfo, '智能管理平台');

  const defaultProps = omit<BasicLayoutProps>(
    {
      ...props,
      breadcrumb: [],
    },
    ['className', 'style'],
  );

  console.log('BasicLayout render props:', menuData);
  const siderbarDom = renderSiderbar({
    ...defaultProps,
    menuData,
    isMobile,
    collapsed,
    onCollapse,
    theme: 'dark',
  });

  const headerDom = renderHeader({
    ...defaultProps,
    menuData,
    isMobile,
    collapsed,
    onCollapse,
    theme: 'dark',
    headerHeight: 48,
  });

  const navDom = renderNavTag({
    ...defaultProps,
    menuData,
    theme: 'dark',
  });

  const footerDom = renderFooter({
    ...defaultProps,
    isMobile,
    collapsed,
    copyRight: '艾泽拉斯星球',
  });

  const basicClassName = `${prefixCls}-basicLayout`;
  const className = classnames(props.className, basicClassName, {
    [`${basicClassName}-mobile`]: isMobile,
  });

  const contextClassName = classnames(`${basicClassName}-content`, {
    //
  });

  return (
    <RouteContext.Provider
      value={{
        prefixCls,
        isMobile,
        collapsed,
        siderWidth,
        menuData,
      }}
    >
      <div className={className}>
        <Layout
          style={{
            minHeight: '100%',
            ...style,
          }}
          hasSider
        >
          {siderbarDom}
          <Layout>
            {headerDom}
            <AppMain
              {...rest}
              className={contextClassName}
              style={contentStyle}
            >
              {props.children}
            </AppMain>
            {footerDom}
          </Layout>
        </Layout>
      </div>
    </RouteContext.Provider>
  );
};

BasicLayout.defaultProps = {
  ...defaultSetting,
  logo: '/favicon.png',
  prefixCls: 'az',
  siderWidth: 208,
};

export default BasicLayout;
