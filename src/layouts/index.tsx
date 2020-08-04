import React from 'react';

export interface LayoutProps {}

const Layout: React.FC<LayoutProps> = props => {
  return (
    <div>
      <div>title</div>
      <div>{props.children}</div>
    </div>
  );
};

export default Layout;
