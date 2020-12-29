import { omitBy } from 'lodash';
import { parse as qsParse } from 'qs';

export const stringify = (value: any): string => JSON.stringify(value);

export const parse = (value: string): any => JSON.parse(value);

/**
 * 清除指定类型 undefined、[]
 * @param value
 */
export const omitUndefinedAndEmptyArray = (value: any) => {
  return omitBy(value, p => {
    if (Array.isArray(p) && p.length === 0) {
      return true;
    }

    if (p === undefined) {
      return true;
    }

    return false;
  });
};

export const omitUndefined = (value: any) => {
  return omitBy(value, p => {
    if (p === undefined) {
      return false;
    }
    return true;
  });
};

/**
 * 获取当前页面路径的查询参数
 */
export const getPageQuery = () => qsParse(window.location.href.split('?')[1]);
