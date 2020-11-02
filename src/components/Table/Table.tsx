import React, { CSSProperties, useRef, useEffect, useState, useCallback, useMemo } from 'react';
import classnames from 'classnames';
import { Card, Button, Table } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { isFunction, get } from 'lodash';
import {
  TableProps as AntTableProps,
  TablePaginationConfig as AntTablePaginationConfig,
  ColumnType as AntTableColumnType,
  ColumnsType as AntTableColumnsType,
  ColumnGroupType as AntTableColumnGroupType,
} from 'antd/lib/table';
import { FormItemProps as AntFormItemProps } from 'antd/lib/form';
import {
  SortOrder as AntTableSortOrder,
  SorterResult as AntTableSortResult,
  ColumnFilterItem as AntTableColumnFilterItem,
} from 'antd/lib/table/interface';
import useRequestTable, { ResponseData } from '@/utils/hooks/useRequestTable';
import useDeepCompareEffect from '@/utils/hooks/useDeepCompareEffect';
import useMergedState from '@/utils/hooks/useMergedState';
import { ParamsType, AzSchema } from '@/typing';
import { stringify, omitUndefined, omitUndefinedAndEmptyArray } from '@/utils/stringUtils';
import { mergePagination, useAction, getColumnKey, dealyPromise } from './utils';
import Container, { useCounter, ColumnState } from './container';
import AzToolbar, { OptionConfig } from './Toolbar';
import './Table.scss';

type TableRowSelection = AntTableProps<any>['rowSelection'];

// 移除 render/children/title/filters 属性
export type ExtraAzColumnType<T> = Omit<AntTableColumnType<T>, 'render' | 'children' | 'title' | 'filters'>;

// 公共控制属性，其它组件会用到Table Column，部分的Column属性会被应用在其它组件中
interface AzColumnControl {
  index?: number;
  // 初始化值
  initialValue?: any;
  // 是否缩略
  ellipsis?: boolean;
  // 是否拷贝
  copyable?: boolean;
  // 在查询表单中隐藏
  hideSearch?: boolean;
  // 在表格中隐藏
  hideTable?: boolean;
  // 在表单中隐藏
  hideForm?: boolean;
  // 表头筛选菜单项
  filters?: boolean | AntTableColumnFilterItem[];
  // 表单顺序
  order?: number;
  // 传递给表达项的props
  formItemProps?: Partial<Omit<AntFormItemProps, 'children'>>;
}

// Table Column 主要属性类型
export type AzColumnType<T = unknown> = AzSchema<T, any, ExtraAzColumnType<T> & AzColumnControl>;

export interface AzcColumnGroupType<T> extends AzColumnType<T> {
  children: AzColumns<T>[];
}

// Table Column 主要属性组合
export type AzColumns<T = any> = AzcColumnGroupType<T> | AzColumnType<T>;

export interface TableProps<T, U extends ParamsType> extends Omit<AntTableProps<T>, 'columns' | 'rowSelection'> {
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
      [key: string]: AntTableSortOrder;
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
  options?: OptionConfig<T>; // 需要修改类型
  // 操作引用，操作table
  actionRef?: any; // 需要修改类型
  defaultData?: T[];
  columns?: AzColumns<T>[]; // 需要修改类型
  params?: U;
}

interface RenderColumnOption<T> {
  item: AzColumns<T>;
  text: any;
  row: T;
  index: number;
  columnEmptyText: string | false;
  counter: ReturnType<typeof useCounter>;
}

// 创建列标题
const renderColumnsTitle = (item: AzColumns<any>) => {
  const { title } = item;
  if (title && typeof title === 'function') {
    return title(item, 'table', <div>111</div>);
  }
  return title;
};

// 列单元格具体渲染
const renderColumn = <T, U = any>(option: RenderColumnOption<T>): any => {
  const { text } = option;
  return text;
};

// 默认的table column OnFilter实现
const defaultOnFilter = (value: string, record: any, dataIndex: string | string[]) => {
  let recordElement = Array.isArray(dataIndex) ? get(record, dataIndex) : record[dataIndex];
  if (typeof recordElement === 'number') {
    recordElement = recordElement.toString();
  }
  const itemValue = String(recordElement);
  return String(itemValue) === String(value);
};

/**
 * 转换格式，将业务配置ant column转换为业务 column
 */
