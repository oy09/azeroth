import './BasicLayout.scss';
import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import { Layout } from 'antd';
import RouteContext from '@/utils/RouteContext';

export interface BasicLayoutProps {
  prefixCls?: string;
  className?: string;
  style?: CSSProperties;
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
    fixSiderbar,
  } = props;

  const basicClassName = `${prefixCls}-basicLayout`;
  const className = classnames(props.className, basicClassName, {
    [`${basicClassName}-fix-siderbar`]: fixSiderbar,
    [`${basicClassName}-mobile`]: isMobile,
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
          <div>{props.children}</div>
          <div>footerDom</div>
        </Layout>
      </Layout>
    </RouteContext.Provider>
  );
};

BasicLayout.defaultProps = {
  prefixCls: 'az',
  siderWidth: 208,
  fixSiderbar: true,
};

export default BasicLayout;
