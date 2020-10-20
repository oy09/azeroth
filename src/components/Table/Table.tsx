import React, { CSSProperties, useRef } from 'react';
import classnames from 'classnames';
import { Card, Button, Divider, Table } from 'antd';
import { TableProps as AntTableProps } from 'antd/lib/table';
import {
  PlusOutlined,
  ReloadOutlined,
  VerticalAlignMiddleOutlined,
  SettingOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import { ParamsType } from '@/typing';
import Container from './container';
import './Table.scss';

export interface TableProps<T, U extends ParamsType>
  extends Omit<AntTableProps<T>, 'columns' | 'rowSelection'> {
  style?: CSSProperties;
  tableStyle?: CSSProperties;
  className?: string;
  defaultClassName?: string;
  prefixCls?: string;
  tableRender?: (
    props: TableProps<T, U>,
    defaultDom: JSX.Element,
    domList: {
      toolbar: JSX.Element | undefined;
      table: JSX.Element | undefined;
    },
  ) => React.ReactNode;
  onSizeChange?: (size: any) => void; // 需要修改类型
  onColumnsStateChange?: (map: any) => void; // 需要修改类型
  onLoad?: (dataSource: T[]) => void;
  onRequestError?: (e: Error) => void;
  // 提交表单触发
  onSubmit?: (params: U) => void;
  // 重置表单触发
  onReset?: () => void;
  // 数据再处理
  postData?: (data: []) => any[];
  // 获取dataSouce的方法
  request?: (
    params: U & { current?: number; limit?: number },
    sort: {
      [key: string]: any;
    },
    filter: {
      [key: string]: React.ReactText[];
    },
  ) => Promise<T>;
  // 是否手动发请求
  manualRequest?: boolean;
  // 多选配置对象
  rowSelection?: AntTableProps<T>['rowSelection'] | false;
  // 默认操作栏配置
  options?: any; // 需要修改类型
  // 操作引用，操作table
  actionRef?: any; // 需要修改类型
  defaultData?: T[];
  columns?: any[]; // 需要修改类型
  params?: U;
}

/**
 * 业务表格组件
 * CRUD基本操作
 */
const AzTable = <T extends {}, U extends ParamsType>(
  props: TableProps<T, U>,
) => {
  const {
    style,
    tableStyle,
    className,
    prefixCls = 'az',
    defaultClassName,
    columns: propsColumns,
    pagination: propsPagination,
    ...reset
  } = props;
  const classNames = classnames(defaultClassName, className);

  const rootRef = useRef(null);

  const toolbarClassName = classnames(`${prefixCls}-toolbar`);
  const tableClassName = classnames(`${prefixCls}-table`);
  const pagination = propsPagination;

  const rowSelection = {};

  /**
   * 需要把这部分单独封装组件
   * 刷新table
   * 调整table大小
   * table column控制
   * 页面全屏
   */
  const toolbarDom = (
    <div className={toolbarClassName}>
      <Button type="primary" icon={<PlusOutlined />}>
        新建
      </Button>
      <div className={`${toolbarClassName}-default-options`}>
        <Divider type="vertical" />
        <div className={`${toolbarClassName}-horizontal`}>
          <div className={`${toolbarClassName}-item`}>
            <ReloadOutlined />
          </div>
          <div className={`${toolbarClassName}-item`}>
            <VerticalAlignMiddleOutlined />
          </div>
          <div className={`${toolbarClassName}-item`}>
            <SettingOutlined />
          </div>
          <div className={`${toolbarClassName}-item`}>
            <FullscreenOutlined />
          </div>
        </div>
      </div>
    </div>
  );

  const tableDom = (
    <Table
      {...reset}
      style={tableStyle}
      rowSelection={rowSelection}
      className={tableClassName}
      columns={propsColumns}
      pagination={pagination}
      dataSource={props.dataSource}
    />
  );

  const tableWrapDom = (
    <React.Fragment>
      {toolbarDom}
      {tableDom}
    </React.Fragment>
  );

  const renderTable = () => {
    if (props.tableRender) {
      return props.tableRender(props, tableWrapDom, {
        toolbar: toolbarDom,
        table: tableDom,
      });
    }
    return tableWrapDom;
  };

  return (
    <Container.Provider initialState={props}>
      <div className={classNames} style={style} ref={rootRef}>
        <Card
          bordered={false}
          style={{
            height: '100%',
          }}
          bodyStyle={{
            padding: 0,
          }}
        >
          {renderTable()}
        </Card>
      </div>
    </Container.Provider>
  );
};

export default AzTable;
