import '../scss/ChatWindow.scss';
import {
  LinkOutlined,
  SmileOutlined,
  SendOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Input,
  Upload,
  Modal,
  Avatar,
} from 'antd';
import {
  useContext,
  useState,
  useEffect,
} from 'react';
import { toast } from 'react-toastify';
import { ChatContext } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Message from './Message';

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const { auth } = useAuth();
  const { data } = useContext(ChatContext);

  const [content, setContent] = useState('');
  const [img, setImg] = useState(null);

  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const currentLanguage = useLanguage();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`http://localhost:3003/api/chats/${data.chatId}`);
        if (response.ok) {
          const responseMessage = await response.json();
          setMessages(responseMessage);
        } else {
          throw new Error('Failed to fetch messages');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (data.chatId) {
      fetchMessages();
    }
  }, [data.chatId]);

  const handleMessageSend = async () => {
    const formData = new FormData();
    console.log(data.chatId);
    console.log(auth.user.id);
    console.log(content);
    formData.append('chatId', data.chatId);
    formData.append('senderId', auth.user.id);
    formData.append('content', content);

    if (img && img.length > 0) {
      formData.append('img', img[0].originFileObj);
    }

    try {
      const response = await fetch('http://localhost:3003/api/chats/send', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newMessage = await response.json();
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast.error(error.message);
    }

    setContent('');
    setImg(null);
  };

  const handlePreview = async (file) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setPreviewImage(fileReader.result);
      setPreviewVisible(true);
    };
    fileReader.readAsDataURL(file);
  };

  const handleCancelPreview = () => {
    setPreviewVisible(false);
  };

  const handleOkPreview = () => {
    setPreviewVisible(false);
    handleMessageSend();
  };

  const beforeImageUpload = (file) => {
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error(`${file.name} is not a valid image type, please choose a jpg or png file`);
      return null;
    }
    return false;
  };

  const onImageChange = ({ fileList: newFileList }) => {
    const latestFileList = newFileList.slice(-1);
    setImg(latestFileList);

    handlePreview(latestFileList[0].originFileObj);
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        {data.user.user ? (
          <>
            <div className="user-profile">
              <Avatar size={50} icon={<UserOutlined />} src={data.user.user?.photoURL} />
            </div>
            <div className="info">
              <h1 className="name">{data.user.user?.userName}</h1>
            </div>
          </>
        ) : (
          // Skeleton loader for user profile
          <>
            <div className="user-profile">
              <div className="profile-img-skeleton skeleton-loader" />
            </div>
            <div className="info">
              <div className="name-skeleton skeleton-loader" />
            </div>
          </>
        )}
      </div>

      <div className="msgs-container">
        {messages.length > 0 && (
          messages.map((message) => (
            <Message message={message} key={message._id} currentLanguage={currentLanguage} />
          ))
        )}
      </div>

      <div className="chat-bottom">
        <Modal
          title="Picture Preview"
          open={previewVisible}
          onCancel={handleCancelPreview}
          onOk={handleOkPreview}
          okText="Send"
          centered
        >
          <img alt="preview" style={{ width: '100%' }} src={previewImage} />
        </Modal>
        <Input
          value={content}
          className="search-bar"
          placeholder="Write a message..."
          onChange={(e) => setContent(e.target.value)}
          prefix={(
            <Upload
              beforeUpload={beforeImageUpload}
              onChange={onImageChange}
              showUploadList={false}
              maxCount={1}
            >
              <LinkOutlined style={{ color: '#709CE6', fontSize: '20px' }} />
            </Upload>
          )}
          suffix={<SmileOutlined style={{ color: '#709CE6', fontSize: '20px' }} />}
          onPressEnter={handleMessageSend}
        />
        <div className="send-block" onClick={handleMessageSend}>
          <SendOutlined style={{ color: '#FFFFFF', fontSize: '20px' }} />
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
