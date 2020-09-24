import './Header.scss';

import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import { Layout } from 'antd';
import { PureSettings } from './defaultSettings';

export type HeaderProps = Partial<PureSettings> & {
  isMobile?: boolean;
  collapsed?: boolean;
  logo?: React.ReactNode;
  siderWidth?: number;
  className?: string;
  style?: CSSProperties;
  prefixCls?: string;
  headerHeight?: number;
};

class Header extends React.PureComponent<HeaderProps, any> {
  renderContent() {
    const { prefixCls } = this.props;
    const headerClass = `${prefixCls}-pro-global-header`;
    const navClass = `${prefixCls}-pro-global-index-navcrumb`;

    let defaultDom = (
      <div style={{ background: '#fff' }} className={headerClass}>
        <div className={navClass}>面包屑导航</div>
        <div style={{ flex: '1 1 0%' }}></div>
        <div className="pro-global-index-right">
          <span>使用文档</span>
          <span>消息通知</span>
          <span>用户icon</span>
          <span>iln8</span>
        </div>
      </div>
    );

    return defaultDom;
  }

  render() {
    const {
      style: styleProps,
      className: classNameProps,
      prefixCls,
      headerHeight,
    } = this.props;

    const baseClassName = `${prefixCls}-header`;
    const classNames = classnames(classNameProps, baseClassName);

    const width = '100%';
    const right = 0;

    const style: CSSProperties = {
      padding: 0,
      height: `${headerHeight}px`,
      lineHeight: `${headerHeight}px`,
      width,
      right,
      ...styleProps,
    };

    return (
      <Layout.Header style={style} className={classNames}>
        {this.renderContent()}
      </Layout.Header>
    );
  }
}

export default Header;
