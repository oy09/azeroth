import styles from './TopicForm.scss';
import React from 'react';
import { Form, Button, Select, Switch, Input, Row, Col } from 'antd';
import { STATUS, TOPIC_TYPE } from '@/utils/constant';

export interface FormProps {
  onCancel?: () => void;
  onSubmit?: (values: any) => void;
  initialValues?: any;
}

const TopicForm: React.FC<FormProps> = props => {
  // 默认表单
  const initialValues = {
    status: 0,
    contentType: 1,
  };

  return (
    <div className={styles.topicForm}>
      <Form
        size="large"
        initialValues={initialValues}
        labelCol={{
          span: 3,
        }}
        onFinish={values => props?.onSubmit && props.onSubmit(values)}
      >
        <Form.Item rules={[{ required: true, message: '请选择一个状态' }]} name="status" label="状态">
          <Select allowClear placeholder="请选择状态">
            {STATUS.map(item => (
              <Select.Option value={item.value} key={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item rules={[{ required: true, message: '请选择一个类型' }]} name="contentType" label="类型">
          <Select allowClear placeholder="请选择类型">
            {TOPIC_TYPE.map(item => (
              <Select.Option value={item.value} key={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item rules={[{ required: true, message: '请输入内容' }]} name="content" label="内容">
          <Input.TextArea placeholder="请输入内容" />
        </Form.Item>
        <Row gutter={15}>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 6 }}
              rules={[{ required: true, message: '请输入联系人电话' }]}
              name="concatMobile"
              label="联系人电话"
            >
              <Input placeholder="请输入联系人电话" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelCol={{ span: 6 }}
              rules={[{ required: true, message: '请输入联系人姓名' }]}
              name="concatName"
              label="联系人姓名"
            >
              <Input placeholder="请输入联系人姓名" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item rules={[{ required: true, message: '请输入联系人地址' }]} name="addressName" label="联系地址">
          <Input placeholder="请输入联系人地址" />
        </Form.Item>
        <Form.Item name="isTop" label="是否置顶" valuePropName="checked">
          <Switch checkedChildren="置顶" unCheckedChildren="否" />
        </Form.Item>
        <div className="tool">
          <Button htmlType="reset" onClick={() => props?.onCancel && props.onCancel()}>
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

export default TopicForm;
