import './UserLayout.scss';
import React, { CSSProperties } from 'react';
import classnames from 'classnames';

export interface UserLayoutProps {
  style?: CSSProperties;
  className?: string;
  prefixCls?: string;
}

const UserLayout: React.FC<UserLayoutProps> = props => {
  const { children, prefixCls } = props;

  const basicClassName = `${prefixCls}-userLayout`;
  const className = classnames(props.className, basicClassName, {
    //
  });

  return <div className={className}>{children}</div>;
};

UserLayout.defaultProps = {
  prefixCls: 'az',
};

export default UserLayout;
