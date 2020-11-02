/**
 * 全屏控制按钮
 * 取浏览器全屏状态
 */

import React, { CSSProperties, useEffect, useState } from 'react';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';

export interface FullscreenIconProps {
  style?: CSSProperties;
  className?: string;
}

const FullscreenIcon: React.FC<FullscreenIconProps> = props => {
  const [fullScreen, setFullScreen] = useState<boolean>(!!document.fullscreenElement);
  useEffect(() => {
    document.onfullscreenchange = () => {
      setFullScreen(!!document.fullscreenElement);
    };
  }, []);
  return fullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />;
};

export default FullscreenIcon;
