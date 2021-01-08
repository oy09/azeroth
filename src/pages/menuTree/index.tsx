import React, { useState, useRef, useEffect } from 'react';
import { Tree, Button, Spin } from 'antd';
import { TreeProps } from 'antd/lib/tree/Tree';
import GridContent from '@/layouts/GridContent';
import { SearchProps } from '@/components/Table/Query';
import { getMenuTreeList } from '@/api/admin';
import useRequest from '@/utils/hooks/useRequest';
import { CoreTableActionType } from '@/typing';
import './menuTree.scss';

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
  const formRef: SearchProps<any>['formRef'] = useRef();
  const actionRef = useRef<CoreTableActionType>();
  const [createDialogVisible, handleCreateDialogVisible] = useState<boolean>(false);
  const [updateDialogVisible, handleUpdateDialogVisible] = useState<boolean>(false);
  const { dataSource: treeData } = useRequest<any>('/admin-api/menu-tree/getList', {
    defaultData: [],
    responseInterceptors: [
      {
        onFulfiled: response => {
          const { data: responseData } = response;
          if (responseData) {
            return {
              ...responseData,
              data: generatorTreeData(responseData.data),
            };
          }
        },
      },
    ],
  });

  const handleDragEnter = () => {
    //
  };

  const handleDrop = () => {
    //
  };

  const titleRender = (data: any) => {
    // console.log('title data:', data)
    return (
      <div key={data.key}>
        <span>{data.title}</span>
      </div>
    );
  };

  return (
    <GridContent>
      <div className="tool">
        <Button type="primary">新增</Button>
      </div>
      <div className="tree-view">
        <Spin spinning={false}>
          <Tree
            draggable
            blockNode
            titleRender={titleRender}
            treeData={(treeData as any) || []}
            onDragEnter={handleDragEnter}
            onDrop={handleDrop}
          />
        </Spin>
      </div>
    </GridContent>
  );
};

export default MenuTreePage;
