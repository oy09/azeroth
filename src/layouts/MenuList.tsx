import React, { CSSProperties, useState, useEffect } from 'react';
import { Menu } from 'antd';
import { Link } from 'umi';
import Icon, { createFromIconfontCN } from '@ant-design/icons';
import { PageLoading } from '@ant-design/pro-layout';
import { MenuProps, MenuMode } from 'antd/es/menu';
import { MenuTheme } from 'antd/es/menu/MenuContext';
import { WithFalse, MenuDataItem, RouterTypes, Route } from '@/typing';
import { isImg, isUrl } from '@/utils/typeUtils';
import useMergedState from '@/utils/hooks/useMergedState';
import { getSelectedMenuKeys } from '@/utils/getMatchMenu';
import defaultSetting from './defaultSettings';

export interface MenuListProps extends Partial<RouterTypes<Route>> {
  className?: string;
  style?: CSSProperties;
  prefixCls?: string;
  collapsed?: boolean;
  handleOpenChange?: (openKeys: string[]) => void;
  onCollapse?: (collapsed: boolean) => void;
  onSelect?: (keys: string[]) => void;
  selectedKeys?: string[];
  openKeys?: WithFalse<string[]> | undefined;
  menuProps?: MenuProps;
  theme?: MenuTheme;
  mode?: MenuMode;
  menuData?: MenuDataItem[];
  postMenuData?: (menuData?: MenuDataItem[]) => MenuDataItem[];
  loading?: boolean;
  isMobile?: boolean;
}

let IconFont = createFromIconfontCN({
  scriptUrl: defaultSetting.iconfontUrl,
});

const MenuList: React.FC<MenuListProps> = props => {
  const {
    mode,
    style,
    theme,
    className,
    menuProps,
    menuData,
    onSelect,
    collapsed,
    location = {
      pathname: '/',
    },
    selectedKeys: propsSelectedKeys,
  } = props;
  const [menuUtils] = useState(() => new MenuUtil(props));

  const [selectedKeys, setSelectedKeys] = useMergedState<string[] | undefined>([], {
    value: propsSelectedKeys,
    onChange: onSelect
      ? keys => {
          if (onSelect && keys) {
            onSelect(keys);
          }
        }
      : undefined,
  });

  useEffect(() => {
    const keys = getSelectedMenuKeys(location.pathname || '/', menuData || []);
    const animationId = requestAnimationFrame(() => {
      if (keys.join('-') !== (selectedKeys || []).join('-')) {
        setSelectedKeys(keys);
      }
    });

    return () => window.cancelAnimationFrame && window.cancelAnimationFrame(animationId);
  }, [location.pathname, collapsed]);

  if (props.loading) {
    return <PageLoading />;
  }

  const finalData = props.postMenuData ? props.postMenuData(menuData) : menuData;

  if (finalData && finalData?.length < 1) {
    return null;
  }

  return (
    <Menu
      key="Menu"
      mode={mode}
      theme={theme}
      style={style}
      inlineIndent={16}
      className={className}
      selectedKeys={selectedKeys}
      defaultOpenKeys={[]}
      {...menuProps}
    >
      {menuUtils.getNavMenu(finalData, false)}
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
      return <Icon component={() => <img src={icon} alt="icon" className="az-siderbar-menu-icon" />} />;
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
      const { prefixCls } = this.props;
      const defaultTitle = data.icon ? (
        <span className={`${prefixCls}-menu-item`}>
          {!isChildren && getIcon(data.icon)}
          <span>{name}</span>
        </span>
      ) : (
        <span className={`${prefixCls}-menu-item`}>{name}</span>
      );

      const title = defaultTitle;

      return (
        <Menu.SubMenu title={title} key={data.key || data.path}>
          {this.getNavMenu(data.children, true)}
        </Menu.SubMenu>
      );
    }
    return <Menu.Item key={data.key || data.path}>{this.getMenuItemPath(data, isChildren)}</Menu.Item>;
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
    // TODO 未来通过name来查询对应的名称，通过多级配置判断国际化
    // 多级配置 1.组件 2.数据
    return data.title;
  }

  hasChildren(data: MenuDataItem) {
    return data && !data.hidden && data?.children && data.children.some(child => child && !child.hidden && !!child.name);
  }
}
