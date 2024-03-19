import React from 'react'
import {
  DownOutlined,
  PhoneOutlined,
  SearchOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import "../scss/ChatHeader.scss";
import user_profile from "../assets/img/user_profile.jpg";

function ChatHeader() {
  return (
    <div className="chat-header">
      <div className="user-profile">
        <img src={user_profile} className="profile-img" alt="" />
        {1 && <div className="active-indicator" />}
      </div>
      <div className="info">
        <h1 className="name">{"khang le"}</h1>
        {1 && <p className="status">Active now</p>}
      </div>
      <div className="icons-container">
        <VideoCameraOutlined />
        <PhoneOutlined />
        <SearchOutlined />
        <DownOutlined />
      </div>
  </div>
  )
}

export default ChatHeader