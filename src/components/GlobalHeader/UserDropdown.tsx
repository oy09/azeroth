import React from 'react';
import classnames from 'classnames';
import './UserDropdown.scss';

export interface UserDropdownProsp {
  className?: string;
}

const UserDropdown: React.FC<UserDropdownProsp> = props => {
  const { className } = props;
  const classNames = classnames('user-dropdown', className);

  return <div className={classNames}>用户</div>;
};

export default UserDropdown;
