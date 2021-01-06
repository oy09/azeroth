import React, { useRef, useState } from 'react';
import { Button, Dropdown, Menu, message } from 'antd';
import { PlusOutlined, DownOutlined } from '@ant-design/icons';
import GridContent from '@/layouts/GridContent';
import { AzTable } from '@/components/Table';
import { AzColumnType } from '@/components/Table/Table';
import { SearchProps } from '@/components/Table/Query';
import Dialog from '@/components/Dialog';
import FooterToolbar from '@/components/FooterToolbar';
import { format } from '@/utils/dateUtils';
import { formatStatusToLabel } from '@/utils/constantUtils';
import { CoreTableActionType, AntdMenuEvent } from '@/typing';
import { createMenu, updateMenu, deleteMenu, getMenuList, enableItem, disaableItem } from '@/api/menu';
import { isNil } from 'lodash';
import MenuForm from './components/MenuForm';
import './menu.scss';

export interface MenuPageProps {
  className?: string;
}

const MenuPage: React.FC<MenuPageProps> = props => {
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
      renderText: value => (!isNil(value) ? formatStatusToLabel(value) : '-'),
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
        return <a onClick={() => handleUpdateDialog(row)}>编辑</a>;
      },
      hideInSearch: true,
    },
  ];

  const handleUpdateDialog = (value: any) => {
    setRow(value);
    handleUpdateDialogVisible(true);
  };

  // 添加
  const handleAdd = async (values: any) => {
    console.log('创建菜单 ->入参:', values);
    try {
      await createMenu(values);
      handleCreateDialogVisible(false);
      actionRef.current?.reload();
      message.success('创建成功');
    } catch (reason) {
      message.warn(`创建菜单失败: ${reason.message || ''}`);
      return false;
    }
  };

  // 修改
  const handleUpdate = async (values: any) => {
    console.log('修改菜单 -> 入参:', values);
    try {
      await updateMenu(values.id, values);
      handleUpdateDialogVisible(false);
      actionRef.current?.reload();
      message.success('修改成功');
    } catch (reason) {
      message.warn(`修改菜单失败: ${reason.message || ''}`);
      return false;
    }
  };

  // 删除
  const handleRemove = async (rows: any[]) => {
    const hide = message.loading('正在删除中···');
    try {
      const ids = rows.map(item => item.id);
      await deleteMenu({ ids });
      hide();
      message.success('删除成功');
      actionRef.current?.reloadAndRest();
    } catch (reason) {
      hide();
      message.warn(`删除失败: ${reason.message}`);
    }
  };

  // 批量操作
  const batchEvent: { [key: string]: Function } = {
    enabled: async () => {
      const hide = message.loading('批量操作中···');
      try {
        const ids = selectRows.map(item => item.id);
        await enableItem({ ids });
        actionRef.current?.reloadAndRest();
        hide();
      } catch (reason) {
        hide();
        message.warn(`批量启用失败: ${reason.message || ''}`);
      }
    },
    disabled: async () => {
      const hide = message.loading('批量操作中···');
      try {
        const ids = selectRows.map(item => item.id);
        await disaableItem({ ids });
        actionRef.current?.reloadAndRest();
        hide();
      } catch (reason) {
        hide();
        message.warn(`批量禁用失败: ${reason.message || ''}`);
      }
    },
  };

  const handleBatchEvent = (e: AntdMenuEvent) => {
    batchEvent[e.key] && batchEvent[e.key](e);
  };

  const batchMenu = (
    <Menu onClick={handleBatchEvent}>
      <Menu.Item key="enabled">启用</Menu.Item>
      <Menu.Item key="disabled">禁用</Menu.Item>
    </Menu>
  );

  return (
    <GridContent>
      <AzTable
        columns={columns}
        formRef={formRef}
        actionRef={actionRef}
        rowSelection={{
          onChange: (_, list) => {
            setSelectRows(list);
          },
        }}
        toolbarLeftRender={props => (
          <React.Fragment>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => handleCreateDialogVisible(true)}>
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
      {selectRows.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectRows.length}</a> 项 &nbsp;&nbsp;
            </div>
          }
        >
          <Dropdown arrow placement="topCenter" overlay={batchMenu}>
            <Button>
              批量修改
              <DownOutlined />
            </Button>
          </Dropdown>
          <Button
            danger
            type="primary"
            onClick={async () => {
              await handleRemove(selectRows);
              actionRef.current?.reloadAndRest();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      <Dialog title="添加菜单" visible={createDialogVisible} onCancel={() => handleCreateDialogVisible(false)}>
        <MenuForm onCancel={() => handleCreateDialogVisible(false)} onSubmit={handleAdd} />
      </Dialog>
      <Dialog title="修改菜单" destroyOnClose visible={updateDialogVisible} onCancel={() => handleUpdateDialogVisible(false)}>
        <MenuForm initialValues={row} onCancel={() => handleUpdateDialogVisible(false)} onSubmit={handleUpdate} />
      </Dialog>
    </GridContent>
  );
};

export default MenuPage;
