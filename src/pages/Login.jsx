import { Form, Input, Button, Checkbox } from 'antd';
import {LockOutlined, MailOutlined} from '@ant-design/icons';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase-config.js";
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from "../assets/img/kumomo_logo.png"

import "../scss/Login.scss";

export default function Login() {
  const navigate = useNavigate(); 

  const handleSubmit = async ({email, password}) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="form-container">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
      >
        <div className='form-header'>
          <img className='logo' src={logo} alt="logo" />
          <h1 className='heading'>Kumomo</h1>
          <img className='logo' src={logo} alt="logo" />
        </div>
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

        <Form.Item className='sign-in-btn-container'>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
        </Form.Item>
        <p>Need account ? <Link to="/register">register now!</Link></p>
      </Form>
    </div>
  )
}
