import React, { useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { isNil } from 'lodash';
import GridContent from '@/layouts/GridContent';
import { AzTable } from '@/components/Table';
import { AzColumnType } from '@/components/Table/Table';
import FooterToolbar from '@/components/FooterToolbar';
import Dialog from '@/components/Dialog';
import { getUserList } from '@/api/admin';
import { format } from '@/utils/dateUtils';
import { formatGenderToLabel, formatStatusToLabel, formatCreateTypeToLabel } from '@/utils/constantUtils';
import './user.scss';

export interface UserPageProps {
  className?: string;
}

const UserPage: React.FC<UserPageProps> = props => {
  const formRef = useRef();
  const actionRef = useRef();
  const [row, setRow] = useState<any>();
  const [selectRow, setSelectRow] = useState<any[]>([]);
  const [createDialogVisible, handleCreateDialogVisible] = useState<boolean>(false);
  const [updateDialogVisible, handleUpdateDialogVisible] = useState<boolean>(false);
  const columns: AzColumnType<any>[] = [
    {
      title: '序号',
      hideInSearch: true,
      width: 50,
      align: 'center',
      render: (_1, _2, index) => index + 1,
    },
    {
      title: '用户名',
      dataIndex: 'account',
      width: 140,
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      renderText: value => (!isNil(value) ? formatStatusToLabel(value) : '-'),
    },
    {
      title: '用户类型',
      dataIndex: 'createType',
      width: 120,
      align: 'center',
      renderText: value => (!isNil(value) ? formatCreateTypeToLabel(value) : '-'),
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
      width: 140,
      align: 'center',
    },
    {
      title: '昵称',
      dataIndex: 'nick',
      width: 120,
      align: 'center',
    },
    {
      title: '性别',
      dataIndex: 'gender',
      width: 120,
      align: 'center',
      renderText: value => (!isNil(value) ? formatGenderToLabel(value) : '-'),
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      width: 180,
      align: 'center',
      renderText: value => (value ? format(value) : '-'),
    },
    {
      title: '操作',
      width: 80,
      align: 'center',
      fixed: 'right',
      render: (_, row) => {
        return <a onClick={() => handleUpdateDialog(row)}>编辑</a>;
      },
      hideInSearch: true,
    },
  ];

  const handleUpdateDialog = (row: any) => {
    //
  };

  return (
    <GridContent>
      <AzTable
        columns={columns}
        formRef={formRef}
        actionRef={actionRef}
        toolbarLeftRender={props => (
          <React.Fragment>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleCreateDialogVisible(true)}>
              新建
            </Button>
          </React.Fragment>
        )}
        rowSelection={{
          onChange: (_, rows) => {
            setSelectRow(rows);
          },
        }}
        search={{
          labelWidth: 120,
        }}
        request={(params, sort, filter) => getUserList(params)}
        scroll={{ x: '100%' }}
        rowKey="id"
        bordered
        sticky
      />
      {selectRow.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectRow.length}</a> 项 &nbsp;&nbsp;
            </div>
          }
        >
          <Button danger type="primary">
            批量删除
          </Button>
        </FooterToolbar>
      )}
      <Dialog title="添加用户" visible={createDialogVisible} onCancel={() => handleCreateDialogVisible(false)}>
        1
      </Dialog>
      <Dialog title="编辑用户" visible={updateDialogVisible} onCancel={() => handleUpdateDialogVisible(false)}>
        2
      </Dialog>
    </GridContent>
  );
};

export default UserPage;
