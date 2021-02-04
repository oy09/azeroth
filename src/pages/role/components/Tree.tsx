import React, { useState } from 'react';
import { Tree as AntdTree } from 'antd';
import { TreeProps as AntdTreeProps } from 'antd/lib/tree/Tree';
import useMergedState from '@/utils/hooks/useMergedState';

export type Key = string | number;

export interface TreeProps extends AntdTreeProps {
  value?: any;
  defaultValue?: any;
  onChange?: (keys: Key[]) => void;
}

const Tree: React.FC<TreeProps> = props => {
  // const [value] = useState(() => props.defaultValue || props.value)
  const [value, setValue] = useMergedState(props.defaultValue, {
    value: props.value,
    onChange: props.onChange,
  });

  const handleCheck: TreeProps['onCheck'] = (checked, info) => {
    setValue(checked as Key[]);
  };

  const nextProps: AntdTreeProps = {
    autoExpandParent: true,
    defaultExpandAll: true,
    checkable: true,
    checkedKeys: value,
    onCheck: handleCheck,
    ...props,
  };

  return (
    <div className="tree">
      <AntdTree {...nextProps} />
    </div>
  );
};

export default Tree;
