import { STATUS } from '@/utils/constant';

/**
 * 将值转换为文本
 * @param value 值
 */
export const formatStatusToLabel = (value: any) => STATUS.find(item => item.value === value)?.label;
