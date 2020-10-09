import React from 'react';
import './RightContent.scss';

export interface RightContentProps {}

const RightContent: React.FC<RightContentProps> = props => {
  return (
    <div className="right-content">
      <span className="header-action">使用说明1</span>
      <span className="header-action">通知信息</span>
      <span className="header-action">用户菜单</span>
      <span className="header-action">国际化</span>
    </div>
  );
};

export default RightContent;
