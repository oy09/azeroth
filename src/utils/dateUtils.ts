/**
 * 时间转换工具函数
 * @author ouyang
 */

import dayjs, { ConfigType } from 'dayjs';

dayjs.locale('zh-cn');

const defaultFormat = 'YYYY-MM-DD HH:mm:ss';

export const setLocalType = (value: string) => dayjs.locale(value);

/**
 * 将时间字符串或时间戳字符串转换为默认日期格式类型
 * @param value 时间戳/时间字符串
 */
export const format = (value: string) => dayjs(value).format(defaultFormat);

/**
 * 时间戳
 */
export const Unix = () => dayjs().unix();

/**
 * 转时间戳
 */
export const toUnix = (value: ConfigType) => dayjs(value).unix();

/**
 * 当天最后时间段，23:59:59
 */
export const lastTimeFromDay = () =>
  dayjs()
    .set('hour', 23)
    .set('minute', 59)
    .set('second', 59);

/**
 * 当前第一时间段, 00:00:00
 */
export const firstTimeFromDay = () =>
  dayjs()
    .set('hour', 0)
    .set('minute', 0)
    .set('second', 0)
    .set('millisecond', 0);

export const instance = () => dayjs();
