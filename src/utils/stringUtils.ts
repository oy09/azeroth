import { omitBy, maxBy } from 'lodash';
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

/**
 * 字符串切割
 * 输入1 文本
 * 输出2 限制长度
 * 输出 字符串数组
 * @param {string} content
 * @param {number} limit
 * @return {array}
 */
export const sliceTextToArray = (content: string, limit: number = 50): string[] => {
  const result: string[] = [];
  if (!content) {
    return result;
  }
  const totalSize = content.length;
  let currentSize = totalSize;
  while (currentSize > limit) {
    const value = content.substring(0, limit);
    const sliceIndex = sliceTextIndex(value);
    console.log('sliceIndex:', sliceIndex);
    const sliceText = value.substring(0, sliceIndex);
    result.push(sliceText);

    content = content.substring(sliceIndex);
    currentSize = content.length;
  }

  if (Math.abs(currentSize - limit) > 0) {
    result.push(content);
  }

  return result;
};

/**
 * 寻找文本中合适的切割点，哪种切割点是一个合适的切割点？
 * 最好是选择字符串最后一个标点符号作为切割点
 * @param {string} content 文本
 */
export const sliceTextIndex = (content: string): number => {
  // 使用正则表达式 完成对文本内容的符号匹配, 输出map { sign: index }
  // 统计map最大index字符
  const record: { sign: string; index: number }[] = [];
  content.replace(/(。|\.|，|\;|；|、|》|\]|\?|？|\!|！|\%|\:|：)/g, (match, p1, offset) => {
    // 偏移量+1 是为了保证切割点在符号后
    record.push({ sign: match, index: offset + 1 });
    return '';
  });
  return maxBy(record, item => item.index)?.index || content.length;
};
