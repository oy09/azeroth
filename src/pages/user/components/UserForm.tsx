import styles from './UserForm.scss';
import React, { useRef } from 'react';
import { Form, Input, Select, Button } from 'antd';
import { ReturnSubmitState } from '@/typing';

export interface FormProps {
  initialValue?: any;
  onCancel?: () => void;
  onSubmit?: (values: any) => Promise<ReturnSubmitState>;
}

const UserForm: React.FC<FormProps> = props => {
  const { initialValue, onCancel, onSubmit } = props;

  const formRef = useRef<any>();

  const defaultFormValue = {
    ...initialValue,
  };

  const handleFinish = (values: any) => {};

  const handleCancel = () => {
    onCancel && onCancel();
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
        <div className="tool">
          <Button htmlType="reset" onClick={handleCancel}>
            取消
          </Button>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UserForm;
