import React, { CSSProperties } from 'react';
import GridContent from '@/layouts/GridContent';
import * as IconModules from '@ant-design/icons/lib/icons';
import { Card, message } from 'antd';
import Clipboard from 'clipboard';
import styles from './icon.scss';

export interface IconPageProps {
  className?: string;
  style?: CSSProperties;
}

const IconPage: React.FC<IconPageProps> = props => {
  const handleClipboard = (e: React.MouseEvent, name: string) => {
    const iconJsx = `<${name} />`;
    const clipboard = new Clipboard(e.target as Element, {
      text: () => iconJsx,
    });
    clipboard.on('success', () => {
      console.log('成功');
      message.success(`复制 ${iconJsx} 到剪切板成功`);
      clipboard.destroy();
    });
    clipboard.on('error', () => {
      console.log('失败');
      clipboard.destroy();
    });
    // @ts-ignore
    clipboard.onClick(e);
  };

  const renderAntIcon = () => {
    return Object.entries(IconModules).map(([key, value], index) => {
      return (
        <Card.Grid
          className={styles.iconItem}
          key={key}
          onClick={e => handleClipboard(e, key)}
        >
          <div className={styles.preview}>{React.createElement(value)}</div>
          <div className={styles.name}>{key}</div>
        </Card.Grid>
      );
    });
  };

  // 自定义icon列表
  const renderCustomIcon = () => {
    return null;
  };

  return (
    <GridContent>
      <Card>{renderAntIcon()}</Card>
    </GridContent>
  );
};

export default IconPage;
