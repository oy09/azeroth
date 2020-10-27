import { createContainer } from 'unstated-next';
import { useRef } from 'react';
import { TableProps } from './Table';

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
  const propsRef = useRef<TableProps<any, any>>();

  return {
    action: {},
    setAction: (action: any) => null,
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

export type CountType = typeof useCounter;

export { useCounter };

export default Counter;
