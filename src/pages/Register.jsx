import { Form, Input, Button, Upload } from 'antd';
import {UserOutlined, LockOutlined, MailOutlined, PlusOutlined} from '@ant-design/icons';
import "../scss/Register.scss";

export default function Register() {
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
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
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[{ required: true, message: 'Please input your email!' }]}
        >
          <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
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
        </Form.Item>

        <Form.Item valuePropName="fileList" getValueFromEvent={normFile} className='image-upload-container'>
          <p>Profile picture</p>
          <Upload action="/upload.do" listType="picture-card">
            <button style={{ border: 0, background: 'none' }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </button>
          </Upload>
        </Form.Item>

        <Form.Item className='sign-up-btn-container'>
          <Button type="primary" htmlType="submit" className="sign-up-btn">
            Sign Up
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
