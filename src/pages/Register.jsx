import {
  Form,
  Input,
  Button,
  Upload,
  Select,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PlusOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  auth,
  storage,
  db,
} from '../config/firebase-config';
import 'react-toastify/dist/ReactToastify.css';
import '../scss/Register.scss';
import logo from '../assets/img/kumomo_logo.png';

export default function Register() {
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState(null);
  const navigate = useNavigate();

  const beforeImageUpload = (file) => {
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error(`${file.name} is not a valid image type, please choose a jpg or png file`);
      return null;
    }
    return false;
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onImageChange = ({ fileList: newFileList }) => {
    const latestFileList = newFileList.slice(-1);
    setFile(latestFileList);
  };

  const handleOnSubmit = async ({ userName, email, password }) => {
    const loadingToast = toast.loading('Signing up...');

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const date = new Date().getTime();
      const storageRef = ref(storage, `user_profile_picture/${userName}-${date}`);

      const uploadFile = file && file.length > 0 ? file[0].originFileObj : null;
      const uploadTask = uploadBytesResumable(storageRef, uploadFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          toast.error(`Image upload failed, error: ${error}`);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(res.user, {
              displayName: userName,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, 'users', res.user.uid), {
              uid: res.user.uid,
              displayName: userName,
              email,
              photoURL: downloadURL,
              language,
            });

            await setDoc(doc(db, 'userChats', res.user.uid), {});
            toast.update(loadingToast, {
              render: 'Sign up successful!',
              type: 'success',
              isLoading: false,
              autoClose: 3000,
            });
            form.resetFields();
            navigate('/');
          });
        },
      );
    } catch (error) {
      toast.update(loadingToast, {
        render: 'Sign up failed!',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  // Language select logic
  const languageOptions = [
    { value: 'vietnamese', label: 'Vietnamese' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'english', label: 'English' },
    { value: 'spanish', label: 'Spanish' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'russian', label: 'Russian' },
    { value: 'korean', label: 'Korean' },
    { value: 'italian', label: 'Italian' },
    { value: 'portuguese', label: 'Portuguese' },
    { value: 'arabic', label: 'Arabic' },
    { value: 'dutch', label: 'Dutch' },
    { value: 'swedish', label: 'Swedish' },
    { value: 'norwegian', label: 'Norwegian' },
    { value: 'turkish', label: 'Turkish' },
    { value: 'polish', label: 'Polish' },
    { value: 'finnish', label: 'Finnish' },
    { value: 'danish', label: 'Danish' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'thai', label: 'Thai' },
    { value: 'indonesian', label: 'Indonesian' },
    { value: 'greek', label: 'Greek' },
  ];

  const onChange = (value) => {
    setLanguage(value);
  };

  const filterOption = (input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  return (
    <div className="form-container">
      <Form
        form={form}
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={handleOnSubmit}
      >
        <div className="form-header">
          <img className="logo" src={logo} alt="logo" />
          <h1 className="heading">Kumomo</h1>
          <img className="logo" src={logo} alt="logo" />
        </div>
        <Form.Item
          name="userName"
          rules={[
            { required: true, message: 'Please input your Username!' },
            { min: 3, message: 'username must be at least 3 characters' },
            { max: 8, message: 'username must be at most 8 characters' }
          ]}
          hasFeedback>
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
          hasFeedback
        >
          <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: 'Please input your Password!' },
            { min: 6, message: 'password must be at least 6 characters' },
          ]}
          hasFeedback
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item
          name="language"
          rules={[{ required: true, message: 'Please choose your language!' }]}
          hasFeedback
        >
          <Select
            prefix={<GlobalOutlined className="site-form-item-icon" />}
            showSearch
            placeholder="Select a language"
            optionFilterProp="children"
            onChange={onChange}
            filterOption={filterOption}
            options={languageOptions}
          />
        </Form.Item>

        {/* TODO: Impliment many rule for form */}
        <Form.Item
          name="file"
          valuePropName="fileList"
          className="image-upload-container"
          getValueFromEvent={normFile}
        >
          <Upload
            placeholder="Upload Image"
            beforeUpload={beforeImageUpload}
            listType="picture-card"
            maxCount={1}
            onChange={onImageChange}
            multiple={false}
          >
            <button style={{ border: 0, background: 'none' }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Profile picture</div>
            </button>
          </Upload>
        </Form.Item>

        <Form.Item className="sign-up-btn-container">
          <Button type="primary" htmlType="submit" className="sign-up-btn">
            Sign Up
          </Button>
        </Form.Item>
        <p>
          Already have account ?
          <Link to="/login">login</Link>
        </p>
      </Form>
    </div>
  );
}
