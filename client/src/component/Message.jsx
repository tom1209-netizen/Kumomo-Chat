import {
  useRef,
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { QuestionOutlined } from '@ant-design/icons';
import {
  Button,
  Modal,
  Typography,
  Image,
} from 'antd';
import Markdown from 'react-markdown';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import '../scss/Message.scss';

const { Paragraph } = Typography;

function Message({ message }) {
  const { auth } = useAuth();
  const currentLanguage = useLanguage();
  const currentUser = auth.user;
  const [answer, setAnswer] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message]);

  const fetchTranslateText = async () => {
    const loadingToast = toast.loading('Translating...');
    try {
      const response = await fetch('http://localhost:3003/api/ai/translate-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sentence: message.content, language: currentLanguage }),
      });
      const result = await response.json();
      setAnswer(result.text);

      toast.update(loadingToast, {
        render: 'Translation completed !',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(loadingToast, {
        render: 'Error getting translation.',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const fetchTranslateAudio = async () => {
    const loadingToast = toast.loading('Translating audio...');
    try {
      const response = await fetch('http://localhost:3003/api/ai/translate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ audioURL: message.audio, language: currentLanguage }),
      });
      const result = await response.json();
      setAnswer(result.translatedText);

      toast.update(loadingToast, {
        render: 'Audio translated !',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(loadingToast, {
        render: 'Error translating audio.',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const fetchTranslateImage = async () => {
    const loadingToast = toast.loading('Translating image...');
    try {
      const response = await fetch('http://localhost:3003/api/ai/translate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageURL: message.img, language: currentLanguage }),
      });
      const result = await response.json();
      setAnswer(result.translatedText);

      toast.update(loadingToast, {
        render: 'Image translated!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(loadingToast, {
        render: 'Error translating image.',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setAnswer('');
  };

  const handleShowBtn = () => {
    setIsModalOpen(true);
    if (message.audio) {
      fetchTranslateAudio();
    } else if (message.img) {
      fetchTranslateImage();
    } else {
      fetchTranslateText();
    }
  };

  return (
    <div ref={ref} className={`msg-block ${message.senderId === currentUser.id && 'user-msg'}`}>
      <div className="content">
        <div className="info">
          <p className="text">{message.content}</p>
          {message.img && (
            <>
              <Image width={200} className="img" src={message.img} alt="" />
              <Button
                shape="circle"
                size="small"
                type="primary"
                danger
                className="modal-btn"
                onClick={handleShowBtn}
              >
                <QuestionOutlined style={{ fontSize: '16px', fontWeight: 'bold' }} />
              </Button>
            </>
          )}

          {!message.img && !message.audio && (
            <Button
              shape="circle"
              size="small"
              type="primary"
              danger
              className="modal-btn"
              onClick={handleShowBtn}
            >
              <QuestionOutlined style={{ fontSize: '16px', fontWeight: 'bold' }} />
            </Button>
          )}

          {message.audio && (
            <>
              <audio controls>
                <source src={message.audio} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
              <Button
                shape="circle"
                size="small"
                type="primary"
                danger
                className="modal-btn"
                onClick={handleShowBtn}
              >
                <QuestionOutlined style={{ fontSize: '16px', fontWeight: 'bold' }} />
              </Button>
            </>
          )}
          <Modal
            title="Translation"
            open={isModalOpen}
            onOk={handleCancelModal}
            onCancel={handleCancelModal}
          >
            <Paragraph copyable><Markdown>{answer}</Markdown></Paragraph>
          </Modal>
        </div>
        <div className="timestamp">{message.timestamp.time}</div>
      </div>
    </div>
  );
}

Message.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string,
    content: PropTypes.string,
    img: PropTypes.string,
    audio: PropTypes.string,
    senderId: PropTypes.string,
    userLanguage: PropTypes.string,
    timestamp: PropTypes.shape({
      date: PropTypes.string,
      time: PropTypes.string,
    }),
  }).isRequired,
};

export default Message;
