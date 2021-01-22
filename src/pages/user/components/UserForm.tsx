import styles from './UserForm.scss';
import React, { useRef, useState } from 'react';
import { Form, Input, Select, Button } from 'antd';
import { ReturnSubmitState } from '@/typing';
import { STATUS, CREATE_TYPE, GENDER, Values } from '@/utils/constant';

export interface FormProps {
  initialValue?: any;
  roleList?: any;
  onCancel?: () => void;
  onSubmit?: (values: any) => Promise<ReturnSubmitState>;
}

const UserForm: React.FC<FormProps> = props => {
  const { initialValue, onCancel, onSubmit } = props;

  const formRef = useRef<any>();
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [statusList] = useState(() => STATUS.filter(item => item.value !== 2));
  const [roleList] = useState(() => props.roleList || []);

  const defaultFormValue = {
    status: 1,
    gender: 0,
    type: 0,
    ...initialValue,
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

  const handleFinish = (values: any) => {
    setSubmitLoading(true);
    onSubmit &&
      onSubmit(values).then(state => {
        state !== false && formRef.current?.resetFields();
        setSubmitLoading(false);
      });
  };

  const handleCancel = () => {
    onCancel && onCancel();
    formRef.current?.resetFields();
  };

  return (
    <div className={styles.UserForm}>
      <Form
        size="large"
        ref={formRef}
        initialValues={defaultFormValue}
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
        <Form.Item name="status" label="状态" rules={[{ required: true, message: '请选择一个状态' }]}>
          <Select allowClear placeholder="请选择状态">
            {renderSelect(statusList)}
          </Select>
        </Form.Item>
        <Form.Item name="account" label="用户名" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input allowClear placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item name="mobile" label="电话号码">
          <Input allowClear placeholder="请输入电话号码" />
        </Form.Item>
        <Form.Item name="createType" label="创建类型" rules={[{ required: true, message: '请选择一个类型' }]}>
          <Select allowClear placeholder="请选择用户注册类型">
            {renderSelect(CREATE_TYPE)}
          </Select>
        </Form.Item>
        <Form.Item name="nick" label="昵称" rules={[{ required: true, message: '请输入昵称' }]}>
          <Input allowClear placeholder="请输入昵称" />
        </Form.Item>
        <Form.Item label="头像" hidden></Form.Item>
        <Form.Item name="gender" label="性别" rules={[{ required: true, message: '请选择一个性别' }]}>
          <Select allowClear placeholder="请选择性别">
            {renderSelect(GENDER)}
          </Select>
        </Form.Item>
        <Form.Item name="roleList" label="角色">
          <Select allowClear mode="multiple" placeholder="请选择角色">
            {renderSelect(roleList)}
          </Select>
        </Form.Item>
        <div className="tool">
          <Button htmlType="reset" onClick={handleCancel}>
            取消
          </Button>
          <Button type="primary" htmlType="submit" loading={submitLoading}>
            确定
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UserForm;
