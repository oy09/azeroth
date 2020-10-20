import { createContainer } from 'unstated-next';

export type ColumnState = {
  //
};

export interface UseCounterProps {
  //
}

function useCounter(props: UseCounterProps = {}) {
  //
}

const Counter = createContainer<ReturnType<typeof useCounter>, UseCounterProps>(
  useCounter,
);

export type CountType = typeof useCounter;

export { useCounter };

export default Counter;
