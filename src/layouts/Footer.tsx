import './Footer.scss';

import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import { Layout } from 'antd';
import { GithubOutlined, CopyrightOutlined } from '@ant-design/icons';
import { WithFalse } from '@/typing';

type LinkItem = {
  key?: string;
  title: React.ReactNode;
  href: string;
  blankTarget?: boolean;
};

export interface FooterProps {
  links?: WithFalse<LinkItem[]>;
  copyRight?: WithFalse<string>;
  style?: CSSProperties;
  className?: string;
  prefixCls?: string;
}

const defaultLinkList: LinkItem[] = [
  {
    key: 'Ant Design Pro',
    title: 'Azeroth',
    href: 'https://www.baidu.com',
    blankTarget: true,
  },
  {
    key: 'github',
    title: <GithubOutlined />,
    href: 'https://www.github.com',
    blankTarget: true,
  },
  {
    key: 'Ant Design',
    title: 'Azeroth',
    href: 'https://www.baidu.com',
    blankTarget: true,
  },
];

const Footer: React.FC<FooterProps> = props => {
  const { style, prefixCls, className, links, copyRight } = props;
  const baseClassName = `${prefixCls}-layout-footer`;
  const classNames = classnames(className, baseClassName);
  const globalFooterCls = `${prefixCls}-global-footer`;
  const linkClassName = `${globalFooterCls}-links`;
  const copyrightClassName = `${globalFooterCls}-copyright`;
  const linkList = links || defaultLinkList;

  return (
    <Layout.Footer className={classNames} style={{ padding: 0, ...style }}>
      <footer className={globalFooterCls}>
        <div className={linkClassName}>
          {linkList.map(link => (
            <a
              key={link.key}
              title={link.key}
              target={link.blankTarget ? '_blank' : '_self'}
              href={link.href}
            >
              {link.title}
            </a>
          ))}
        </div>
        <div className={copyrightClassName}>
          {copyRight && (
            <React.Fragment>
              {'Copyright '}
              <CopyrightOutlined />
              {' ' + copyRight}
            </React.Fragment>
          )}
        </div>
      </footer>
    </Layout.Footer>
  );
};

export default Footer;
