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
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import {
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { toast } from 'react-toastify';
import { ChatContext } from '../context/ChatContext';
import { AuthContext } from '../context/AuthContext';
import { db, storage } from '../config/firebase-config';
import { useLanguage } from '../context/LanguageContext';
import Message from './Message';

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const [content, setContent] = useState('');
  const [img, setImg] = useState(null);

  const [previewImage, setPreviewImage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const currentLanguage = useLanguage();

  const getCurrentTime = ({ timezone = 'Asia/Ho_Chi_Minh' } = {}) => {
    const event = new Date(Date.now());
    const timestampRaw = event.toLocaleString('en-GB', { timezone });
    const [date, fullTime] = timestampRaw.split(',').map((value) => value.trim());

    const [hours, minutes] = fullTime.split(':');
    const time = `${hours}:${minutes}`;

    const timestamp = {
      date,
      time,
    };
    return timestamp;
  };

  // Logic for getting the chat from the database
  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'chats', data.chatId), (documentSnapshot) => {
      if (documentSnapshot.exists()) {
        setMessages(documentSnapshot.data().messages);
      } else {
        console.log('No such document!');
      }
    });
    return () => {
      unSub();
    };
  }, [data.chatId]);

  // Logic for sending message
  const handleMessageSend = async () => {
    if (img) {
      const storageRef = ref(storage, `users_sent_image/${currentUser.uid}/${uuid()}`);

      const uploadFile = img && img.length > 0 ? img[0].originFileObj : null;
      const uploadTask = uploadBytesResumable(storageRef, uploadFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, 'chats', data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                content,
                senderId: currentUser.uid,
                timestamp: getCurrentTime(),
                img: downloadURL,
              }),
            });

            setImg(null);
          });
        },
      );
    } else {
      if (content === '') {
        toast.error('Message cannot be empty!');
        return;
      }

      await updateDoc(doc(db, 'chats', data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          content,
          senderId: currentUser.uid,
          timestamp: getCurrentTime(),
        }),
      });
    }

    // TODO: Use server time in the future because getCurrentTime() is client time
    // so it will lead to inconsistencies in database if user is from different timezones
    // since this project is still quite simple and I don't have much time
    // I will leave it like this for now
    await updateDoc(doc(db, 'userChats', currentUser.uid), {
      [`${data.chatId}.lastMessage`]: {
        content: content || 'Image',
      },
      [`${data.chatId}.timestamp`]: getCurrentTime(),
    });

    await updateDoc(doc(db, 'userChats', data.user.user.uid), {
      [`${data.chatId}.lastMessage`]: {
        content: content || 'Image',
      },
      [`${data.chatId}.timestamp`]: getCurrentTime(),
    });

    setContent('');
    setImg(null);
  };

  // Logic for uploading image
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

  // Handle modal logic
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

  return (
    <div className="chat-window">
      <div className="chat-header">
        {data.user.user ? (
          <>
            <div className="user-profile">
              <Avatar size={50} icon={<UserOutlined />} src={data.user.user?.photoURL} />
            </div>
            <div className="info">
              <h1 className="name">{data.user.user?.displayName}</h1>
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
        {messages.map((message) => (
          <Message message={message} key={message.id} currentLanguage={currentLanguage} />
        ))}
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
