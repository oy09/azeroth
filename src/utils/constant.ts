/**
 * 业务常量
 * @author ouyang
 */

export interface Values {
  value: number;
  label: string;
}

export const STATUS_MAP = {
  DISABLE: 0,
  ENABLE: 1,
  DELETE: 2,
};

// 状态
export const STATUS = [
  { value: STATUS_MAP.DISABLE, label: '禁用' },
  { value: STATUS_MAP.ENABLE, label: '启用' },
  { value: STATUS_MAP.DELETE, label: '删除' },
];

// 话题类型
export const TOPIC_TYPE = [
  { value: 1, label: '房屋出租' },
  { value: 2, label: '全部招聘' },
  { value: 3, label: '兼职信息' },
  { value: 4, label: '求职信息' },
  { value: 5, label: '房屋销售' },
  { value: 6, label: '二手闲置' },
];

// 性别
export const GENDER = [
  { value: 0, label: '保密' },
  { value: 1, label: '男' },
  { value: 2, label: '女' },
];

// 用户创建/注册类型
export const CREATE_TYPE = [
  { value: 0, label: '管理平台' },
  { value: 1, label: '微信小程序' },
];
