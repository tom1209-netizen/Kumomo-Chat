import { useState, useContext, useEffect } from 'react';
import { Input, AutoComplete, Avatar } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import UserCard from './UserCard';
import '../scss/ChatList.scss';
import { useAuth } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import { generateChatId } from '../utils/chatIDGenerator';

function ChatList() {
  const [userName, setUserName] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [chats, setChats] = useState([]);

  const { auth } = useAuth();
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(`http://localhost:3003/api/chats/user/${auth.user.id}`);
        if (response.ok) {
          const userChats = await response.json();
          setChats(userChats);
        } else {
          throw new Error('Failed to fetch chats');
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    if (auth.user.id) {
      fetchChats();
    }
  }, [auth.user.id]);

  const handleChatSelect = (user) => {
    dispatch({ type: 'CHANGE_USER', payload: { user } });
  };

  const handleSearch = async (value) => {
    setUserName(value);
    if (value.trim() !== '') {
      try {
        const response = await fetch(`http://localhost:3003/api/users/search?username=${value}`);
        if (response.ok) {
          const users = await response.json();
          const userSuggestions = users.map((user) => ({
            value: user._id,
            label: (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Avatar size={40} icon={<UserOutlined />} src={user.photoURL} />
                {user.userName}
              </div>
            ),
            userDetails: user,
          }));
          setSuggestions(userSuggestions);
        } else {
          throw new Error('Failed to search users');
        }
      } catch (error) {
        console.error('Error searching users:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSelect = async (value, option) => {
    setUserName(option.userDetails.userName);
    const selectedUser = option.userDetails;
    const combinedId = generateChatId(auth.user.id, selectedUser._id);

    try {
      const response = await fetch(`http://localhost:3003/api/chats/${combinedId}`);
      if (!response.ok) {
        // Create a new chat if it doesn't exist
        await fetch('http://localhost:3003/api/chats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chatId: combinedId, userIds: [auth.user.id, selectedUser._id] }),
        });

        await fetch(`http://localhost:3003/api/userchats/${auth.user.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatId: combinedId,
            userInfo: {
              uid: selectedUser._id,
              userName: selectedUser.userName,
              photoURL: selectedUser.photoURL,
            },
          }),
        });

        await fetch(`http://localhost:3003/api/userchats/${selectedUser._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chatId: combinedId,
            userInfo: {
              uid: auth.user.id,
              userName: auth.user.userName,
              photoURL: auth.user.photoURL,
            },
          }),
        });
      }
      handleChatSelect(selectedUser);
    } catch (error) {
      console.error('Error handling chat select:', error);
    }
  };

  return (
    <div className="chat-list">
      <div className="header">
        <h1>Kumomo Chat</h1>
      </div>
      <AutoComplete
        value={userName}
        onChange={(value) => handleSearch(value)}
        options={suggestions}
        onSelect={(value, option) => handleSearchSelect(value, option)}
        style={{ width: '100%' }}
      >
        <Input
          className="search-bar"
          placeholder="Search"
          prefix={<SearchOutlined style={{ color: '#709CE6' }} />}
        />
      </AutoComplete>

      <div className="chat-container">
        <h1>All chats</h1>
        <div className="all-chats-container">
          {console.log(chats)}
          {Object.entries(chats)
            ?.sort((a, b) => new Date(b[1].timestamp?.date) - new Date(a[1].timestamp?.date))
            .map((chat) => (
              <UserCard
                key={chat[0]}
                userName={chat[1].userInfo.userName}
                profileUrl={chat[1].userInfo.photoURL}
                time={chat[1].timestamp?.time}
                latestMsg={chat[1].lastMessage?.content}
                onClick={() => handleChatSelect(chat[1].userInfo)}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default ChatList;
