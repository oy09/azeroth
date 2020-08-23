/**
 * 是url链接类型 返回true
 */
export const isUrl = (path: string): boolean =>
  /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/.test(
    path,
  );

/**
 * 是image路由类型 返回true
 */
export const isImg = (path: string): boolean =>
  /\w.(png|jpg|jpeg|svg|webp|gif|bmp)$/i.test(path);
