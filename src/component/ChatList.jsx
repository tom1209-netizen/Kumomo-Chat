import { useState, useContext } from 'react'
import { Input, AutoComplete } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
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
} from "firebase/firestore";
import { db } from '../config/firebase-config';
import UserCard from './UserCard';
import "../scss/ChatList.scss"
import { AuthContext } from '../context/AuthContext';

function ChatList() {
  const [userName, setUserName] = useState("")
  const [suggestions, setSuggestions] = useState([]);
  const { currentUser } = useContext(AuthContext);

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
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src={doc.data().photoURL} alt="" style={{ width: 32, height: 32, marginRight: 8, borderRadius: '50%' }} />
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

  const handleSelect = async (value, option) => {
    // Use selectedUserDetails because setUser will run in the next render
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

    setUserName("")
  };

  return (
    <div className="chat-list">
      <div className="header">
        <h1>Kumomo Chat</h1>
      </div>
      <AutoComplete
        onChange={(value) => setUserName(value)}
        options={suggestions}
        onSelect={(value, option) => handleSelect(value, option)}
        onSearch={handleSearch}
        style={{ width: '100%' }}
      >
        <Input className='search-bar' placeholder="Search" prefix={<SearchOutlined style={{color: "#709CE6"}}/>}/>  
      </AutoComplete>

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