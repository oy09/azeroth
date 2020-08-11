import './Siderbar.scss';
import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import { WithFalse, MenuDataItem } from '@/typing';
import { MenuTheme } from 'antd/es/menu/MenuContext';
import { Menu } from 'antd';
import MenuList from './MenuList';

export interface SiderbarProps {
  className?: string;
  style?: CSSProperties;
  logo?: React.ReactNode;
  siderWidth?: number;
  menuHeaderRender?: WithFalse<
    (props: SiderbarProps, defaultDom: React.ReactNode) => React.ReactNode
  >;
  menuContentRender?: WithFalse<
    (props: any, defaultDom: React.ReactNode) => React.ReactNode
  >;
  menuExtraRender?: WithFalse<(props: SiderbarProps) => React.ReactNode>;
  collapsedButtonRender?: WithFalse<(collapsed?: boolean) => React.ReactNode>;
  links?: React.ReactNode[];
  onMenuHeaderClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onOpenChange?: (openKeys?: WithFalse<string[]>) => void;
  onCollapse?: (collapsed: boolean) => void;
  menuData?: MenuDataItem[];
  theme?: MenuTheme;
  prefixCls?: string;
  title?: string;
  fixSiderbar?: boolean;
  isMobile?: boolean;
  collapsed?: boolean;
}

const defaultRenderLogo = (logo: React.ReactNode): React.ReactNode => {
  if (typeof logo === 'string') {
    return <img src={logo} alt="logo" />;
  }
  if (typeof logo === 'function') {
    return logo();
  }
  return logo;
};

const defaultRenderLogoAndTitle = (props: SiderbarProps): React.ReactNode => {
  const { logo, title } = props;

  const logoDom = defaultRenderLogo(logo);
  const titleDom = <h1>{title}</h1>;

  return (
    <a>
      {logoDom}
      {props.collapsed ? null : titleDom}
    </a>
  );
};

const defaultRenderCollapsedButton = (collapsed?: boolean) => {
  return collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />;
};

const Siderbar: React.FC<SiderbarProps> = props => {
  const {
    theme,
    style,
    isMobile,
    collapsed,
    links,
    fixSiderbar = true,
    prefixCls = 'az',
    siderWidth,
    onCollapse,
    onOpenChange,
    onMenuHeaderClick,
    collapsedButtonRender = defaultRenderCollapsedButton,
    menuContentRender,
    menuExtraRender,
  } = props;

  const baseClassName = `${prefixCls}-sidebar`;
  const sidebarClassName = classnames(`${baseClassName}`, {
    [`${baseClassName}-fixed`]: fixSiderbar,
    [`${baseClassName}-light`]: theme === 'light',
  });

  const headerDom = defaultRenderLogoAndTitle(props);
  const extraDom = menuExtraRender && menuExtraRender(props);
  const menuListDom = menuContentRender !== false && (
    <MenuList
      {...props}
      style={{
        width: '100%',
      }}
      mode="inline"
      handleOpenChange={onOpenChange}
      className={`${baseClassName}-menu`}
    />
  ); // 创建MenuList组件

  return (
    <>
      {fixSiderbar && (
        <div
          style={{
            width: collapsed ? 48 : siderWidth,
            overflow: 'hidden',
            flex: `0 0 ${collapsed ? 48 : siderWidth}px`,
            maxWidth: collapsed ? 48 : siderWidth,
            minWidth: collapsed ? 48 : siderWidth,
            ...style,
          }}
        />
      )}
      <Layout.Sider
        collapsible
        trigger={null}
        collapsed={collapsed}
        onCollapse={collapsed => {
          if (!isMobile) {
            if (onCollapse) {
              onCollapse(collapsed);
            }
          }
        }}
        collapsedWidth={48}
        width={siderWidth}
        style={{
          overflow: 'hidden',
          ...style,
        }}
        className={sidebarClassName}
      >
        {headerDom && (
          <div
            className={`${baseClassName}-logo`}
            id="logo"
            onClick={onMenuHeaderClick}
          >
            {headerDom}
          </div>
        )}
        {extraDom && (
          <div
            className={`${baseClassName}-extra ${!headerDom &&
              `${baseClassName}-extra-no-logo`}`}
          >
            {extraDom}
          </div>
        )}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {menuListDom}
        </div>
        <div className={`${baseClassName}-links`}>
          <Menu
            theme={theme}
            inlineIndent={16}
            className={`${baseClassName}-link-menu`}
            selectedKeys={[]}
            openKeys={[]}
            mode="inline"
          >
            {(links || []).map((node, index) => (
              <Menu.Item className={`${baseClassName}-link`} key={index}>
                {node}
              </Menu.Item>
            ))}
            {collapsedButtonRender && !isMobile && (
              <Menu.Item
                className={`${baseClassName}-collapsed-button`}
                title={false}
                onClick={() => {
                  if (onCollapse) {
                    onCollapse(!collapsed);
                  }
                }}
              >
                {collapsedButtonRender(collapsed)}
              </Menu.Item>
            )}
          </Menu>
        </div>
      </Layout.Sider>
    </>
  );
};

export default Siderbar;
