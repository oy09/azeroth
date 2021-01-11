import React, { useState } from 'react';
import { Tree, Button, Spin, Empty } from 'antd';
import { TreeProps } from 'antd/lib/tree/Tree';
import GridContent from '@/layouts/GridContent';
import Dialog from '@/components/Dialog';
import { getMenuTreeList } from '@/api/admin';
import { getMenuList } from '@/api';
import useRequest from '@/utils/hooks/useRequest';
import MenuTreeForm from './components/MenuTreeForm';
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
  const { dataSource: treeList, loading } = useRequest<any[]>(() => getMenuTreeList(), {
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

  const handleUpdateDialog = (node: any) => {
    setNode(node);
    handleDialogVisible(true);
  };

  const handleAdd = async (values: any) => {
    return null;
  };

  const titleRender = (data: any) => {
    // console.log('title data:', data)
    return (
      <div className="tree-node" key={data.key}>
        <span>{data.title}</span>
        <div className="operate">
          <a onClick={() => handleUpdateDialog(data)}>编辑</a>
          <a>删除</a>
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

  console.log('menuList:', menuList);

  return (
    <GridContent className={styles.MenuTreePage}>
      <div className="tool">
        <Button type="primary" onClick={() => handleDialogVisible(true)}>
          新增
        </Button>
      </div>
      <div className="tree-view">{treeRender(treeList, loading)}</div>
      <Dialog title="添加菜单项" visible={dialogVisible} onCancel={() => handleDialogVisible(false)}>
        <MenuTreeForm menuList={menuList} initialValues={node} onCancel={() => handleDialogVisible(false)} onSubmit={handleAdd} />
      </Dialog>
    </GridContent>
  );
};

export default MenuTreePage;
