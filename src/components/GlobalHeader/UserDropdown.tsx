import React from 'react';
import classnames from 'classnames';
import { UserOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import { Dropdown, Avatar, Menu } from 'antd';
import { useDispatch } from 'umi';
import { AntdMenuEvent } from '@/typing';
import './UserDropdown.scss';

interface MenuHandler {
  [key: string]: (event: AntdMenuEvent) => void;
}

export interface UserDropdownProsp {
  className?: string;
}

const UserDropdown: React.FC<UserDropdownProsp> = props => {
  const dispatch = useDispatch();

  const { className } = props;
  const classNames = classnames('user-dropdown', className);

  const menuHandler: MenuHandler = {
    center: event => {},
    settings: event => {
      //
    },
    logout: event => {
      dispatch({ type: 'user/logout' });
    },
  };

  const handleMenuClick = (event: AntdMenuEvent) => {
    if (menuHandler[event.key]) {
      menuHandler[event.key](event);
    } else {
      console.warn('用户下拉菜单未设置监听事件');
    }
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
