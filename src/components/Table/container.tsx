import { createContainer } from 'unstated-next';
import { useRef, useState } from 'react';
import { ColumnType } from 'antd/lib/table';
import { TableProps, AzColumns } from './Table';
import { ResponseData, UseReqeustTableAction } from '@/utils/hooks/useRequestTable';
import useMergeState from '@/utils/hooks/useMergedState';

// 列状态
export type ColumnState = {
  show?: boolean;
  fixed?: 'right' | 'left';
  order?: number;
};

export type DensityType = 'middle' | 'small' | 'large' | undefined;

export interface UseCounterProps {
  columns?: any[];
  columnStateMap?: { [key: string]: ColumnState };
  onColumnStateChange?: (map: { [key: string]: ColumnState }) => void;
  size?: any;
  onSizeChange?: (size: any) => void;
}

function useCounter(props: UseCounterProps = {}) {
  const [columns, setColumns] = useState<ColumnType<any>[]>([]);
  const [azColumns, setAzColumns] = useState<AzColumns<any>[]>([]);
  const [columnsMap, setColumnsMap] = useMergeState(props.columnStateMap || {}, {
    value: props.columnStateMap,
    onChange: props.onColumnStateChange,
  });
  const actionRef = useRef<UseReqeustTableAction<ResponseData<any>>>();
  const propsRef = useRef<TableProps<any, any>>();
  const sortKeysRef = useRef<string[]>([]);

  return {
    action: actionRef,
    setAction: (action: UseReqeustTableAction<ResponseData<any>>) => {
      actionRef.current = action;
    },
    sortKeyColumns: sortKeysRef.current,
    setSortKeyColumns: (key: string[]) => {
      sortKeysRef.current = key;
    },
    columns: columns,
    setColumns: setColumns,
    azColumns: azColumns,
    setAzColumns: setAzColumns,
    tableSize: 'middle' as DensityType,
    setTableSize: (size: DensityType) => null,
    columnsMap: columnsMap,
    setCoumnsMap: setColumnsMap,
    propsRef,
  };
}

const Counter = createContainer<ReturnType<typeof useCounter>, UseCounterProps>(useCounter);

export type CounterType = typeof useCounter;

export { useCounter };

export default Counter;
