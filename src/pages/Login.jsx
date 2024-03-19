import { Form, Input, Button, Checkbox } from 'antd';
import {LockOutlined, MailOutlined} from '@ant-design/icons';
import "../scss/Login.scss";

export default function Login() {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  return (
    <div className="form-container">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <h1 className='form-header'>Kumomo</h1>
        <Form.Item
          name="emai."
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item className='sign-in-btn-container'>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
        </Form.Item>
        <p>Need account ? <a href="">register now!</a></p>
      </Form>
    </div>
  )
}
