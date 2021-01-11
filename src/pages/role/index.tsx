import React, { useRef, useState } from 'react';
import { Button, message } from 'antd';
import { isNil } from 'lodash';
import { PlusOutlined } from '@ant-design/icons';
import GridContent from '@/layouts/GridContent';
import { AzTable } from '@/components/Table';
import { AzColumnType } from '@/components/Table/Table';
import { SearchProps } from '@/components/Table/Query';
import FooterToolbar from '@/components/FooterToolbar';
import Dialog from '@/components/Dialog';
import { getRoleList, createRole, updateRole, deleteRole } from '@/api/admin';
import { formatStatusToLabel } from '@/utils/constantUtils';
import { format } from '@/utils/dateUtils';
import { CoreTableActionType } from '@/typing';
import RoleForm from './components/RoleForm';
import './role.scss';

export interface RolePageProps {
  //
}

const RolePage: React.FC<RolePageProps> = props => {
  const formRef: SearchProps<any>['formRef'] = useRef();
  const actionRef = useRef<CoreTableActionType>();
  const [row, setRow] = useState<any>();
  const [selectRows, setSelectRows] = useState<any[]>([]);
  const [createDialogVisible, handleCreateDialogVisible] = useState<boolean>(false);
  const [updateDialogVisible, handleUpdateDialogVisible] = useState<boolean>(false);
  const columns: AzColumnType<any>[] = [
    {
      title: '序号',
      hideInSearch: true,
      width: 50,
      align: 'center',
      renderText: (value, row, index) => index + 1,
    },
    {
      title: '编码',
      dataIndex: 'code',
      width: 120,
      align: 'center',
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 160,
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
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 180,
      align: 'center',
      hideInSearch: true,
      renderText: value => (value ? format(value) : '-'),
    },
    {
      title: '修改时间',
      dataIndex: 'updatedAt',
      width: 180,
      align: 'center',
      hideInSearch: true,
      renderText: value => (value ? format(value) : '-'),
    },
    {
      title: '备注',
      dataIndex: 'comment',
      width: 380,
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '操作',
      width: 80,
      align: 'center',
      hideInSearch: true,
      fixed: 'right',
      render: (value, row, index) => {
        return <a onClick={() => handleUpdateDialog(row)}>编辑</a>;
      },
    },
  ];

  const handleUpdateDialog = (values: any) => {
    setRow(values);
    handleUpdateDialogVisible(true);
  };

  const handleAdd = async (values: any) => {
    console.log('创建角色 -> 入参:', values);
    try {
      await createRole(values);
      handleCreateDialogVisible(false);
      actionRef.current?.reload();
      message.success('创建成功');
    } catch (reason) {
      message.warn(`创建菜单失败:${reason.message || ''}`);
      return false;
    }
  };

  const handleUpdate = async (values: any) => {
    console.log('修改角色 -> 入参:', values);
    try {
      await updateRole(values.id, values);
      handleUpdateDialogVisible(false);
      actionRef.current?.reload();
      message.success('修改成功');
    } catch (reason) {
      message.warn(`修改角色失败:${reason.message || ''}`);
      return false;
    }
  };

  const handleRemove = async (values: any[]) => {
    console.log('删除角色 -> 入参:', values);
    const hide = message.loading('正在删除中···');
    const ids = values.map(item => item.id);
    try {
      await deleteRole({ ids });
      hide();
      message.success('删除成功');
      actionRef.current?.reloadAndRest();
    } catch (reason) {
      hide();
      message.warn(`删除失败:${reason.message || ''}`);
    }
  };

  return (
    <GridContent>
      <AzTable
        formRef={formRef}
        actionRef={actionRef}
        columns={columns}
        rowSelection={{
          onChange: (_, rows) => {
            setSelectRows(rows);
          },
        }}
        toolbarLeftRender={props => (
          <React.Fragment>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleCreateDialogVisible(true)}>
              新建
            </Button>
          </React.Fragment>
        )}
        search={{
          labelWidth: 120,
        }}
        request={(params, sort, filter) => getRoleList(params)}
        onRequestError={reason => message.error(`查询角色列表失败: ${reason.message || ''}`)}
        scroll={{ x: '100%' }}
        rowKey="id"
        bordered
        sticky
      />
      {selectRows.length > 0 && (
        <FooterToolbar>
          <Button danger type="primary" onClick={() => handleRemove(selectRows)}>
            批量删除
          </Button>
        </FooterToolbar>
      )}
      <Dialog title="添加角色" visible={createDialogVisible} onCancel={() => handleCreateDialogVisible(false)}>
        <RoleForm onCancel={() => handleCreateDialogVisible(false)} onSubmit={handleAdd} />
      </Dialog>
      <Dialog title="修改角色" destroyOnClose visible={updateDialogVisible} onCancel={() => handleUpdateDialogVisible(false)}>
        <RoleForm initialValues={row} onCancel={() => handleUpdateDialogVisible(false)} onSubmit={handleUpdate} />
      </Dialog>
    </GridContent>
  );
};

export default RolePage;
