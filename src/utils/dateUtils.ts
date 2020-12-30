/**
 * 时间转换工具函数
 * @author ouyang
 */

import dayjs from 'dayjs';

dayjs.locale('zh-cn');

const defaultFormat = 'YYYY-MM-DD HH:mm:ss';

export const setLocalType = (value: string) => dayjs.locale(value);

/**
 * 将时间字符串或时间戳字符串转换为默认日期格式类型
 * @param value 时间戳/时间字符串
 */
export const format = (value: string) => dayjs(value).format(defaultFormat);
