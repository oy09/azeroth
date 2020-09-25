import './Header.scss';

import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import { Layout } from 'antd';
import { PureSettings } from './defaultSettings';
import { WithFalse } from '@/typing';

export type HeaderProps = Partial<PureSettings> & {
  isMobile?: boolean;
  collapsed?: boolean;
  logo?: React.ReactNode;
  siderWidth?: number;
  className?: string;
  style?: CSSProperties;
  prefixCls?: string;
  headerHeight?: number;
  contentRender?: WithFalse<(props: HeaderProps) => React.ReactNode>;
  rightContentRender?: WithFalse<(props: HeaderProps) => React.ReactNode>;
};

class Header extends React.PureComponent<HeaderProps, any> {
  renderContent() {
    const { prefixCls, contentRender, rightContentRender } = this.props;
    const headerCls = `${prefixCls}-global-header`;
    const rightCls = `${prefixCls}-global-header-right`;
    const navCls = `${prefixCls}-global-header-nav`;

    let defaultDom = (
      <div style={{ background: '#fff' }} className={headerCls}>
        <div className={navCls}>breadcrumb</div>
        <div style={{ flex: '1 1 0%' }}>
          {contentRender && contentRender(this.props)}
        </div>
        <div className={rightCls}>
          {rightContentRender && rightContentRender(this.props)}
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
