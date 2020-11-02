/**
 * 控制Table 尺寸
 */

import React, { useState } from 'react';
import { ColumnHeightOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Tooltip } from 'antd';
import Container from '@/components/Table/container';
import { IntlType } from '@/typing';

export type DensityType = 'middle' | 'small' | 'larget' | undefined;

export interface DesintyIconProps {
  //
}

type DensityItem = {
  id: string;
  text: string;
};

const generateItems = (intl?: IntlType): DensityItem[] => {
  return [
    {
      id: 'larget',
      text: '巨大',
    },
    {
      id: 'middle',
      text: '默认',
    },
    {
      id: 'small',
      text: '紧凑',
    },
  ];
};

const DesintyIcon: React.ForwardRefRenderFunction<any, {}> = (_, ref) => {
  const counter = Container.useContainer();
  const [items] = useState<DensityItem[]>(() => generateItems());

  const renderItems = (data: DensityItem[]) => {
    return (
      data &&
      data.map(item => {
        return <Menu.Item key={item.id}>{item.text}</Menu.Item>;
      })
    );
  };

  return (
    <Dropdown
      overlay={
        <Menu
          selectedKeys={[counter.tableSize as string]}
          onClick={({ key }) => {
            counter.setTableSize(key);
          }}
          style={{
            width: 80,
          }}
        >
          {renderItems(items)}
        </Menu>
      }
      trigger={['click']}
    >
      <Tooltip ref={ref} title="尺寸">
        <ColumnHeightOutlined />
      </Tooltip>
    </Dropdown>
  );
};

export default DesintyIcon;
