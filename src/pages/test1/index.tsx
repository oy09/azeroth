import React from 'react';
import { Button } from 'antd';

const Page1: React.FC<any> = props => {
  const {
    history,
    location: { pathname },
  } = props;
  const handleClick = () => {
    history.push('/user');
  };

  return (
    <div>
      <h1>Page index {pathname}</h1>
      <Button onClick={handleClick}>router to login</Button>
    </div>
  );
};

export default Page1;
