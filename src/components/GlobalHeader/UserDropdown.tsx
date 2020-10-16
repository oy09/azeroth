import React from 'react';
import classnames from 'classnames';
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Dropdown, Avatar, Menu } from 'antd';
import './UserDropdown.scss';

export interface UserDropdownProsp {
  className?: string;
}

const UserDropdown: React.FC<UserDropdownProsp> = props => {
  const { className } = props;
  const classNames = classnames('user-dropdown', className);

  const handleMenuClick = (event?: any) => {
    //
  };

  const menu = (
    <Menu className="user-menu" selectedKeys={[]} onClick={handleMenuClick}>
      <Menu.Item key="center">
        <UserOutlined />
        个人中心
      </Menu.Item>
      <Menu.Item key="settings">
        <SettingOutlined />
        个人设置
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <div className={classNames}>
      <Dropdown overlay={menu}>
        <span>
          <Avatar size="small" alt="avatar" src="/favicon.png" />
          <span className="user-name">欧阳</span>
        </span>
      </Dropdown>
    </div>
  );
};

export default UserDropdown;
