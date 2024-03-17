import React from 'react'
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import UserCard from './UserCard';
import "../scss/ChatList.scss"

function ChatList() {
  return (
    <div className="chat-list">
      <div className="header">
        <h1>Kumomo Chat</h1>
      </div>
      <Input className='search-bar' placeholder="Search" prefix={<SearchOutlined style={{color: "#709CE6"}}/>}/>
      <div className="chat-container">
        <h1>Pinned</h1>
        <div className="pinned-container">
          <UserCard userName={"Taniyama Tom"} time={"9:36"} latestMsg={"Hi"} active={true} />
          <UserCard userName={"Taniyama Tom"} time={"9:36"} latestMsg={"Hi"} active={true} />
        </div>
        <h1>All chat</h1>
        <div className="all-chats-container">
          <UserCard userName={"Taniyama Tom"} time={"9:36"} latestMsg={"Hi"} active={true} />
          <UserCard userName={"Taniyama Tom"} time={"9:36"} latestMsg={"Hi"} active={true} />
          <UserCard userName={"Taniyama Tom"} time={"9:36"} latestMsg={"Hi"} active={true} />
          <UserCard userName={"Taniyama Tom"} time={"9:36"} latestMsg={"Hi"} active={true} />
        </div>
      </div>
    </div>
  )
}

export default ChatList