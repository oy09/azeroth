import React, { CSSProperties } from 'react';
import { Menu } from 'antd';
import { MenuProps, MenuMode } from 'antd/es/menu';
import { MenuTheme } from 'antd/es/menu/MenuContext';
import { WithFalse, MenuDataItem } from '@/typing';

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
      <Menu.Item key={1}>菜单1</Menu.Item>
      <Menu.Item key={2}>菜单2</Menu.Item>
      <Menu.Item key={3}>菜单3</Menu.Item>
      <Menu.Item key={4}>菜单4</Menu.Item>
      <Menu.Item key={5}>菜单5</Menu.Item>
      <Menu.Item key={6}>菜单6</Menu.Item>
    </Menu>
  );
};

export default MenuList;
