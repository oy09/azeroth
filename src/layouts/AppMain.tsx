import React, { CSSProperties } from 'react';
import { Layout } from 'antd';

export interface AppMainProps {
  className?: string;
  style?: CSSProperties;
}

const AppMain: React.FC<AppMainProps> = props => {
  const { style, className, children } = props;

  return (
    <Layout.Content className={className} style={style}>
      {children}
    </Layout.Content>
  );
};

export default AppMain;
