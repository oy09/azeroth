import React from 'react';
import { Button } from 'antd';
import { useDispatch } from 'umi';

const Page1: React.FC<any> = props => {
  const {
    history,
    location: { pathname },
  } = props;
  const dispacth = useDispatch();

  const handleClick = () => {
    history.push('/user');
  };

  const handleTestClick = () => {
    dispacth({ type: 'test', payload: { name: 'ouyang' } });
  };

  return (
    <div>
      <h1>Page index {pathname}</h1>
      <Button onClick={handleClick}>router to login</Button>
      <Button onClick={handleTestClick}>test redux action plugin</Button>
    </div>
  );
};

export default Page1;
