import React, { useRef, useState } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import GridContent from '@/layouts/GridContent';
import { AzTable } from '@/components/Table';
import { AzColumnType } from '@/components/Table/Table';
import { SearchProps } from '@/components/Table/Query';
import Dialog from '@/components/Dialog';
import { getTopicList, createTopic } from '@/api/topic';
import { format } from '@/utils/dateUtils';
import TopicFrom from './components/TopicForm';
import './topic.scss';

export interface TopicPageProps {
  className?: string;
}

const TopicPage: React.FC<TopicPageProps> = props => {
  const formRef: SearchProps<any>['formRef'] = useRef();
  const [createDialogVisible, handleCreateDialogVisible] = useState<boolean>(false);
  // const { dataSource } = useRequest('/api/topic', { params: { page: 1, pageSize: 20 } })
  const columns: AzColumnType<any>[] = [
    {
      title: '序号',
      tooltip: '查看数据数量和位置',
      hideInSearch: true,
      width: 50,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'id',
      dataIndex: 'id',
      align: 'center',
      width: 210,
    },
    {
      title: '内容',
      dataIndex: 'content',
      align: 'center',
      width: 400,
      ellipsis: true,
    },
    {
      title: '图片',
      dataIndex: 'pictureList',
      align: 'center',
      width: 300,
      hideInSearch: true,
    },
    {
      title: '联系电话',
      dataIndex: 'concatMobile',
      align: 'center',
      width: 140,
    },
    {
      title: '联系人',
      dataIndex: 'concatName',
      align: 'center',
      width: 120,
    },
    {
      title: '发布位置',
      dataIndex: 'positionName',
      align: 'center',
      width: 340,
    },
    {
      title: '置顶状态',
      dataIndex: 'isTop',
      align: 'center',
      width: 240,
    },
    {
      title: '发布用户',
      dataIndex: 'userId',
      align: 'center',
      width: 140,
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      align: 'center',
      width: 200,
      renderText: value => format(value),
    },
    {
      title: '浏览数量',
      dataIndex: 'readCount',
      align: 'center',
      width: 120,
      hideInSearch: true,
    },
    {
      title: '点赞数量',
      dataIndex: 'likeCount',
      align: 'center',
      width: 120,
      hideInSearch: true,
    },
  ];

  const rowSelection = {};

  const handleNew = () => {
    handleCreateDialogVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      await createTopic(values);
      handleCreateDialogVisible(false);
      message.success('提交成功');
    } catch (reason) {
      message.warn(`提交失败: ${reason.message || ''}`);
    }
  };

  return (
    <GridContent>
      <AzTable
        columns={columns}
        rowSelection={rowSelection}
        formRef={formRef}
        toolbarLeftRender={props => (
          <React.Fragment>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleNew}>
              新建
            </Button>
          </React.Fragment>
        )}
        search={{
          labelWidth: 120,
        }}
        request={async (params, sort, filter) => getTopicList(params)}
        onRequestError={e => console.log('topic table reqeust reason:', e)}
        scroll={{ x: '100%' }}
        rowKey="id"
        tableLayout="fixed"
        bordered
        sticky
      />
      <Dialog title="发布话题" visible={createDialogVisible} onCancel={() => handleCreateDialogVisible(false)}>
        <TopicFrom onCancel={() => handleCreateDialogVisible(false)} onSubmit={values => handleSubmit(values)} />
      </Dialog>
    </GridContent>
  );
};

export default TopicPage;
