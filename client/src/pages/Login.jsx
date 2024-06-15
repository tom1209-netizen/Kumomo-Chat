import { Form, Input, Button } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/img/kumomo_logo.png';
import '../scss/Login.scss';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async ({ email, password }) => {
    const loadingToast = toast.loading('Logging in...');
    try {
      const response = await fetch('http://localhost:3003/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token, data.user); // Use the login function from context
        toast.update(loadingToast, {
          render: 'Login successful!',
          type: 'success',
          isLoading: false,
          autoClose: 3000,
        });
        navigate('/');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed!');
      }
    } catch (err) {
      console.log(err.message);
      toast.update(loadingToast, {
        render: err.message,
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="form-container">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
      >
        <div className="form-header">
          <img className="logo" src={logo} alt="logo" />
          <h1 className="heading">Kumomo</h1>
          <img className="logo" src={logo} alt="logo" />
        </div>
        <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
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

        <Form.Item className="sign-in-btn-container">
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
        </Form.Item>
        <p>
          Need an account?
          <Link to="/register"> Register now!</Link>
        </p>
      </Form>
    </div>
  );
}
