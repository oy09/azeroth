import React, { CSSProperties } from 'react';
import { Menu } from 'antd';
import { MenuProps, MenuMode } from 'antd/es/menu';
import { MenuTheme } from 'antd/es/menu/MenuContext';
import { WithFalse, MenuDataItem } from '@/typing';
import Item from 'antd/lib/list/Item';

export interface MenuListProps {
  className?: string;
  style?: CSSProperties;
  collapsed?: boolean;
  handleOpenChange?: (openKeys: string[]) => void;
  onCollapse?: (collapsed: boolean) => void;
  openKeys?: WithFalse<string[]> | undefined;
  menuProps?: MenuProps;
  theme?: MenuTheme;
  mode?: MenuMode;
  menuData?: MenuDataItem[];
  isMobile?: boolean;
}

const MenuList: React.FC<MenuListProps> = props => {
  const { mode, style, theme, className, menuProps } = props;
  const utils = new MenuUtil(props);
  console.log('menuData:', props.menuData);

  return (
    <Menu
      key="Menu"
      mode={mode}
      theme={theme}
      style={style}
      inlineIndent={16}
      className={className}
      selectedKeys={[]}
      defaultOpenKeys={[]}
      {...menuProps}
    >
      {utils.getNavMenu(props.menuData, false)}
    </Menu>
  );
};

export default MenuList;

class MenuUtil {
  props: MenuListProps;

  constructor(props: MenuListProps) {
    this.props = props;
  }

  getNavMenu(data: MenuDataItem[] = [], isChildren: boolean) {
    return data
      .filter(item => item.name && !item.hidden)
      .map(item => this.getSubNavMenu(item, isChildren))
      .filter(item => item);
  }

  getSubNavMenu(data: MenuDataItem, isChildren: boolean) {
    if (Array.isArray(data.children) && this.hasChildren(data)) {
      const name = this.getInitName(data);
      const defaultTitle = (
        <span>
          <i className="menu-icon" />
          <span>{name}</span>
        </span>
      );

      const title = defaultTitle;

      return (
        <Menu.SubMenu title={title} key={data.key || data.path}>
          {this.getSubNavMenu(data.children, true)}
        </Menu.SubMenu>
      );
    }
    return (
      <Menu.Item key={data.key || data.path}>
        {this.getMenuItemPath(data, isChildren)}
      </Menu.Item>
    );
  }

  getMenuItemPath(data: MenuDataItem, isChildren: boolean) {
    return data.name;
  }

  getInitName(data: MenuDataItem) {
    return data.name;
  }

  hasChildren(data: MenuDataItem) {
    return (
      data &&
      !data.hidden &&
      data?.children &&
      data?.children.some(child => child && !!child.name && !!child.hidden)
    );
  }
}
