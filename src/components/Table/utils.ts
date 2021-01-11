import { useEffect, ReactText, ReactNode } from 'react';
import { TablePaginationConfig } from 'antd/lib/table';
import { isMap } from 'lodash';
import { UseReqeustTableAction, ResponseData } from '@/utils/hooks/useRequestTable';
import { CoreTableActionType } from '@/typing';
import { CounterType } from './container';
import { TableProps } from './Table';

/**
 * 将counter和ref进行绑定，暴露几个业务方法
 * @param ref
 * @param counter
 * @param onCleanSelected
 */
export const useAction = <T, U = any>(
  ref: TableProps<T, any>['actionRef'],
  counter: ReturnType<CounterType>,
  onCleanSelected: () => void,
) => {
  useEffect(() => {
    const userAction: CoreTableActionType = {
      reload: async resetPage => {
        const {
          action: { current },
        } = counter;
        if (resetPage) {
          await current?.resetPage();
        }
        await current?.reload();
      },
      reloadAndRest: async () => {
        const {
          action: { current },
        } = counter;
        onCleanSelected();
        await current?.resetPage();
        await current?.reload();
      },
      rest: async () => {
        const {
          action: { current },
        } = counter;
        await current?.reset();
        await current?.reload();
      },
      cleanSelected: () => onCleanSelected(),
    };
    if (ref && typeof ref === 'function') {
      ref(userAction);
    }
    if (ref && typeof ref !== 'function') {
      ref.current = userAction;
    }
  }, []);
};

/**
 * @param pagination 默认分页设置
 * @param action UseReqeustTableAction 函数
 * @param intl 未实现
 */
export const mergePagination = <T>(
  pagination: TablePaginationConfig | boolean | undefined = {},
  action: UseReqeustTableAction<ResponseData<T>>,
  intl?: any,
): TablePaginationConfig | false | undefined => {
  if (pagination === false) {
    return false;
  }
  const defaultPagination: TablePaginationConfig | {} = typeof pagination === 'object' ? pagination : {};
  const { current, pageSize } = action;

  return {
    showTotal: (all, range) => {
      return `第 ${range[0]}-${range[1]} 条/总共 ${all} 条`;
    },
    showSizeChanger: true,
    total: action.total,
    ...defaultPagination,
    current,
    pageSize,
    onChange: (newPage, newPageSize) => {
      if (current !== newPage || pageSize !== newPageSize) {
        action.setPageInfo({ pageSize: newPageSize, page: newPage });
      }

      const { onChange } = pagination as TablePaginationConfig;
      if (onChange) {
        onChange(newPage, pageSize || 20);
      }
    },
  };
};

/**
 * 取列的唯一值
 * @param key
 * @param index
 */
export const getColumnKey = (key?: ReactText, index?: number): string => {
  if (key) {
    return `${key}`;
  }
  return `${index}`;
};

/**
 * 延迟请求 - 调试
 * @param value
 * @param time
 */
export const dealyPromise = (value: any, time: number = 3000): Promise<any> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, time);
  });
};

/**
 * 对象转Map类型
 * @param value object类型
 */
const ObjToMap = (value: any): Map<ReactText, ReactNode> => {
  if (!value) {
    return value;
  }
  if (isMap(value)) {
    return value;
  }
  return new Map(Object.entries(value));
};

type ValueEnumItem = {
  value: string | number;
  text: string;
  disabled?: boolean;
};

/**
 * 枚举类型值转换为数组
 * @param value
 */
export const parsingValueEnumToArray = (value: any = new Map()): ValueEnumItem[] => {
  const enumArray: ValueEnumItem[] = [];
  const valueEnum = ObjToMap(value);

  if (!valueEnum) {
    return [];
  }

  valueEnum.forEach((_, key) => {
    if (!valueEnum.has(key) && !valueEnum.has(`${key}`)) {
      return;
    }

    const value = (valueEnum.get(key) || valueEnum.get(`${key}`)) as ValueEnumItem | string | number;
    if (!value) {
      return;
    }

    if (typeof value === 'object' && value.text) {
      enumArray.push({
        text: value.text,
        value: key,
        disabled: value.disabled,
      });
      return;
    }
    enumArray.push({
      text: value as string,
      value: key,
    });
  });

  return enumArray;
};
