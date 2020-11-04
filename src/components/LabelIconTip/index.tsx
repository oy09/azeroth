import React, { CSSProperties } from 'react';
import { Space, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { TooltipProps } from 'antd/lib/tooltip';
import classnames from 'classnames';
import './LabelIconTip.scss';

export interface LabelIconTipProps {
  label: React.ReactNode;
  subtitle?: React.ReactNode;
  tooltip?: string | TooltipProps;
  className?: string;
  style?: CSSProperties;
  prefix?: string;
}

const LabelIconTip: React.FC<LabelIconTipProps> = props => {
  const { label, subtitle, tooltip, className, prefix = 'az' } = props;

  if (!tooltip && !subtitle) {
    return <>{label}</>;
  }

  const defaultClassName = `${prefix}-label-tip`;
  const classNames = classnames(defaultClassName, className);
  const tooltipProps = typeof tooltip === 'string' ? { title: tooltip } : (tooltip as TooltipProps);

  return (
    <Space className={classNames} size={4}>
      {label}
      {subtitle && <div className={`${defaultClassName}-title`}>{subtitle}</div>}
      {tooltip && (
        <Tooltip {...tooltipProps}>
          <InfoCircleOutlined className={`${defaultClassName}-icon`} />
        </Tooltip>
      )}
    </Space>
  );
};

export default LabelIconTip;
