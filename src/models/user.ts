import { Effect, Reducer } from 'umi';

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
    *login() {
      //
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
