import React, { useRef } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import GridContent from '@/layouts/GridContent';
import { AzTable } from '@/components/Table';
import { AzColumnType } from '@/components/Table/Table';
import { SearchProps } from '@/components/Table/Query';
import { getMenuList } from '@/api/menu';
import { format } from '@/utils/dateUtils';
import { formatStatusToLabel } from '@/utils/constantUtils';
import './menu.scss';

export interface MenuPageProps {
  className?: string;
}

const MenuPage: React.FC<MenuPageProps> = props => {
  const formRef: SearchProps<any>['formRef'] = useRef();
  const columns: AzColumnType<any>[] = [
    {
      title: '序号',
      hideInSearch: true,
      width: 50,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: '编码',
      dataIndex: 'code',
      width: 160,
      align: 'center',
    },
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
      width: 140,
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: 80,
      renderText: value => (value ? formatStatusToLabel(value) : '-'),
    },
    {
      title: '备注',
      dataIndex: 'comment',
      align: 'center',
      width: 400,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      align: 'center',
      hideInSearch: true,
      width: 180,
      renderText: value => (value ? format(value) : '-'),
    },
    {
      title: '链接',
      dataIndex: 'url',
      width: 180,
      align: 'center',
      hideInSearch: true,
      ellipsis: true,
      renderText: value => value || '-',
    },
    {
      title: '操作',
      align: 'center',
      width: 80,
      fixed: 'right',
      render: (value, row, index) => {
        return <a>编辑</a>;
      },
      hideInSearch: true,
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
        request={async (params, sort, filter) => getMenuList(params)}
        search={{
          labelWidth: 120,
        }}
        scroll={{ x: '100%' }}
        rowKey="id"
        bordered
        sticky
      />
    </GridContent>
  );
};

export default MenuPage;
