import styles from './MenuForm.scss';
import React, { useRef, useState } from 'react';
import { Form, Button, Input, Select, Row, Col } from 'antd';
import { STATUS, Values } from '@/utils/constant';

export interface FormProps {
  onCancel?: () => void;
  onSubmit?: (values: any) => Promise<void>;
  initialValues?: any;
}

const MenuForm: React.FC<FormProps> = props => {
  const { initialValues, onCancel, onSubmit } = props;
  const formRef = useRef<any>();
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [statusList] = useState<Values[]>(() => STATUS.filter(item => item.value !== 2));

  const defaultFormValue = {
    status: 0,
    ...initialValues,
  };

  const handleFinish = (values: any) => {
    setSubmitLoading(true);
    onSubmit &&
      onSubmit(values).then(() => {
        formRef.current?.resetFields();
        setSubmitLoading(false);
      });
  };

  const handleCancel = () => {
    onCancel && onCancel();
    formRef.current?.resetFields();
  };

  const twoFromOneRow = {
    md: 10,
    lg: 8,
    xl: 6,
  };

  console.log('123:', submitLoading);

  return (
    <div className={styles.menuForm}>
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
        <Form.Item rules={[{ required: true, message: '请选择一个状态' }]} name="status" label="状态">
          <Select allowClear placeholder="请选择状态">
            {statusList.map(item => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item rules={[{ required: true, message: '请输入编码' }]} labelCol={twoFromOneRow} name="code" label="编码">
              <Input allowClear placeholder="请输入编码" maxLength={10} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item rules={[{ required: true, message: '请输入名称' }]} labelCol={twoFromOneRow} name="name" label="名称">
              <Input allowClear placeholder="请输入名称" maxLength={50} />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="url" label="超链接">
          <Input allowClear placeholder="请输入超链接" />
        </Form.Item>
        <Form.Item name="comment" label="备注">
          <Input.TextArea placeholder="请输入备注" />
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

export default MenuForm;
