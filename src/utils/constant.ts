/**
 * 业务常量
 * @author ouyang
 */

export interface Values {
  value: number;
  label: string;
}

// 状态
export const STATUS = [
  { value: 0, label: '禁用' },
  { value: 1, label: '启用' },
  { value: 2, label: '删除' },
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
