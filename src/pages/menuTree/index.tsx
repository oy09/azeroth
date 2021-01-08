import React, { useState, useRef } from 'react';
import GridContent from '@/layouts/GridContent';
import { SearchProps } from '@/components/Table/Query';
import { CoreTableActionType } from '@/typing';
import './menuTree.scss';

export interface MenuTreePageProps {
  //
}

const MenuTreePage: React.FC<MenuTreePageProps> = props => {
  const formRef: SearchProps<any>['formRef'] = useRef();
  const actionRef = useRef<CoreTableActionType>();
  const [createDialogVisible, handleCreateDialogVisible] = useState<boolean>(false);
  const [updateDialogVisible, handleUpdateDialogVisible] = useState<boolean>(false);

  return <GridContent>MenuTree</GridContent>;
};

export default MenuTreePage;
