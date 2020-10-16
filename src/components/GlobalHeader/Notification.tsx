import React from 'react';
import classnames from 'classnames';
import { BellOutlined } from '@ant-design/icons';
import './Notification.scss';

export interface NotificationProps {
  className?: string;
}

const Notification: React.FC<NotificationProps> = props => {
  const { className } = props;

  const classNames = classnames('notification', className);

  return (
    <div className={classNames}>
      <BellOutlined />
    </div>
  );
};

export default Notification;
