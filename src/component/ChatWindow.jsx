import "../scss/ChatWindow.scss";
import "../scss/UserCard.scss";
import user_profile from "../assets/img/user_profile.jpg";
import {
  DownOutlined,
  PhoneOutlined,
  SearchOutlined,
  VideoCameraOutlined,
  LinkOutlined,
  SmileOutlined,
  SendOutlined
} from "@ant-design/icons";
import { Input } from "antd";

function ChatWindow({ userName, active }) {
  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="user-profile">
          <img src={user_profile} className="profile-img" alt="" />
          {active && <div className="active-indicator" />}
        </div>
        <div className="info">
          <h1 className="name">{userName}</h1>
          {active && <p className="status">Active now</p>}
        </div>
        <div className="icons-container">
          <VideoCameraOutlined />
          <PhoneOutlined />
          <SearchOutlined />
          <DownOutlined />
        </div>
      </div>
      <div className="msgs-container">
        
      </div>
      <div className="chat-bottom">
        <Input
          className="search-bar"
          placeholder="Write a message..."
          prefix={<LinkOutlined style={{ color: "#709CE6", fontSize: "20px"}} />}
          suffix={<SmileOutlined style={{ color: "#709CE6", fontSize: "20px"}} />}
        />
        <div className="send-block">
          <SendOutlined style={{ color: "#FFFFFF", fontSize: "20px"}}/>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
