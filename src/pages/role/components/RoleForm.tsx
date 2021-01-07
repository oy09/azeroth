import styles from './RoleForm.scss';
import React, { useState } from 'react';
import { Form, Button, Input, Select } from 'antd';
import { STATUS } from '@/utils/constant';
import { ReturnSubmitState } from '@/typing';

export interface FormProps {
  onCancel?: () => void;
  onSubmit?: (values: any) => Promise<ReturnSubmitState>;
  initialValues?: any;
  itemVisibleMap?: {
    [key: string]: boolean;
  };
}

const RoleForm: React.FC<FormProps> = props => {
  const { onCancel, onSubmit, initialValues: propsInitialValue } = props;

  const [statusList] = useState(() => STATUS.filter(item => item.value !== 2));
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const initialValue = {
    status: 1,
    ...propsInitialValue,
  };

  const handleFinish = (values: any) => {
    setSubmitLoading(true);
    onSubmit &&
      onSubmit(values).then(() => {
        setSubmitLoading(false);
      });
  };

  console.log('loading:', submitLoading);

  return (
    <div className={styles.RoleForm}>
      <Form
        size="large"
        initialValues={initialValue}
        onFinish={handleFinish}
        labelCol={{
          md: 5,
          lg: 4,
          xl: 3,
        }}
      >
        <Form.Item name="id" label="ID" hidden>
          <Input readOnly disabled />
        </Form.Item>
        <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
          <Select allowClear placeholder="请选择状态">
            {statusList.map(item => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="code" label="编码" rules={[{ required: true, message: '请输入编码' }]}>
          <Input allowClear placeholder="请输入编码" />
        </Form.Item>
        <Form.Item name="name" label="名称" rules={[{ required: true, message: '请输入名称' }]}>
          <Input allowClear placeholder="请输入名称" />
        </Form.Item>
        <Form.Item name="comment" label="备注">
          <Input.TextArea allowClear placeholder="角色备注信息" />
        </Form.Item>
        <div className="tool">
          <Button htmlType="reset" onClick={() => onCancel && onCancel()}>
            取消
          </Button>
          <Button htmlType="submit" type="primary">
            确认
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default RoleForm;
