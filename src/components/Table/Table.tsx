import React, {
  CSSProperties,
  useRef,
  useEffect,
  useState,
  useCallback,
} from 'react';
import classnames from 'classnames';
import { Card, Button, Divider, Table } from 'antd';
import { isFunction } from 'lodash';
import { TableProps as AntTableProps } from 'antd/lib/table';
import { SortOrder as AntTableSortOrder } from 'antd/lib/table/interface';
import {
  PlusOutlined,
  ReloadOutlined,
  VerticalAlignMiddleOutlined,
  SettingOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import useRequestTable, { ResponseData } from '@/utils/hooks/useRequestTable';
import useDeepCompareEffect from '@/utils/hooks/useDeepCompareEffect';
import { ParamsType } from '@/typing';
import { stringify } from '@/utils/stringUtils';
import Container from './container';
import { mergePagination, useAction, dealyPromise } from './utils';
import './Table.scss';
import useMergedState from '@/utils/hooks/useMergedState';

type TableRowSelection = AntTableProps<any>['rowSelection'];

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
  postData?: (data: any[]) => any[];
  // 获取dataSouce的方法
  request?: (
    params: U & { current?: number; pageSize?: number },
    sort: {
      [key: string]: any;
    },
    filter: {
      [key: string]: React.ReactText[];
    },
  ) => Promise<ResponseData<T>>;
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
    request,
    params,
    manualRequest = false,
    defaultData = [],
    onLoad,
    onRequestError,
    postData,
    actionRef,
    columns: propsColumns,
    rowSelection: propsRowSelection = false,
    pagination: propsPagination,
    ...rest
  } = props;
  const classNames = classnames(defaultClassName, className);

  const rootRef = useRef<HTMLDivElement>(null);
  const fullScreen = useRef<() => void>();
  // 过滤
  const [azFilter, setAzFilter] = useState<{
    [key: string]: React.ReactText[];
  }>({});
  // 排序
  const [azSort, setAzSort] = useState<{ [key: string]: AntTableSortOrder }>(
    {},
  );
  // 选中行key
  const [selectedRowKeys, setSelectedRowKeys] = useMergedState<
    React.ReactText[]
  >([], {
    value: propsRowSelection ? propsRowSelection.selectedRowKeys : undefined,
  });
  // 选中行
  const [selectedRows, setSelectedRows] = useMergedState<T[]>([]);
  // 类似redux数据管理
  const counter = Container.useContainer();

  // 保存选中行和选中key
  const setSelectedRowsAndKeys = (keys: React.ReactText[], rows: T[]) => {
    setSelectedRowKeys(keys);
    setSelectedRows(rows);
  };

  // 清楚选中key和选中行
  const onCleanSelected = useCallback(() => {
    if (propsRowSelection && propsRowSelection.onChange) {
      propsRowSelection.onChange([], []);
    }
    setSelectedRowsAndKeys([], []);
  }, [selectedRowKeys]);

  // 发起请求控制
  const manualRequestRef = useRef<boolean>(manualRequest);
  // 请求分页参数
  const fetchPagination =
    typeof propsPagination === 'object'
      ? propsPagination
      : {
          defaultCurrent: 1,
          defaultPageSize: 20,
        };

  // 请求核心
  const action = useRequestTable(
    async pageParams => {
      // 需要手动触发首次请求
      if (!request || manualRequestRef.current) {
        manualRequestRef.current = false;
        return await dealyPromise(
          {
            data: props.dataSource || [],
            total: 999,
            success: true,
          },
          2000,
        );
      }
      const actionParams = {
        ...(pageParams || {}),
        ...params,
      };
      const resposne = await request(actionParams as U, {}, {});
      const responseData = isFunction(postData)
        ? postData(resposne.data)
        : resposne.data;

      const data = {
        ...resposne,
        data: responseData,
      } as ResponseData<T>;

      return data;
    },
    defaultData,
    {
      ...fetchPagination,
      onLoad,
      onRequestError,
      effects: [stringify(params)],
    },
  );

  // 将counter部分api绑定到actionRef中
  useAction(actionRef, counter, () => {
    // 清空选中行
    onCleanSelected();
    // 清空筛选
    setAzFilter({});
    // 清空排序
    setAzSort({});
  });
  counter.setAction(action);
  counter.propsRef.current = props;

  const toolbarClassName = classnames(`${prefixCls}-toolbar`);
  const tableClassName = classnames(`${prefixCls}-table`);
  // 通过该对象控制 table 翻页，加载，刷新，...等
  const pagination = mergePagination<T>(propsPagination, action);

  const rowSelection: TableRowSelection = {
    ...propsRowSelection,
    onChange: (keys, rows) => {},
  };

  // 全屏
  useEffect(() => {
    fullScreen.current = () => {
      if (!rootRef.current || !document.fullscreenEnabled) {
        return;
      }
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        rootRef.current.requestFullscreen();
      }
    };
  }, [rootRef.current]);

  // 表格尺寸
  useEffect(() => {
    counter.setTableSize(rest.size || 'middle');
  }, [rest.size]);

  // 非受控pagination变化
  useDeepCompareEffect(() => {
    if (
      propsPagination &&
      (propsPagination.current || propsPagination.pageSize)
    ) {
      action.setPageInfo({
        page: propsPagination.current || action.current,
        pageSize: propsPagination.pageSize || action.pageSize,
      });
    }
  }, [
    propsPagination && propsPagination.pageSize,
    propsPagination && propsPagination.current,
  ]);

  // 表格onChange 处理
  const handleTableChange = (
    pagination: any,
    filters: any,
    sorter: any,
    extra: any,
  ) => {
    //
  };

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

  // 数据源
  const dataSource = request
    ? (action.dataSouce as T[])
    : props.dataSource || [];
  // 数据状态
  const loading = props.loading !== undefined ? props.loading : action.loading;

  const tableDom = (
    <Table
      {...rest}
      size={counter.tableSize}
      style={tableStyle}
      rowSelection={propsRowSelection === false ? undefined : rowSelection}
      className={tableClassName}
      columns={counter.columns?.filter(item => {
        return true;
      })}
      loading={loading}
      pagination={pagination}
      dataSource={dataSource}
      onChange={handleTableChange}
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
    <div className={classNames} style={style} ref={rootRef}>
      <div style={{ display: 'none' }}>search filter</div>
      <div style={{ display: 'none' }}>extra render</div>
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
  );
};

const ProviderWrap = <T, U extends { [key: string]: any } = {}>(
  props: TableProps<T, U>,
) => {
  return (
    <Container.Provider initialState={props}>
      <AzTable {...props} />
    </Container.Provider>
  );
};

export default ProviderWrap;
