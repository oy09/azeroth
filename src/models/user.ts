import { Effect, Reducer, history } from 'umi';
import { login, LoginParamsType } from '@/api/login';
import { encryptRSA } from '@/utils/secretUtils';
import { ResponseData } from '@/utils/hooks/useRequest';

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
    *login(action, { put, call }) {
      const payload = { ...action.payload } as LoginParamsType;
      payload.account = encryptRSA(payload.account);
      payload.password = encryptRSA(payload.password);
      try {
        const response: ResponseData<any> = yield call(login, payload);
        yield put({ type: 'updateUser', payload: {} });
        console.log('login response:', response);
      } catch (reason) {
        console.log('reason:', reason);
      }
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
