import { MenuTheme } from 'antd/es/menu/MenuContext';

export interface PureSettings {
  navTheme: MenuTheme | 'realDark' | undefined;
  headerHeight?: number;
  fixSiderbar: boolean;
  title: string;
  primaryColor?: string;
  iconfontUrl?: string;
}

export type LayoutSetting = PureSettings;

const defaultSettings: LayoutSetting = {
  navTheme: 'dark',
  title: '智能管理平台',
  fixSiderbar: true,
};

export default defaultSettings;
