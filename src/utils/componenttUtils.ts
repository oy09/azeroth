/**
 * UI组件工具函数
 * 组件需要约定的数据模型才可以使用，这里做一个方法整理
 * @author ouyang
 */
import { TreeProps } from 'antd/lib/tree/Tree';

interface InputData {
  [key: string]: any;
}

interface InputOption {
  key: string;
  title: string;
  children: string;
}

/**
 * 将业务数据转换为`antd.tree`的数据模型
 */
export const transformAntdMenuTreeData = (data: InputData[] = [], options: InputOption): TreeProps['treeData'] => {
  if (!data) {
    return [];
  }
  const next = data.map((item: any) => {
    return {
      ...item,
      key: item[options['key']],
      title: item[options['title']],
      children: transformAntdMenuTreeData(item[options['children']], options),
    };
  });
  return next;
};
