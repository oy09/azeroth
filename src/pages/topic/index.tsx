import React from 'react';
import GridContent from '@/layouts/GridContent';
import './topic.scss';

export interface TopicPageProps {
  className?: string;
}

const TopicPage: React.FC<TopicPageProps> = props => {
  return (
    <GridContent>
      <div>tool - 新增/编辑/删除/搜索</div>
      <div>table - 列、多选、点击编辑、内如预览</div>
      <div>pagination - 分页</div>
      <div>add/update form - 添加/编辑表单</div>
    </GridContent>
  );
};

export default TopicPage;
