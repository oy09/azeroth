import React, { CSSProperties, useState } from 'react';
import { Menu } from 'antd';
import { Link } from 'umi';
import Icon, { createFromIconfontCN } from '@ant-design/icons';
import { MenuProps, MenuMode } from 'antd/es/menu';
import { MenuTheme } from 'antd/es/menu/MenuContext';
import { WithFalse, MenuDataItem } from '@/typing';
import { isImg, isUrl } from '@/utils/typeUtils';
import defaultSetting from './defaultSettings';

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
  postMenuData?: (menuData?: MenuDataItem[]) => MenuDataItem[];
  isMobile?: boolean;
}

let IconFont = createFromIconfontCN({
  scriptUrl: defaultSetting.iconfontUrl,
});

const MenuList: React.FC<MenuListProps> = props => {
  const { mode, style, theme, className, menuProps, menuData } = props;
  const [menuUtils] = useState(() => new MenuUtil(props));

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
      {menuUtils.getNavMenu(menuData, false)}
    </Menu>
  );
};

export default MenuList;

/**
 * 创建图标
 */
const getIcon = (icon: string | React.ReactNode): React.ReactNode => {
  if (typeof icon === 'string' && icon !== '') {
    if (isUrl(icon) || isImg(icon)) {
      // 外链资源
      return (
        <Icon
          component={() => (
            <img src={icon} alt="icon" className="az-siderbar-menu-icon" />
          )}
        />
      );
    } else if (icon.startsWith('icon-')) {
      // 本地资源
      return <IconFont type={icon} />;
    }
  }
  return icon;
};

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
    const { path, target } = data;
    const itemPath = path || '/';
    const name = this.getInitName(data);
    const icon = isChildren ? null : getIcon(data.icon);
    let defaultItem = (
      <>
        {icon}
        <span className="oz-menu-item-title">{name}</span>
      </>
    );
    const isHttpUrl = isUrl(itemPath);

    if (isHttpUrl) {
      defaultItem = (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
    return <Link to={data.path as string}>{defaultItem}</Link>;
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
