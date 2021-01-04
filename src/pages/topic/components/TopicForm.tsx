import styles from './TopicForm.scss';
import React, { useState, useRef } from 'react';
import { Form, Button, Select, Switch, Input, Row, Col, DatePicker } from 'antd';
import { first } from 'lodash';
import { STATUS, TOPIC_TYPE } from '@/utils/constant';
import { firstTimeFromDay, toUnix } from '@/utils/dateUtils';

export interface FormProps {
  onCancel?: () => void;
  onSubmit?: (values: any) => Promise<void>;
  initialValues?: any;
  itemVisibleMap?: {
    [key: string]: boolean;
  };
}

const TopicForm: React.FC<FormProps> = props => {
  const { onCancel, onSubmit, initialValues: propsInitialValue, itemVisibleMap = {} } = props;
  const formRef = useRef<any>();
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [isTop, setTopState] = useState<boolean>(false);

  // 默认表单
  const initialValues = {
    status: 0,
    contentType: 1,
    ...propsInitialValue,
  };

  const handleFinish = (values: any) => {
    if (values.isTop) {
      values.topExpireTime = values.topExpireTime.format();
    }
    setSubmitLoading(true);
    onSubmit &&
      onSubmit(values).then(() => {
        formRef.current?.resetFields();
        setSubmitLoading(false);
      });
  };

  const handleFieldsChange = (change: any[], all: any[]) => {
    const field = first(change);
    if (field.name.includes('isTop')) {
      setTopState(!!field.value);
    }
  };

  const twoFromOneRow = {
    md: 10,
    lg: 8,
    xl: 6,
  };

  return (
    <div className={styles.topicForm}>
      <Form
        ref={formRef}
        size="large"
        initialValues={initialValues}
        labelCol={{
          md: 5,
          lg: 4,
          xl: 3,
        }}
        onFinish={handleFinish}
        onFieldsChange={handleFieldsChange}
      >
        <Form.Item name="id" label="ID" hidden>
          <Input readOnly disabled />
        </Form.Item>
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
        <Row gutter={20}>
          <Col span={12}>
            <Form.Item
              labelCol={twoFromOneRow}
              rules={[{ required: true, message: '请输入联系人电话' }]}
              name="concatMobile"
              label="联系人电话"
            >
              <Input placeholder="请输入联系人电话" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              labelCol={twoFromOneRow}
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
        <Row gutter={20}>
          {itemVisibleMap['isTop'] !== false && (
            <Col span={12}>
              <Form.Item name="isTop" label="是否置顶" valuePropName="checked" labelCol={twoFromOneRow}>
                <Switch checkedChildren="置顶" unCheckedChildren="否" />
              </Form.Item>
            </Col>
          )}
          {isTop && (
            <Col span={12}>
              <Form.Item
                name="topExpireTime"
                label="过期时间"
                labelCol={twoFromOneRow}
                rules={[{ required: isTop, message: '请选择一个过期时间' }]}
                normalize={value => {
                  if (value) {
                    return value
                      .set('hour', 23)
                      .set('minute', 59)
                      .set('second', 59)
                      .set('millisecond', 999);
                  }
                }}
              >
                <DatePicker
                  allowClear
                  placeholder="请选择时间"
                  showToday={false}
                  disabledDate={current => {
                    return toUnix(firstTimeFromDay()) > current.unix();
                  }}
                />
              </Form.Item>
            </Col>
          )}
        </Row>
        <div className="tool">
          <Button htmlType="reset" onClick={() => onCancel && onCancel()}>
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

export default TopicForm;
