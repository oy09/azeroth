import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import { ResponseData as Response } from '@/typing';
import { getMenuList } from '@/api/admin';

export interface DataModelState {
  menuList: any[];
}

export interface DataModelType {
  namespace: 'base';
  state: DataModelState;
  effects: {};
  reducers: {
    //
  };
}

const DataModel: DataModelType = {
  namespace: 'base',
  state: {
    menuList: [],
  },
  effects: {},
  reducers: {
    //
  },
};

export default DataModel;
