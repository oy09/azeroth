import React, { useRef } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import GridContent from '@/layouts/GridContent';
import { AzTable } from '@/components/Table';
import { AzColumnType } from '@/components/Table/Table';
import { SearchProps } from '@/components/Table/Query';
import './topic.scss';

export interface TopicPageProps {
  className?: string;
}

const TopicPage: React.FC<TopicPageProps> = props => {
  const formRef: SearchProps<any>['formRef'] = useRef();
  // const { dataSource } = useRequest('/api/topic', { params: { page: 1, pageSize: 20 } })
  const columns: AzColumnType<any>[] = [
    {
      title: '序号',
      key: 'no',
      tooltip: '查看数据数量和位置',
      hideInSearch: true,
      width: 100,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'id',
      dataIndex: 'id',
      align: 'center',
      width: 140,
    },
    {
      title: '内容',
      dataIndex: 'content',
      align: 'center',
      width: 300,
    },
    {
      title: '图片',
      dataIndex: 'pictures',
      align: 'center',
      width: 300,
      hideInSearch: true,
    },
    {
      title: '联系电话',
      dataIndex: 'concantMobile',
      align: 'center',
      width: 140,
    },
    {
      title: '联系人',
      dataIndex: 'concatUser',
      align: 'center',
      width: 120,
    },
    {
      title: '发布位置',
      dataIndex: 'positon',
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
      dataIndex: 'publishUserId',
      align: 'center',
      width: 140,
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      align: 'center',
      width: 200,
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
  const data = new Array(20)
    .fill({
      id: 1,
      content: '123123123',
      pictures: '111',
      concantMobile: '13410825228',
      concatUser: 'ouyang',
      positon: '深圳市南山区龙珠大道245号宝珠花园',
      isTop: 0,
      publishUserId: '2333',
      publishTime: '2020-02-01 00:00:00',
      readCount: 2333,
      likeCount: 4555,
    })
    .map((item, index) => ({ ...item, id: index + 1 }));

  const rowSelection = {};

  const handleNew = () => {
    const values = formRef.current?.getFieldsValue();
    console.log('values:', values);
  };

  return (
    <GridContent>
      <AzTable
        columns={columns}
        dataSource={data}
        rowSelection={rowSelection}
        formRef={formRef}
        toolbarLeftRender={props => (
          <React.Fragment>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleNew}>
              新建
            </Button>
          </React.Fragment>
        )}
        scroll={{ x: '100%' }}
        rowKey="id"
        tableLayout="fixed"
        bordered
        sticky
      />
    </GridContent>
  );
};

export default TopicPage;
