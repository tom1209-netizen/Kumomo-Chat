import React from 'react'
import "../scss/Message.scss";

function Message({ messageContent, messageTime, isUser }) {
  const messageClass = isUser ? 'msg-block user-msg' : 'msg-block';

  return (
    <div className={messageClass}>
      <div className="content">
        <div className="text">{messageContent}</div>
        <div className="timestamp">{messageTime}</div>
      </div>
    </div>
  )
}

export default Message