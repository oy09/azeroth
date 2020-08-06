import './BasicLayout.scss';
import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import { Layout } from 'antd';
import RouteContext from '@/utils/RouteContext';
import AppMain from './AppMain';

export interface BasicLayoutProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
  contentStyle?: CSSProperties;
  logo?: React.ReactNode;
  collapsed?: boolean;
  siderWidth?: number;
  onCollapse?: any;
  menuItemRender?: any;
  footerRender?: any;
  menuDataRender?: any;
  fixSiderbar?: boolean;
  isMobile?: boolean;
}

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  const {
    style,
    prefixCls,
    isMobile,
    collapsed,
    siderWidth,
    contentStyle,
    ...rest
  } = props;

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
          <div>siderMenuDom</div>
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
  prefixCls: 'az',
  siderWidth: 208,
  fixSiderbar: true,
};

export default BasicLayout;
