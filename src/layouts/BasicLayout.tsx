import './BasicLayout.scss';
import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import { Layout } from 'antd';
import { omit } from 'lodash';
import { WithFalse, MenuDataItem, RouterTypes, Route } from '@/typing';
import RouteContext from '@/utils/RouteContext';
import useMergedState from '@/utils/hooks/useMergedState';
import getMenuData from '@/utils/getMenuData';
import AppMain from './AppMain';
import Siderbar, { SiderbarProps } from './Siderbar';
import defaultSetting from './defaultSettings';

export type BasicLayoutProps = Partial<RouterTypes<Route>> &
  SiderbarProps & {
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
    menuDataRender?: (data: MenuDataItem[]) => MenuDataItem[];
    isMobile?: boolean;
    fixSiderbar?: boolean;
  };

const renderSiderbar = (props: BasicLayoutProps): React.ReactNode => {
  return <Siderbar {...props} />;
};

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const {
    style,
    prefixCls,
    isMobile,
    // collapsed,
    route = {
      routes: [],
    },
    siderWidth,
    contentStyle,
    onCollapse: propsOnCollapse,
    ...rest
  } = props;
  console.log('basicLayout props:', props);
  const { routes = [] } = route;

  const [collapsed, onCollapse] = useMergedState<boolean>(false, {
    value: props.collapsed,
    onChange: propsOnCollapse,
  });
  const [menuInfoData] = useMergedState<{ menuData?: MenuDataItem[] }>(() =>
    getMenuData(routes),
  );
  const { menuData } = menuInfoData;

  const defaultProps = omit(
    {
      ...props,
    },
    ['className', 'style'],
  );

  const siderbarDom = renderSiderbar({
    ...defaultProps,
    menuData,
    isMobile,
    collapsed,
    onCollapse,
    theme: 'dark',
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
            <div>headerMenuDom</div>
            <AppMain
              {...rest}
              className={contextClassName}
              style={contentStyle}
            >
              {props.children}
            </AppMain>
            <div>footerDom</div>
          </Layout>
        </Layout>
      </div>
    </RouteContext.Provider>
  );
};

BasicLayout.defaultProps = {
  ...defaultSetting,
  logo: './favicon.png',
  prefixCls: 'az',
  siderWidth: 208,
};

export default BasicLayout;
