import { Effect, Reducer } from 'umi';
import { login, LoginParamsType } from '@/api/login';

export interface UserModelState {
  user: any;
  menus: any;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    getUser: Effect;
    getMenu: Effect;
    login: Effect;
    logout: Effect;
  };
  reducers: {
    updateUser: Reducer<UserModelState>;
    updateMenu: Reducer<UserModelState>;
  };
}

const Usermodel: UserModelType = {
  namespace: 'user',
  state: {
    user: {},
    menus: [],
  },
  effects: {
    *getUser(action, effects) {
      console.log('请求用户接口');
    },
    *getMenu() {
      console.log('请求菜单接口');
    },
    async login({ payload }, { put, call }) {
      await call(login, payload);
      console.log('登录接口:', payload);
    },
    *logout() {
      //
    },
  },
  reducers: {
    updateUser(state, action) {
      return state as UserModelState;
    },
    updateMenu(state, action) {
      return state as UserModelState;
    },
  },
};

export default Usermodel;
