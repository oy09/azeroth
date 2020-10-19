import React, { CSSProperties, useContext } from 'react';
import classnames from 'classnames';
import RouteContext, { RouteContextType } from '@/utils/RouteContext';
import './GridContent.scss';

export interface GridContentProps {
  prefixCls?: string;
  className?: string;
  contentWidth?: RouteContextType['contentWidth'];
  style?: CSSProperties;
}

const GridContent: React.FC<GridContentProps> = props => {
  const {
    style,
    children,
    prefixCls = 'az',
    contentWidth: propsContentWidth,
    className: propsClassName,
  } = props;
  const value = useContext(RouteContext);

  const contentWidth = propsContentWidth || value.contentWidth;
  const className = `${prefixCls}-grid-content`;
  const classNames = classnames(className, propsClassName, {
    wide: contentWidth === 'Fixed',
  });

  return (
    <div className={classNames} style={style}>
      <div className={`${prefixCls}-grid-content-children`}>{children}</div>
    </div>
  );
};

export default GridContent;
