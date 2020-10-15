import React from 'react';
import { SelectLang } from 'umi';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import UserIcon from './UserDropdown';
import './RightContent.scss';

export interface RightContentProps {}

const RightContent: React.FC<RightContentProps> = props => {
  return (
    <div className="right-content">
      <Tooltip className="header-action" title="使用说明">
        <a target="_blank" href="https://www.baidu.com">
          <QuestionCircleOutlined />
        </a>
      </Tooltip>
      <span className="header-action">通知信息</span>
      <UserIcon className="header-action" />
      <SelectLang />
    </div>
  );
};

export default RightContent;
