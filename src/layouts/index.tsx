import React from 'react';
import BasicLayout from './BasicLayout';

export interface LayoutProps {}

const Layout: React.FC<LayoutProps> = props => {
  return <BasicLayout {...props}>{props.children}</BasicLayout>;
};

export default Layout;
