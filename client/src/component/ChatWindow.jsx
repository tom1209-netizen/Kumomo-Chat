import '../scss/ChatWindow.scss';
import {
  LinkOutlined,
  CustomerServiceOutlined,
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
import AudioRecorder from './AudioRecorder';
import useWindowDimensions from '../hooks/useWindowDimensions';

function ChatWindow() {
  // All messages
  const [messages, setMessages] = useState([]);

  // User data
  const { auth } = useAuth();
  const { data } = useContext(ChatContext);

  // Input state
  const [content, setContent] = useState('');
  const [img, setImg] = useState(null);

  // Image state
  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);

  // Audio state
  const [isAudioModalVisible, setIsAudioModalVisible] = useState(false);

  // Current language
  const currentLanguage = useLanguage();

  // Custom hook to get current window width
  const { width } = useWindowDimensions();

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

  const handleMessageSend = async (audioBlob = null) => {
    const formData = new FormData();
    formData.append('chatId', data.chatId);
    formData.append('senderId', auth.user.id);
    formData.append('content', content);

    if (img && img.length > 0) {
      formData.append('file', img[0].originFileObj);
    }

    if (audioBlob) {
      formData.append('file', audioBlob, 'recording.wav');
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

  // Handle image modal
  const handleImagePreview = async (file) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setPreviewImage(fileReader.result);
      setPreviewVisible(true);
    };
    fileReader.readAsDataURL(file);
  };

  const handleImageCancelPreview = () => {
    setPreviewVisible(false);
  };

  const handleImageOkPreview = () => {
    setPreviewVisible(false);
    handleMessageSend();
  };

  // Image checking
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

    handleImagePreview(latestFileList[0].originFileObj);
  };

  // Handle audio modal
  const showAudioModal = () => {
    setIsAudioModalVisible(true);
  };

  const handleAudioOk = () => {
    setIsAudioModalVisible(false);
  };

  const handleAudioCancel = () => {
    setIsAudioModalVisible(false);
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
          onCancel={handleImageCancelPreview}
          onOk={handleImageOkPreview}
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
          suffix={(
            <CustomerServiceOutlined
              style={{ color: '#709CE6', fontSize: '20px' }}
              onClick={showAudioModal}
            />
          )}
          onPressEnter={handleMessageSend}
        />
        <div className="send-block" onClick={handleMessageSend}>
          <SendOutlined style={{ color: '#FFFFFF', fontSize: '20px' }} />
        </div>
      </div>
      <Modal
        title="Voice Recorder"
        visible={isAudioModalVisible}
        onOk={handleAudioOk}
        onCancel={handleAudioCancel}
        footer={null}
        centered
        style={{ width: `${70 * width / 100}px`, minWidth: `${60 * width / 100}px` }}
      >
        <AudioRecorder onSave={(audioBlob) => {
          handleMessageSend(audioBlob);
          setIsAudioModalVisible(false);
        }}
        />
      </Modal>
    </div>
  );
}

export default ChatWindow;
