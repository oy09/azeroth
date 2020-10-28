import { createContainer } from 'unstated-next';
import { useRef, useState } from 'react';
import { ColumnType } from 'antd/lib/table';
import { TableProps } from './Table';
import { ResponseData, UseReqeustTableAction } from '@/utils/hooks/useRequestTable';

export type ColumnState = {
  //
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
  const actionRef = useRef<UseReqeustTableAction<ResponseData<any>>>();
  const propsRef = useRef<TableProps<any, any>>();

  return {
    action: actionRef,
    setAction: (action: UseReqeustTableAction<ResponseData<any>>) => {
      actionRef.current = action;
    },
    sortKeyColumns: [],
    setSortKeyColumns: () => null,
    columns: columns,
    setCoumns: setColumns,
    tableSize: 'middle' as DensityType,
    setTableSize: (size: DensityType) => null,
    columnsMap: {},
    setCoumnsMap: () => null,
    propsRef,
  };
}

const Counter = createContainer<ReturnType<typeof useCounter>, UseCounterProps>(useCounter);

export type CounterType = typeof useCounter;

export { useCounter };

export default Counter;
