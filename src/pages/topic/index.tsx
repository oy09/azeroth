import React, { useRef, useState } from 'react';
import { Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import GridContent from '@/layouts/GridContent';
import { AzTable } from '@/components/Table';
import { AzColumnType } from '@/components/Table/Table';
import { SearchProps } from '@/components/Table/Query';
import Dialog from '@/components/Dialog';
import { getTopicList, createTopic, updateTopic, deleteTopic } from '@/api/topic';
import { format } from '@/utils/dateUtils';
import { CoreTableActionType } from '@/typing';
import TopicFrom from './components/TopicForm';
import './topic.scss';

export interface TopicPageProps {
  className?: string;
}

const TopicPage: React.FC<TopicPageProps> = props => {
  const formRef: SearchProps<any>['formRef'] = useRef();
  const actionRef = useRef<CoreTableActionType>();
  const [row, setRow] = useState<any | null>();
  const [createDialogVisible, handleCreateDialogVisible] = useState<boolean>(false);
  const [updateDialogVisible, handleUpdateDialogVisible] = useState<boolean>(false);
  const [selectRows, setSelectRows] = useState<any[]>([]);
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
      title: '置顶时间',
      dataIndex: 'topExpiresTime',
      align: 'center',
      width: 240,
      renderText: value => (value ? format(value) : '-'),
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
      renderText: value => (value ? format(value) : '-'),
    },
    {
      title: '浏览数量',
      dataIndex: 'readCount',
      align: 'center',
      width: 120,
      hideInSearch: true,
      renderText: value => (value ? value : '-'),
    },
    {
      title: '点赞数量',
      dataIndex: 'likeCount',
      align: 'center',
      width: 120,
      hideInSearch: true,
      renderText: value => (value ? value : '-'),
    },
    {
      title: '操作',
      dataIndex: '_op',
      align: 'center',
      width: 80,
      fixed: 'right',
      render: (value, row, index) => {
        return <a onClick={() => handleUpdate(row)}>编辑</a>;
      },
      hideInSearch: true,
    },
  ];

  const handleNew = () => {
    handleCreateDialogVisible(true);
  };

  const handleUpdate = (record: any) => {
    setRow(record);
    handleUpdateDialogVisible(true);
  };

  const handleRemove = async (rows: any[]) => {
    const hide = message.loading('正在删除中···');
    try {
      const ids = rows.map(item => item.id);
      await deleteTopic({ ids });
      hide();
      message.success('删除成功');
    } catch (reason) {
      hide();
      message.warn(`删除失败: ${reason.message}`);
      return false;
    }
  };

  const handleUpdateClose = () => {
    handleUpdateDialogVisible(false);
  };

  const handleSubmit = async (values: any) => {
    try {
      await createTopic(values);
      handleCreateDialogVisible(false);
      actionRef.current?.reload();
      message.success('提交成功');
    } catch (reason) {
      message.warn(`提交失败: ${reason.message || ''}`);
      return false;
    }
  };

  const handleUpateSubmit = async (values: any) => {
    try {
      await updateTopic(values.id, values);
      handleUpdateDialogVisible(false);
      actionRef.current?.reload();
      message.success('修改成功');
    } catch (reason) {
      message.warn(`修改失败: ${reason.message || ''}`);
    }
  };

  return (
    <GridContent>
      <AzTable
        columns={columns}
        actionRef={actionRef}
        rowSelection={{
          onSelect: (record, selected, list) => {
            setSelectRows(list);
          },
        }}
        formRef={formRef}
        toolbarLeftRender={props => (
          <React.Fragment>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleNew}>
              新建
            </Button>
            {selectRows?.length > 0 && (
              <div className="extra-tool">
                <Button
                  danger
                  onClick={async () => {
                    await handleRemove(selectRows);
                    setSelectRows([]);
                    actionRef.current?.reloadAndRest();
                  }}
                >
                  批量删除({selectRows.length})
                </Button>
              </div>
            )}
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
        <TopicFrom onCancel={() => handleCreateDialogVisible(false)} onSubmit={handleSubmit} />
      </Dialog>
      <Dialog title="修改话题" destroyOnClose visible={updateDialogVisible} onCancel={() => handleUpdateDialogVisible(false)}>
        <TopicFrom
          initialValues={row}
          itemVisibleMap={{
            isTop: false,
          }}
          onCancel={handleUpdateClose}
          onSubmit={handleUpateSubmit}
        />
      </Dialog>
    </GridContent>
  );
};

export default TopicPage;
