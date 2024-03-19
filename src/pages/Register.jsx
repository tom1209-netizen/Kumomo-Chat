import { Form, Input, Button, Upload } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PlusOutlined } from '@ant-design/icons';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { auth, storage, db } from '../config/firebase-config';
import { doc, setDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import "../scss/Register.scss";

export default function Register() {
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const beforeImageUpload = file => {
    if (!["image/jpeg", "image/png"].includes(file.type)) {
      toast.error(`${file.name} is not a valid image type, please choose a jpg or png file`);
      return null;
    }
    return false;
  };

  const onImageChange = ({ fileList: newFileList }) => {
    const latestFileList = newFileList.slice(-1);
    setFile(latestFileList);
  };
  
  const handleOnSubmit = async ({userName, email, password}) => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const date = new Date().getTime();
      const storageRef = ref(storage, `user_profile_picture/${userName}-${date}`);

      const uploadFile = file && file.length > 0 ? file[0].originFileObj : null;
      const uploadTask = uploadBytesResumable(storageRef, uploadFile);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
        }, 
        (error) => {
          toast.error(`Image upload failed, error: ${error}`);
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            console.log('File available at', downloadURL);
            await updateProfile(res.user, {
              displayName: userName,
              photoURL: downloadURL
            })
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName: userName,
              email: email,
              photoURL: downloadURL
            })
            await setDoc(doc(db, "userChats", res.user.uid), {});
            toast.success("Sign up successful!");
            form.resetFields();
            navigate('/');
          });
        }
      );
    } catch (error) {
      console.log(error);
      toast.error('Sign up failed!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-container">
      <Form
        form={form}
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={handleOnSubmit}
      >
        <h1 className='form-header'>Kumomo</h1>
        <Form.Item
          name="userName"
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

        {/* What the fuck normFile is used for ? */}
        <Form.Item name="file" valuePropName="fileList" getValueFromEvent={normFile} className='image-upload-container'>
          <Upload 
            placeholder="Upload Image"
            beforeUpload={beforeImageUpload}
            listType="picture-card" 
            maxCount={1}
            onChange={onImageChange}
            multiple={false}>
            <button style={{ border: 0, background: 'none' }} type="button">
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Profile picture</div>
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
