import React, { useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { isNil } from 'lodash';
import GridContent from '@/layouts/GridContent';
import { AzTable } from '@/components/Table';
import { AzColumnType } from '@/components/Table/Table';
import FooterToolbar from '@/components/FooterToolbar';
import Dialog from '@/components/Dialog';
import { getUserList, createUser, updateUser, deleteUser } from '@/api/admin';
import { getRoleList } from '@/api';
import { format } from '@/utils/dateUtils';
import { formatGenderToLabel, formatStatusToLabel, formatCreateTypeToLabel } from '@/utils/constantUtils';
import useRequest from '@/utils/hooks/useRequest';
import { CoreTableActionType } from '@/typing';
import UserForm from './components/UserForm';
import './user.scss';

export interface UserPageProps {
  className?: string;
}

const UserPage: React.FC<UserPageProps> = props => {
  const formRef = useRef();
  const actionRef = useRef<CoreTableActionType>();
  const [row, setRow] = useState<any>();
  const [selectRow, setSelectRow] = useState<any[]>([]);
  const [createDialogVisible, handleCreateDialogVisible] = useState<boolean>(false);
  const [updateDialogVisible, handleUpdateDialogVisible] = useState<boolean>(false);
  const { dataSource: roleList } = useRequest<any[]>(() => getRoleList(), {
    defaultData: [],
    formatResult: response => {
      return response.data.map(item => {
        return {
          value: item.id,
          label: item.name,
        };
      });
    },
  });

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
      title: '手机号码',
      dataIndex: 'mobile',
      width: 140,
      align: 'center',
    },
    {
      title: '角色列表',
      dataIndex: 'roles',
      width: 200,
      align: 'center',
      renderText: (value: any[]) => (value && value.length ? value.map(item => item.name).join(',') : '-'),
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
      title: '用户类型',
      dataIndex: 'createType',
      width: 120,
      align: 'center',
      renderText: value => (!isNil(value) ? formatCreateTypeToLabel(value) : '-'),
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
    setRow(row);
    handleUpdateDialogVisible(true);
  };

  // 添加
  const handleAdd = async (values: any) => {
    try {
      await createUser(values);
      handleCreateDialogVisible(false);
      actionRef.current?.reload();
      message.success('创建成功');
    } catch (reason) {
      message.warn(`创建用户失败: ${reason.message || ''}`);
      return false;
    }
  };

  // 更新
  const handleUpdate = async (values: any) => {
    try {
      await updateUser(values);
      handleUpdateDialogVisible(false);
      actionRef.current?.reload();
      message.success('修改成功');
    } catch (reason) {
      message.warn(`修改用户失败: ${reason.message || ''}`);
      return false;
    }
  };

  // 移除
  const handleRemove = async (rows: any[]) => {
    const hide = message.loading('正在删除中···');
    try {
      const ids = rows.map(item => item.id);
      await deleteUser({ ids });
      hide();
      message.success('删除成功');
      actionRef.current?.reloadAndRest();
    } catch (reason) {
      hide();
      message.warn(`删除失败: ${reason.message || ''}`);
    }
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
          <Button danger type="primary" onClick={() => handleRemove(selectRow)}>
            批量删除
          </Button>
        </FooterToolbar>
      )}
      <Dialog title="添加用户" visible={createDialogVisible} onCancel={() => handleCreateDialogVisible(false)}>
        <UserForm roleList={roleList} onCancel={() => handleCreateDialogVisible(false)} onSubmit={handleAdd} />
      </Dialog>
      <Dialog title="编辑用户" destroyOnClose visible={updateDialogVisible} onCancel={() => handleUpdateDialogVisible(false)}>
        <UserForm
          roleList={roleList}
          initialValue={row}
          onCancel={() => handleUpdateDialogVisible(false)}
          onSubmit={handleUpdate}
        />
      </Dialog>
    </GridContent>
  );
};

export default UserPage;
