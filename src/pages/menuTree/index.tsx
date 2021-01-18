import React, { useState, useRef } from 'react';
import { Tree, Button, Spin, Empty, message } from 'antd';
import { TreeProps } from 'antd/lib/tree/Tree';
import GridContent from '@/layouts/GridContent';
import Dialog from '@/components/Dialog';
import { getMenuTreeList, createMenuTree, updateMenuTree, deleteMenuTree } from '@/api/admin';
import { getMenuList } from '@/api';
import useRequest from '@/utils/hooks/useRequest';
import MenuTreeForm, { FormValues } from './components/MenuTreeForm';
import styles from './menuTree.scss';

export interface MenuTreePageProps {
  //
}

interface MenuTree {
  menuId: string;
  index: number;
  code: string;
  name: string;
  url?: string;
  children: MenuTree[];
}

const generatorTreeData = (data: MenuTree[]): TreeProps['treeData'] => {
  return data.map(item => {
    return {
      key: item.menuId,
      title: item.name,
      children: generatorTreeData(item.children || []),
    };
  });
};

const MenuTreePage: React.FC<MenuTreePageProps> = props => {
  const [node, setNode] = useState<any>({});
  const [dialogVisible, handleDialogVisible] = useState<boolean>(false);
  const [updateDialogVisible, handleUpdateDialogVisible] = useState<boolean>(false);
  const { dataSource: treeList, loading, reload } = useRequest<any[]>(() => getMenuTreeList(), {
    defaultData: [],
    formatResult: response => {
      if (response) {
        return generatorTreeData(response.data);
      }
      return [];
    },
  });
  const { dataSource: menuList } = useRequest<any[]>(() => getMenuList(), {
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

  const handleUpdateDialog = (row: any) => {
    setNode({
      ...row,
      id: row.key,
    });
    handleUpdateDialogVisible(true);
  };

  // 添加菜单关系
  const handleAdd = async (values: FormValues) => {
    const { id: parentId, children } = values;
    const next = {
      parentId,
      children: children.map((id, index) => {
        return {
          id,
        };
      }),
    };
    console.log('add form values:', next);
    try {
      await createMenuTree(next);
      handleDialogVisible(false);
      reload();
      message.success('创建成功');
    } catch (reason) {
      message.warn(`创建失败: ${reason.message || ''}`);
      return false;
    }
  };

  // 删除菜单
  const handleDelete = async (values: any) => {
    const data = {
      ids: [values.key],
    };
    try {
      await deleteMenuTree(data);
      reload();
    } catch (reason) {
      message.warn(`删除失败: ${reason.message || ''}`);
      return false;
    }
    console.log('delete menus:', data);
  };

  // 修改
  const handleUpdate = async (values: FormValues) => {
    const { id: parentId, children } = values;
    const next = {
      parentId,
      children: children.map(id => {
        return {
          id,
        };
      }),
    };
    console.log('update form values:', next);
    try {
      await updateMenuTree(next);
      handleUpdateDialogVisible(false);
      reload();
    } catch (reason) {
      message.warn(`编辑失败: ${reason.message || ''}`);
    }
  };

  const titleRender = (data: any) => {
    // console.log('title data:', data)
    return (
      <div className="tree-node" key={data.key}>
        <span>{data.title}</span>
        <div className="operate">
          <a onClick={() => handleUpdateDialog(data)}>编辑</a>
          <a onClick={() => handleDelete(data)}>删除</a>
        </div>
      </div>
    );
  };

  const treeRender = (data?: any[], loading?: boolean) => {
    if (!data || (data.length === 0 && loading === false)) {
      return <Empty />;
    }
    return (
      <Spin spinning={loading}>
        <Tree draggable blockNode titleRender={titleRender} treeData={data || []} />
      </Spin>
    );
  };

  return (
    <GridContent className={styles.MenuTreePage}>
      <div className="tool">
        <Button type="primary" onClick={() => handleDialogVisible(true)}>
          新增
        </Button>
      </div>
      <div className="tree-view">{treeRender(treeList, loading)}</div>
      <Dialog title="添加菜单项" visible={dialogVisible} onCancel={() => handleDialogVisible(false)}>
        <MenuTreeForm menuList={menuList} onCancel={() => handleDialogVisible(false)} onSubmit={handleAdd} />
      </Dialog>
      <Dialog title="编辑菜单项" visible={updateDialogVisible} onCancel={() => handleUpdateDialogVisible(false)}>
        <MenuTreeForm
          menuList={menuList}
          initialValues={node}
          onCancel={() => handleUpdateDialogVisible(false)}
          onSubmit={handleUpdate}
        ></MenuTreeForm>
      </Dialog>
    </GridContent>
  );
};

export default MenuTreePage;
