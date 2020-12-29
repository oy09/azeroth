/**
 * 加密/解密工具函数
 * @author ouyang
 */

/**
 * RAS加密
 */
export const encryptRSA = (value: any, opiton?: any) => {
  return value;
};

/**
 * 字符串编码
 * @param value
 * @example
 * cosnt v1 = encodeString('http://www.azeroth.com')
 * v1 -> http%3A%2F%2Fwww.azeroth.com
 */
export const encodeString = (value: string) => {
  return window.encodeURIComponent(value);
};

/**
 * 字符串解码
 * @param value
 * @example
 * const v2 = decodeString(v1)
 * v2 -> http://www.azeroth.com
 */
export const decodeString = (value: string) => {
  return window.decodeURIComponent(value);
};

// base64编码
// 16位唯一ID react/vue key优化
