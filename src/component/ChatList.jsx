import { useState, useContext, useEffect } from 'react'
import { Input, AutoComplete, Avatar } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
  onSnapshot
} from "firebase/firestore";
import { db } from '../config/firebase-config';
import UserCard from './UserCard';
import "../scss/ChatList.scss"
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

function ChatList() {
  const [userName, setUserName] = useState("")
  const [suggestions, setSuggestions] = useState([]);
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChatList = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChatList();
  }, [currentUser.uid]);

  const handleChatSelect = (user) => {
    console.log(`user value in handleChatSelect ${user}`)
    console.log(user)
    dispatch({ type: "CHANGE_USER", payload: {user} });
  }

  const handleSearch = async () => {
    if (userName.trim() !== "") {
      const q = query(
        collection(db, "users"),
        where("displayName", ">=", userName),
        where("displayName", "<=", userName + '\uf8ff')
      );
      try {
        const querySnapshot = await getDocs(q);
        const users = [];
        querySnapshot.forEach((doc) => {
          users.push({
            value: doc.id, 
            label: (
              <div style={{ display: 'flex', alignItems: 'center', gap: "10px"}}>
                <Avatar size={40} icon={<UserOutlined />} src={doc.data().photoURL}/>
                {doc.data().displayName}
              </div>
            ), 
            userDetails: doc.data(), 
          });
        });
        setSuggestions(users);
      } catch (err) {
        console.log(err);
      }
    } else {
      setSuggestions([]);
    }
  }

  const handleSearchSelect = async (value, option) => {
    // Use selectedUserDetails because setUser will run in the next render
    setUserName(option.userDetails.displayName)
    const selectedUser = option.userDetails;
    const combinedId =
      currentUser.uid > selectedUser.uid
        ? currentUser.uid + selectedUser.uid
        : selectedUser.uid + currentUser.uid;  
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {

        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: selectedUser.uid,
            displayName: selectedUser.displayName,
            photoURL: selectedUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", selectedUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      console.log(err)
    }
  };

  return (
    <div className="chat-list">
      <div className="header">
        <h1>Kumomo Chat</h1>
      </div>
      <AutoComplete
        value={userName}
        onChange={(value) => setUserName(value)}
        options={suggestions}
        onSelect={(value, option) => handleSearchSelect(value, option)}
        onSearch={handleSearch}
        style={{ width: '100%' }}
      >
        <Input className='search-bar' placeholder="Search" prefix={<SearchOutlined style={{color: "#709CE6"}}/>}/>  
      </AutoComplete>

      <div className="chat-container">
        {/* TODO: Impliment the pinned chat feature */}

        {/* <h1>Pinned</h1>
        <div className="pinned-container">
          <UserCard userName={"Taniyama Tom"} time={"9:36"} latestMsg={"Hi"} active={true} />
          <UserCard userName={"Taniyama Tom"} time={"9:36"} latestMsg={"Hi"} active={true} />
        </div> */}
        <h1>All chat</h1>
        <div className="all-chats-container">
          {/* Chat[1] because chat 0 is the uid and 1 is the data */}
          {/* Look at the database for more details */}
          {Object.entries(chats)?.sort((a,b)=>b[1].date - a[1].date).map((chat) => (
            <UserCard 
              key={chat[0]} 
              userName={chat[1].userInfo.displayName} 
              profileUrl={chat[1].userInfo.photoURL}
              time={chat[1].timestamp?.time} 
              latestMsg={chat[1].lastMessage?.content} 
              onClick={() => handleChatSelect(chat[1].userInfo)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChatList