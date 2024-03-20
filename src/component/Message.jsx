import { useContext, useRef, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import "../scss/Message.scss";

function Message({ message }) {
  const { currentUser } = useContext(AuthContext);
  // const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div 
      ref={ref}
      className={`msg-block ${message.senderId === currentUser.uid && 'user-msg'}`}>
      <div className="content">
        <div className="text">{message.content}</div>
        <div className="timestamp">{message.timestamp.time}</div>
      </div>
    </div>
  )
}

export default Message