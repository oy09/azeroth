import './UserLayout.scss';
import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import { Link } from 'umi';
import { DefaultFooter } from '@ant-design/pro-layout';

export interface UserLayoutProps {
  style?: CSSProperties;
  className?: string;
  prefixCls?: string;
}

const UserLayout: React.FC<UserLayoutProps> = props => {
  const { children, prefixCls = 'az' } = props;

  const basicClassName = `${prefixCls}-userLayout`;
  const className = classnames(props.className, basicClassName, {
    //
  });

  return (
    <div className={className}>
      <div className="content">
        <div className="top">
          <div className="header">
            <Link to="/">
              {/* <img src="/favicon.png" className="logo" alt="logo" title="logo" /> */}
              <span className="title">后台管理系统</span>
            </Link>
          </div>
          <div className="desc">南沙部落运营</div>
        </div>
        <div className="main">{children}</div>
      </div>
      <DefaultFooter />
    </div>
  );
};

UserLayout.defaultProps = {
  prefixCls: 'az',
};

export default UserLayout;
