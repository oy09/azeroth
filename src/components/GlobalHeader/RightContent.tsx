import React from 'react';
import { SelectLang } from 'umi';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import UserIcon from './UserDropdown';
import Notification from './Notification';
import './RightContent.scss';

export interface RightContentProps {}

const RightContent: React.FC<RightContentProps> = props => {
  return (
    <div className="right-content">
      <Tooltip className="header-action" title="使用文档">
        <a
          style={{
            color: 'inherit',
          }}
          target="_blank"
          href="https://www.baidu.com"
        >
          <QuestionCircleOutlined />
        </a>
      </Tooltip>
      <Notification className="header-action" />
      <UserIcon className="header-action" />
      <SelectLang />
    </div>
  );
};

export default RightContent;
