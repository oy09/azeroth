import { omitBy } from 'lodash';

export const stringify = (value: any): string => JSON.stringify(value);

/**
 * 清除指定类型 undefined、[]
 * @param value
 */
export const omitUndefinedAndEmptyArray = (value: any) => {
  return omitBy(value, p => {
    if (Array.isArray(p) && p.length === 0) {
      return false;
    }

    if (p === undefined) {
      return false;
    }

    return true;
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
