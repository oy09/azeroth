import React, { useRef } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import GridContent from '@/layouts/GridContent';
import { AzTable } from '@/components/Table';
import { AzColumnType } from '@/components/Table/Table';
import { SearchProps } from '@/components/Table/Query';
import './menu.scss';

export interface MenuPageProps {
  //
}

const MenuPage: React.FC<MenuPageProps> = props => {
  const formRef: SearchProps<any>['formRef'] = useRef();
  const columns: AzColumnType<any>[] = [
    {
      title: '序号',
      key: 'no',
      hideInSearch: true,
      width: 100,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: '编码',
      key: 'code',
      width: 120,
      align: 'center',
    },
    {
      title: '名称',
      key: 'name',
      align: 'center',
    },
    {
      title: '状态',
      key: 'status',
      align: 'center',
      width: 120,
    },
    {
      title: '创建时间',
      key: 'created_at',
      align: 'center',
      hideInSearch: true,
      width: 140,
    },
    {
      title: '备注',
      key: 'comment',
      align: 'center',
      width: 240,
    },
  ];

  return (
    <GridContent>
      <AzTable
        columns={columns}
        formRef={formRef}
        toolbarLeftRender={props => (
          <React.Fragment>
            <Button type="primary" icon={<PlusOutlined />}>
              新建
            </Button>
          </React.Fragment>
        )}
        search={{
          labelWidth: 120,
        }}
        rowKey="id"
        bordered
        sticky
      />
    </GridContent>
  );
};

export default MenuPage;
