import React, { CSSProperties } from 'react';
import GridContent from '@/layouts/GridContent';
import * as IconModules from '@ant-design/icons/lib/icons';
import { Card } from 'antd';
import styles from './icon.scss';

export interface IconPageProps {
  className?: string;
  style?: CSSProperties;
}

const IconPage: React.FC<IconPageProps> = props => {
  const renderAntIcon = () => {
    return Object.entries(IconModules).map(([key, value]) => {
      return (
        <Card.Grid className={styles.iconItem} key={key}>
          <div className={styles.preview}>{React.createElement(value)}</div>
          <div className={styles.name}>{key}</div>
        </Card.Grid>
      );
    });
  };

  return (
    <GridContent>
      <Card>{renderAntIcon()}</Card>
    </GridContent>
  );
};

export default IconPage;
