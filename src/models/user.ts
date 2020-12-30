import { Effect, Reducer, history } from 'umi';
import { message } from 'antd';
import { login, LoginParamsType } from '@/api/login';
import { getUser, getMenu } from '@/api/user';
import { encryptRSA } from '@/utils/secretUtils';
import { ResponseData as Response } from '@/typing';
import { getPageQuery } from '@/utils/stringUtils';

export interface UserModelState {
  current: CurrentUser;
  menus: any;
}

export interface CurrentUser {
  //
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
    current: {},
    menus: [],
  },
  effects: {
    *getUser(action, { put, call }) {
      try {
        const response: Response<any> = yield call(getUser);
        yield put({ type: 'updateUser', payload: response.data });
      } catch (reason) {
        console.warn('请求用户接口失败:', reason);
      }
    },
    *getMenu() {
      console.log('请求菜单接口');
    },
    *login(action, { call }) {
      const payload = { ...action.payload } as LoginParamsType;
      payload.account = encryptRSA(payload.account);
      payload.password = encryptRSA(payload.password);
      try {
        yield call(login, payload);
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (urlParams.origin === redirectUrlParams.origin) {
            // 当前url和重定向url同源
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            // 不同源，跳转到重定向url
            window.location.href = redirect;
            return;
          }
        }
        history.push(redirect || '/');
        console.log('redirect:', redirect);
      } catch (reason) {
        message.error(reason.message);
        console.log('reason:', reason);
      }
    },
    *logout() {
      //
    },
  },
  reducers: {
    updateUser(state, { payload }) {
      return {
        ...state,
        current: payload,
      } as UserModelState;
    },
    updateMenu(state, action) {
      return state as UserModelState;
    },
  },
};

export default Usermodel;
