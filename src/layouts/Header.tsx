import './Header.scss';

import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import { Layout, Breadcrumb } from 'antd';
import { Link } from 'umi';
import { PureSettings } from './defaultSettings';
import { WithFalse } from '@/typing';
import { isUrl } from '@/utils/typeUtils';
import { BreadcrumbItemType } from '@/utils/getBreadcrumbProps';

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
  // 需要面包屑数据
  breadcrumb?: BreadcrumbItemType[];
  breadcrumbItemRender?: (
    value: BreadcrumbItemType,
    index: number,
  ) => React.ReactNode;
};

class Header extends React.PureComponent<HeaderProps, any> {
  renderContent() {
    const {
      prefixCls,
      contentRender,
      rightContentRender,
      breadcrumb,
      breadcrumbItemRender,
    } = this.props;
    const headerCls = `${prefixCls}-global-header`;
    const rightCls = `${prefixCls}-global-header-right`;
    const navCls = `${prefixCls}-global-header-nav`;

    console.log('header content props:', this.props);

    let defaultDom = (
      <div style={{ background: '#fff' }} className={headerCls}>
        {Array.isArray(breadcrumb) && breadcrumb.length > 0 && (
          <div className={navCls}>
            <Breadcrumb>
              {breadcrumb.map((item, index) => {
                if (breadcrumbItemRender) {
                  return (
                    <Breadcrumb.Item key={item.path}>
                      {breadcrumbItemRender(item, index)}
                    </Breadcrumb.Item>
                  );
                }
                if (!item.hiddenBreadcrumb && item.name) {
                  if (isUrl(item.path)) {
                    return (
                      <Breadcrumb.Item key={item.path}>
                        <a
                          href={item.path}
                          target={item.target || '_blank'}
                          title={item.name}
                        >
                          {item.name}
                        </a>
                      </Breadcrumb.Item>
                    );
                  } else if (index === breadcrumb.length - 1) {
                    return (
                      <Breadcrumb.Item key={item.path}>
                        {item.name}
                      </Breadcrumb.Item>
                    );
                  } else if (item.needRedirect) {
                    return (
                      <Breadcrumb.Item key={item.path}>
                        <Link to={item.needRedirect}>{item.name}</Link>
                      </Breadcrumb.Item>
                    );
                  } else {
                    return (
                      <Breadcrumb.Item key={item.path}>
                        <Link to={item.path}>{item.name}</Link>
                      </Breadcrumb.Item>
                    );
                  }
                }
              })}
            </Breadcrumb>
          </div>
        )}
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