const generatorCoumnList = <T, U = {}>(
  columns: AzColumns<T>[],
  map: { [key: string]: ColumnState },
  counter: ReturnType<typeof useCounter>,
  columnEmptyText?: string | false,
): Array<AntTableColumnType<T>> => {
  const newColumns = columns
    .map((item, index) => {
      const { key, dataIndex, valueEnum, valueType, filters = [] } = item;
      const noNeedAz = !dataIndex && !valueEnum && !valueType;
      if (noNeedAz) {
        return item;
      }
      const columnkey = getColumnKey(key, index);
      const config = columnkey ? map[columnkey] || { fixed: item.fixed } : { fixed: item.fixed };
      const { propsRef } = counter;
      const templateColumn = {
        onFilter: propsRef.current?.request
          ? undefined
          : (value: string, row: T) => defaultOnFilter(value, row, dataIndex as string[]),
        index: index,
        ...item,
        filters: false,
        title: renderColumnsTitle(item),
        valueEnum: valueEnum,
        ellipsis: false,
        width: item.width || (item.fixed ? 200 : undefined),
        children: (item as AntTableColumnGroupType<T>).children
          ? generatorCoumnList((item as AntTableColumnGroupType<T>).children as AzColumns<T>[], map, counter, columnEmptyText)
          : undefined,
        render: (text: any, row: T, index: number) => renderColumn({ item, text, row, index, columnEmptyText: '-', counter }),
      };

      return omitUndefinedAndEmptyArray(templateColumn);
    })
    .filter(item => {
      return !item.hideInTable;
    });
  // console.log('columns:', newColumns)
  return newColumns as Array<AntTableColumnType<T>>;
};

/**
 * 业务表格组件
 * CRUD基本操作
 */
const AzTable = <T extends {}, U extends ParamsType>(props: TableProps<T, U>) => {
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
    options,
    columns: propsColumns = [],
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
  const [azSort, setAzSort] = useState<{ [key: string]: AntTableSortOrder }>({});
  // 选中行key
  const [selectedRowKeys, setSelectedRowKeys] = useMergedState<React.ReactText[]>([], {
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
      const resposne = await request(actionParams as U, azSort, azFilter);
      const responseData = isFunction(postData) ? postData(resposne.data) : resposne.data;

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

  // 表格尺寸/间距/大小
  useEffect(() => {
    counter.setTableSize(rest.size || 'middle');
  }, [rest.size]);

  // 保存columns配置（其它组件需要用到），同步到缓存中
  useDeepCompareEffect(() => {
    counter.setAzColumns(propsColumns);
    // counter.setColumns(propsColumns)
  }, [propsColumns]);

  /**
   * 同步paginatio，非受控pagination变化
   */
  useDeepCompareEffect(() => {
    if (propsPagination && (propsPagination.current || propsPagination.pageSize)) {
      action.setPageInfo({
        page: propsPagination.current || action.current,
        pageSize: propsPagination.pageSize || action.pageSize,
      });
    }
  }, [propsPagination && propsPagination.pageSize, propsPagination && propsPagination.current]);

  // 创建表格列配置
  const tableColumn = useMemo(() => generatorCoumnList(propsColumns, {}, counter, '-'), [propsColumns]);

  /**
   * Table Column 变化的时候更新
   */
  useDeepCompareEffect(() => {
    if (tableColumn && tableColumn.length > 0) {
      counter.setColumns(tableColumn);
      // 重新创建key用于排序
      const columnKeys = tableColumn.map((item, index) => getColumnKey(item.key, index));
      counter.setSortKeyColumns(columnKeys);
    }
  }, [tableColumn]);

  // 表格onChange 处理
  const handleTableChange = (
    pagination: AntTablePaginationConfig,
    filters: { [key: string]: React.ReactText[] | null },
    sorter: AntTableSortResult<T> | AntTableSortResult<T>[],
    extra: any,
  ) => {
    if (rest.onChange) {
      rest.onChange(pagination, filters, sorter, extra);
    }
    setAzFilter(omitUndefinedAndEmptyArray(filters));
    if (Array.isArray(sorter)) {
      const data = sorter.reduce<{ [key: string]: any }>((pre, value) => {
        return {
          ...pre,
          [`${value.field}`]: value.order,
        };
      }, {});
      setAzSort(omitUndefined(data));
    } else {
      setAzSort(omitUndefined({ [`${sorter.field}`]: sorter.order }));
    }
  };

  /**
   * 需要把这部分单独封装组件
   * 刷新table
   * 调整table大小
   * table column控制
   * 页面全屏
   */
  const toolbarDom = (
    <AzToolbar
      options={options}
      action={action}
      selectRows={selectedRows}
      selectRowkeys={selectedRowKeys}
      onFullScreen={fullScreen.current}
      leftbarRender={() => (
        <>
          <Button type="primary" icon={<PlusOutlined />}>
            新建
          </Button>
        </>
      )}
    />
  );

  // 数据源
  const dataSource = request ? (action.dataSouce as T[]) : props.dataSource || [];
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

const ProviderWrap = <T, U extends { [key: string]: any } = {}>(props: TableProps<T, U>) => {
  return (
    <Container.Provider initialState={props}>
      <AzTable {...props} />
    </Container.Provider>
  );
};

export default ProviderWrap;
