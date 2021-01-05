import './FooterToolbar.scss';
import React, { CSSProperties, useContext, useMemo } from 'react';
import { Space } from 'antd';
import classnames from 'classnames';
import RouteContext from '@/utils/RouteContext';

export interface FooterToolbar {
  className?: string;
  extra?: React.ReactNode;
  style?: CSSProperties;
  prefixCls?: string;
}

const FooterToolbar: React.FC<FooterToolbar> = props => {
  const { extra, children, className, prefixCls = 'az', ...resetProps } = props;

  const baseClassName = `${prefixCls}-footer-toolbar`;
  const value = useContext(RouteContext);
  const width = useMemo(() => {
    const { isMobile, siderWidth } = value;
    if (!siderWidth) {
      return '100%';
    }
    return isMobile ? '100%' : `calc(100% - ${siderWidth}px)`;
  }, [value.collapsed, value.isMobile, value.siderWidth]);

  return (
    <div className={classnames(className, baseClassName)} style={{ width }} {...resetProps}>
      <div className={`${baseClassName}-left`}>{extra}</div>
      <div className={`${baseClassName}-right`}>
        <Space>{children}</Space>
      </div>
    </div>
  );
};

export default FooterToolbar;
