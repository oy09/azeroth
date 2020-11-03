import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import { Tooltip } from 'antd';
import { ReloadOutlined, VerticalAlignMiddleOutlined, SettingOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { UseReqeustTableAction, ResponseData } from '@/utils/hooks/useRequestTable';
import FullscreenIcon from './FullScreenIcon';
import DesintyIcon from './DesintyIcon';
import ColumnSetting from '../ColumnSetting';
import './Toolbar.scss';

/**
 * Table 工具栏，具备可部分定制化
 * 功能点：
 * 1. 刷新表格（重新请求）
 * 2. 配置表格大小
 * 3. 表格列配置（可见状态、展示顺序）
 * 4. 全屏控制
 *
 * 自带功能放在最右边，4个功能可配置是否显示，可自定义在添加新功能，可前，可后
 * 自定义功能放在最左边
 */

export interface OptionConfig<T> {
  desinty?: boolean;
  fullScreen?: OptionType<T>;
  reload?: OptionType<T>;
  setting?: boolean;
}

export type OptionType<T = unknown> =
  | ((e: React.MouseEvent<HTMLSpanElement>, action: UseReqeustTableAction<ResponseData<T>>) => void)
  | boolean;

export interface ToolbarProps<T = any> {
  // 左边
  leftbarRender?: (props: ToolbarProps<T>) => any;
  // 右边
  rightbarRender?: (props: ToolbarProps<T>, dom: React.ReactNode[]) => any;
  action?: UseReqeustTableAction<ResponseData<T>>;
  options?: OptionConfig<T> | false;
  selectRowkeys?: (string | number)[];
  selectRows?: T[];
  onFullScreen?: () => void;
  className?: string;
  style?: CSSProperties;
  prefix?: string;
}

type DefaultOptionItem = {
  text?: string;
  icon: React.ReactNode;
};

const getOptionMap = (): { [key: string]: DefaultOptionItem } => {
  return {
    reload: {
      text: '刷新',
      icon: <ReloadOutlined />,
    },
    desinty: {
      text: '尺寸',
      icon: <DesintyIcon />,
    },
    fullScreen: {
      text: '全屏',
      icon: <FullscreenIcon />,
    },
    setting: {
      text: '列设置',
      icon: <ColumnSetting />,
    },
  };
};

// 渲染默认的选项
const renderDefaultOption = (options: any, className: string) => {
  const dom =
    options &&
    Object.keys(options)
      .filter(item => !!item)
      .map(key => {
        const value = options[key];
        if (!value) {
          return null;
        }
        const optionItem = getOptionMap()[key];
        if (optionItem) {
          return (
            <span
              key={key}
              className={className}
              onClick={() => {
                if (value !== true) {
                  value();
                  return;
                }
              }}
            >
              <Tooltip title={optionItem.text}>
                <span>{optionItem.icon}</span>
              </Tooltip>
            </span>
          );
        }
        return null;
      })
      .filter(item => !!item);
  return dom;
};

const AzToolbar: React.FC<ToolbarProps> = props => {
  const { style, className, action, options: propsOptions, onFullScreen, rightbarRender, leftbarRender, prefix = 'az' } = props;
  const defaultClassName = `${prefix}-toolbar`;
  const classNames = classnames(defaultClassName, className);

  const defaultOption = {
    reload: () => action?.reload(),
    desinty: true,
    setting: true,
    fullScreen: () => onFullScreen && onFullScreen(),
  };

  const options = propsOptions !== false ? { ...defaultOption, ...(propsOptions || {}) } : false;

  let optionDom = renderDefaultOption(options, `${defaultClassName}-item-icon`);

  if (rightbarRender) {
    optionDom = rightbarRender(props, optionDom);
  }

  const customToolbar = leftbarRender ? leftbarRender(props) : [];

  return (
    <div className={classNames} style={style}>
      <div className={`${prefix}-custom-toolbar`}>{customToolbar}</div>
      <div className={`${prefix}-default-option`}>{optionDom}</div>
    </div>
  );
};

export default AzToolbar;
