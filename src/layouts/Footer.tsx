import './Footer.scss';

import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import { Layout } from 'antd';
import { WithFalse } from '@/typing';

export interface FooterProps {
  links?: WithFalse<{
    key?: string;
    title: React.ReactNode;
    href: string;
    blankTarget?: boolean;
  }>;
  copyRight?: WithFalse<string>;
  style?: CSSProperties;
  className?: string;
  prefixCls?: string;
}

const Footer: React.FC<FooterProps> = props => {
  const { style, prefixCls, className } = props;
  const baseClassName = `${prefixCls}-footer`;
  const classNames = classnames(className, baseClassName);

  return (
    <Layout.Footer className={classNames} style={{ padding: 0, ...style }}>
      footer
    </Layout.Footer>
  );
};

export default Footer;
