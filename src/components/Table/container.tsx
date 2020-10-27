import { createContainer } from 'unstated-next';
import { useRef } from 'react';
import { TableProps } from './Table';
import {
  ResponseData,
  UseReqeustTableAction,
} from '@/utils/hooks/useRequestTable';

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
  const actionRef = useRef<UseReqeustTableAction<ResponseData<any>>>();
  const propsRef = useRef<TableProps<any, any>>();

  return {
    action: actionRef,
    setAction: (action: UseReqeustTableAction<ResponseData<any>>) => {
      actionRef.current = action;
    },
    sortKeyColumns: [],
    setSortKeyColumns: () => null,
    columns: props.columns,
    setCoumns: () => null,
    tableSize: 'middle' as DensityType,
    setTableSize: (size: DensityType) => null,
    columnsMap: {},
    setCoumnsMap: () => null,
    propsRef,
  };
}

const Counter = createContainer<ReturnType<typeof useCounter>, UseCounterProps>(
  useCounter,
);

export type CounterType = typeof useCounter;

export { useCounter };

export default Counter;
