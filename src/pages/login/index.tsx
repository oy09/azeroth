import React, { useState } from 'react';
import styles from './login.scss';
import { Form, Checkbox, Button, Input } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useStore } from 'umi';
import { LoginParamsType } from '@/api/login';

export interface LoginPageProps {
  //
}

const LoginPage: React.FC<LoginPageProps> = props => {
  const [autoLogin, setAutoLogin] = useState(false);
  const { dispatch } = useStore();
  // const { getItem, setItem, ... } useLocalStroage()
  // const initialFormValue = getItem('login')
  //

  const saveDataToDisk = (value: any) => {
    localStorage.setItem('login', value);
  };

  const handleSumit = (values: LoginParamsType) => {
    autoLogin && saveDataToDisk(values);
    const nextValues = { ...values };
    dispatch({ type: 'user/login', payload: nextValues });
  };

  return (
    <div className={styles.loginPage}>
      <Form onFinish={handleSumit} className="login-form">
        <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
          <Input allowClear size="large" prefix={<UserOutlined style={{ color: '#889aa4' }} />} placeholder="用户名" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
          <Input.Password
            allowClear
            size="large"
            prefix={<LockOutlined style={{ color: '#889aa4' }} />}
            placeholder="密码"
            type="password"
          />
        </Form.Item>
        <div className="help">
          <Checkbox checked={autoLogin} onChange={e => setAutoLogin(e.target.checked)}>
            自动登录
          </Checkbox>
          <a className="forget">忘记密码</a>
        </div>
        <Form.Item>
          <Button className="login" size="large" type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
