import React, { CSSProperties } from 'react';
import classnames from 'classnames';
import { Space, Button } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { ButtonProps } from 'antd/lib/button';
import { DownOutlined } from '@ant-design/icons';
import './Actions.scss';

const defaultCollapsedRender: ActionsProps['collapsedRender'] = (collapsed, _) => {
  if (collapsed) {
    return (
      <>
        展开
        <DownOutlined
          style={{
            transition: '0.3s all',
            transform: `rotate(${collapsed ? 0 : 0.5}turn)`,
          }}
        />
      </>
    );
  }
  return (
    <>
      收起
      <DownOutlined
        style={{
          transition: '0.3s all',
          transform: `rotate(${collapsed ? 0 : 0.5}turn)`,
        }}
      />
    </>
  );
};

export interface ActionsProps {
  style?: CSSProperties;
  className?: string;
  prefix?: string;
  form?: FormInstance;
  // 是否收起
  collapsed?: boolean;
  // 是否收起回调
  onCollapsed?: (collapsed: boolean) => void;
  // 是否收起渲染
  collapsedRender?: ((collapsed: boolean, props: ActionsProps) => React.ReactNode) | false;
  // 提交文案
  submitText?: string;
  // 重置文案
  resetText?: string;
  submitButtonProps?: ButtonProps;
  resetButtonProps?: ButtonProps;
  onReset?: () => void;
  onSubmit?: () => void;
}

const Actions: React.FC<ActionsProps> = props => {
  const {
    style,
    className,
    submitText,
    resetText,
    collapsed = false,
    collapsedRender = defaultCollapsedRender,
    onCollapsed,
    onReset,
    onSubmit,
    form,
    resetButtonProps,
    submitButtonProps,
    prefix = 'az',
  } = props;

  const defaultName = `${prefix}-actions`;
  const classNames = classnames(defaultName, className);

  return (
    <Space style={style} className={classNames}>
      <Space>
        <Button
          {...resetButtonProps}
          key="reset"
          onClick={e => {
            form?.resetFields();
            onReset?.();
            resetButtonProps?.onClick?.(e);
          }}
        >
          {resetText}
        </Button>
        <Button
          {...submitButtonProps}
          key="submit"
          type="primary"
          onClick={e => {
            form?.submit();
            onSubmit?.();
            submitButtonProps?.onClick?.(e);
          }}
        >
          {submitText}
        </Button>
      </Space>
      {collapsedRender !== false && (
        <a className={`${defaultName}-collapse-button`} onClick={() => onCollapsed && onCollapsed(!collapsed)}>
          {collapsedRender(collapsed, props)}
        </a>
      )}
    </Space>
  );
};

export default Actions;
