import {
  useContext,
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
import model from '../config/gemini-config';
import '../scss/Message.scss';

const { Paragraph } = Typography;

function Message({ message, currentLanguage }) {
  const { auth } = useAuth();
  const currentUser = auth.user;
  const [geminiResponse, setGeminiResponse] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [message]);

  async function geminiRun() {
    const loadingToast = toast.loading('Getting gemini response...');
    const prompt = `Imagine you are an advanced AI language teacher specialized in deconstructing any given input language into its 
      fundamental grammatical structure, syntax, and vocabulary. Your objective is to analyze sentences or phrases presented to you, identify 
      their grammatical components (such as verbs, nouns, adjectives, etc.), and explain these components and their relationships within the sentence. 
      Furthermore, you are to translate these explanations into ${currentLanguage}, ensuring they are clear, educational, and accessible to ${currentLanguage} speakers 
      learning this language. Use simple and engaging language to make the learning process as effective as possible, and provide examples to illustrate 
      your points when necessary. The sentence is ${message.content}`;

    try {
      const result = await model.generateContentStream(prompt);
      let text = '';
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        text += chunkText;
        setGeminiResponse(text);
      }

      toast.update(loadingToast, {
        render: 'Gemini responsded!',
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(loadingToast, {
        render: 'Error getting response.',
        type: 'error',
        isLoading: false,
        autoClose: 3000,
      });
    }
  }

  // Modal logic
  const handleShowBtn = () => {
    setIsModalOpen(true);
    geminiRun();
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
    setGeminiResponse('');
  };

  // TODO: Impliment gemini with image content type
  return (
    <div ref={ref} className={`msg-block ${message.senderId === currentUser.id && 'user-msg'}`}>
      <div className="content">
        <div className="info">
          <p className="text">{message.content}</p>
          {message.img && <Image width={200} className="img" src={message.img} alt="" />}
          {!message.img && (
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
          <Modal
            title="Gemini Response"
            open={isModalOpen}
            onOk={() => setIsModalOpen(false)}
            onCancel={handleCancelModal}
          >
            <Paragraph copyable><Markdown>{geminiResponse}</Markdown></Paragraph>
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
    senderId: PropTypes.string,
    userLanguage: PropTypes.string,
    timestamp: PropTypes.shape({
      date: PropTypes.string,
      time: PropTypes.string,
    }),
  }).isRequired,
  currentLanguage: PropTypes.string,
};

Message.defaultProps = {
  currentLanguage: 'vietnamese',
};

export default Message;
