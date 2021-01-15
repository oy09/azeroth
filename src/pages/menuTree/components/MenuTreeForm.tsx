import styles from './MenuTreeForm.scss';
import React, { useState, useRef } from 'react';
import { Form, Button, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { STATUS, Values } from '@/utils/constant';
import { ReturnSubmitState } from '@/typing';

export interface FormProps {
  onCancel?: () => void;
  onSubmit?: (values: FormValues) => Promise<ReturnSubmitState>;
  initialValues?: any;
  menuList?: Values[];
}

export interface FormValues {
  status: number;
  id?: string;
  children: FormValues[];
}

const MenuTreeForm: React.FC<FormProps> = props => {
  const { menuList, initialValues, onCancel, onSubmit } = props;
  const formRef = useRef<FormInstance>();
  const [statusList] = useState<Values[]>(() => STATUS.filter(item => item.value !== 2));
  const [submitloading, setSubmitLoading] = useState<boolean>(false);

  const defaultValues = {
    status: 1,
    ...initialValues,
  };

  const handleCancel = () => {
    onCancel && onCancel();
  };

  const handleFinish = (values: FormValues) => {
    setSubmitLoading(true);
    onSubmit &&
      onSubmit(values).then(() => {
        setSubmitLoading(false);
      });
  };

  const renderSelect = (data: Values[] = []) => {
    return data.map(item => {
      return (
        <Select.Option key={item.value} value={item.value}>
          {item.label}
        </Select.Option>
      );
    });
  };

  return (
    <div className={styles.MenuTreeForm}>
      <Form
        size="large"
        ref={formRef as any}
        initialValues={defaultValues}
        onFinish={handleFinish}
        labelCol={{
          md: 5,
          lg: 4,
          xl: 3,
        }}
      >
        <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择状态' }]}>
          <Select allowClear placeholder="请选择状态">
            {renderSelect(statusList)}
          </Select>
        </Form.Item>
        {defaultValues.id && (
          <Form.Item name="id" label="根节点">
            <Select allowClear disabled placeholder="请选择节点">
              {renderSelect(menuList)}
            </Select>
          </Form.Item>
        )}
        <Form.Item name="children" label="子节点" rules={[{ required: true, message: '至少选择一个节点' }]}>
          <Select allowClear mode="multiple" placeholder="请选择节点">
            {renderSelect(menuList)}
          </Select>
        </Form.Item>
        <Form.Item className="tool">
          <Button key="reset" onClick={handleCancel}>
            取消
          </Button>
          <Button key="submit" type="primary" htmlType="submit" loading={submitloading}>
            确定
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MenuTreeForm;
