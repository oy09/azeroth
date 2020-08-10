import React from 'react';
import BasicLayout from './BasicLayout';

export interface LayoutProps {}

const Layout: React.FC<LayoutProps> = props => {
  const handleCollapse = (collapsed: boolean) => {
    console.log('collapsed:', collapsed);
  };

  return (
    <BasicLayout onCollapse={handleCollapse} {...props}>
      {props.children}
    </BasicLayout>
  );
};

export default Layout;
