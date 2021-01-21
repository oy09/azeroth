import '@/styles/index.scss';
import { createLogger } from 'redux-logger';
import React from 'react';
import RequestConfigContext, { Config } from '@/utils/hooks/requestConfigContext';

const frameworkReg = new RegExp('@@');

export const dva = {
  config: {
    onAction: createLogger({
      collapsed: true,
      predicate: (state, action) => {
        const type = action.type as string;
        if (type.match(frameworkReg)) {
          return false;
        }
        return true;
      },
    }),
    onError(e: Error) {
      console.log('dva error:', e);
    },
  },
};

export const rootContainer = (container: React.ReactNode) => {
  return React.createElement<React.ProviderProps<Partial<Config>>>(
    RequestConfigContext.Provider,
    {
      value: {
        baseURL: BASE_URL,
      },
    },
    container,
  );
};

const list = [
  { id: 1, name: 'a', birth: 896630400000 },
  { id: 2, name: 'b', birth: 725817600000 },
  { id: 3, name: 'c', birth: 725817600001 },
  { id: 3, name: 'd', birth: 725817600002 },
  { id: 3, name: 'e', birth: 725817600003 },
];

// q1 字母排序
console.log(
  'sort:',
  [].concat(list as any).sort((a: any, b: any) => b.name.localeCompare(a.name)),
);

const cleanRepeat = (values: any[]) => {
  const map: any = {};
  values.forEach((item: any) => {
    map[item.id] = item;
  });
  return Object.keys(map).map(key => map[key]);
};

// q2 - 以id过滤重复
console.log('celanRepeat:', cleanRepeat(list));

const filterTo95List = (values: { birth: number }[]) => {
  return values.filter(item => item.birth >= new Date(1995, 0, 1).valueOf());
};

// q3 - 过滤
console.log('filter 95:', filterTo95List(list as any));

const dataSource = new Array(100).fill({ id: 0 }).map((item, index) => ({ id: index }));
const page = 3;
const pageSize = 20;
const limit = (page - 1) * pageSize;
const offset = limit + pageSize;

// q4 - 分页
console.log('pagination:', dataSource.slice(limit, offset));
