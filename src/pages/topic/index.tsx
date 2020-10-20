import React from 'react';
import GridContent from '@/layouts/GridContent';
import { Table, Card, Button, Divider } from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  SettingOutlined,
  FullscreenOutlined,
  VerticalAlignMiddleOutlined,
} from '@ant-design/icons';
import { ColumnType } from 'antd/lib/table';
import styles from './topic.scss';

export interface TopicPageProps {
  className?: string;
}

const TopicPage: React.FC<TopicPageProps> = props => {
  const columns: ColumnType<any>[] = [
    {
      title: '序号',
      key: 'no',
      width: 100,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 140,
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      align: 'center',
      width: 300,
    },
    {
      title: '图片',
      dataIndex: 'pictures',
      key: 'pictures',
      align: 'center',
      width: 300,
    },
    {
      title: '联系电话',
      dataIndex: 'concantMobile',
      key: 'concantMobile',
      align: 'center',
      width: 140,
    },
    {
      title: '联系人',
      dataIndex: 'concatUser',
      key: 'concatUser',
      align: 'center',
      width: 120,
    },
    {
      title: '发布位置',
      dataIndex: 'positon',
      key: 'positon',
      align: 'center',
      width: 340,
    },
    {
      title: '置顶状态',
      dataIndex: 'isTop',
      key: 'isTop',
      align: 'center',
      width: 240,
    },
    {
      title: '发布用户',
      dataIndex: 'publishUserId',
      key: 'publishUserId',
      align: 'center',
      width: 140,
    },
    {
      title: '发布时间',
      dataIndex: 'publishTime',
      key: 'publishTime',
      align: 'center',
      width: 200,
    },
    {
      title: '浏览数量',
      dataIndex: 'readCount',
      key: 'readCount',
      align: 'center',
      width: 120,
    },
    {
      title: '点赞数量',
      dataIndex: 'likeCount',
      key: 'likeCount',
      align: 'center',
      width: 120,
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

  return (
    <GridContent>
      <Card bodyStyle={{ padding: 0 }}>
        <div className={styles.tableToolbar}>
          <Button type="primary" icon={<PlusOutlined />}>
            新建
          </Button>
          <div className="toolbar-default-option">
            <Divider type="vertical" />
            <div className={styles.toolbarhorizontal}>
              <div className="toolbar-item">
                <ReloadOutlined />
              </div>
              <div className="toolbar-item">
                <VerticalAlignMiddleOutlined />
              </div>
              <div className="toolbar-item">
                <SettingOutlined />
              </div>
              <div className="toolbar-item">
                <FullscreenOutlined />
              </div>
            </div>
          </div>
        </div>
        <Table
          className={styles.table}
          columns={columns}
          dataSource={data}
          tableLayout="fixed"
          size="middle"
          rowSelection={rowSelection}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `总共 ${total} 条`,
            size: 'default',
          }}
          scroll={{ x: '100%' }}
          rowKey="id"
          sticky
          bordered
        />
      </Card>
      {/* <div>tool - 新增/编辑/删除/搜索</div> */}
      {/* <div>table - 列、多选、点击编辑、内如预览</div>
      <div>pagination - 分页</div>
      <div>add/update form - 添加/编辑表单</div> */}
    </GridContent>
  );
};

export default TopicPage;
