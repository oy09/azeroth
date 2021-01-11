import { STATUS, GENDER, CREATE_TYPE, Values } from '@/utils/constant';

export const formatStatusToLabel = (value: any) => findLabelFromList(STATUS, value);

export const formatGenderToLabel = (value: any) => findLabelFromList(GENDER, value);

export const formatCreateTypeToLabel = (value: any) => findLabelFromList(CREATE_TYPE, value);

/**
 * 将值转换为文本
 * @param sources 源
 * @param target 目标值
 * @param defaultValue 没有找到，返回的默认值
 *
 */
const findLabelFromList = (sources: Values[], target: Values['value'], defaultValue: string = '') => {
  if (sources && sources.length) {
    const item = sources.find(item => item.value === target)?.label;
    return item ? item : defaultValue;
  }
  return defaultValue;
};
