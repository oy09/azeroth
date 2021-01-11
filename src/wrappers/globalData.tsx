import React, { useEffect } from 'react';
import { useDispatch } from 'umi';

export interface GlobalDataProps {
  children?: React.ReactNode;
}

const GlobalData = (props: GlobalDataProps) => {
  // 初始化数据
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('数据初始化');
  }, []);

  return props.children;
};

export default GlobalData;
