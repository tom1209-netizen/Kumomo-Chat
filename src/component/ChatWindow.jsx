import "../scss/ChatWindow.scss";
import "../scss/UserCard.scss";
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
import Message from "./Message";
import { ChatContext } from "../context/ChatContext";
import { AuthContext } from "../context/AuthContext";
import { useContext, useState, useEffect } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import {
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { v4 as uuid } from 'uuid';
import { db, storage } from "../config/firebase-config";

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  console.log(`data in ChatWindow from ChatContext ${data}`)
  console.log(data)
  if (data?.user?.user) {
    console.log(data.user.user.uid);
  }

  const [content, setContent] = useState("");
  const [img, setImg] = useState(null);

  const getCurrentTime = ({ timezone = 'Asia/Ho_Chi_Minh' } = {}) => {
    const event = new Date(Date.now());
    const timestamp_raw = event.toLocaleString('en-GB', { timezone });
    const [date, fullTime] = timestamp_raw.split(",").map((value) => value.trim());

    const [hours, minutes] = fullTime.split(":");
    const time = `${hours}:${minutes}`;

    const timestamp = {
      date,
      time,
    }
    return timestamp;
  }

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (documentSnapshot) => {
      if (documentSnapshot.exists()) {
        console.log("Document exists.");
        setMessages(documentSnapshot.data().messages);
      } else {
        console.log("No such document!");
      }
    });
    return () => {
      unSub(); 
    };
  }, [data.chatId]);


  const handleMessageSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                content: content,
                senderId: currentUser.uid,
                timestamp: getCurrentTime(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          content: content,
          senderId: currentUser.uid,
          timestamp: getCurrentTime(),
        }),
      });
    }

    // TODO: Use server time in the future because getCurrentTime() is client time
    // so it will lead to inconsistencies in database if user is from different timezones
    // since this project is still quite simple and I don't have much time, I will leave it like this for now
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        content: content,
      },
      [data.chatId + ".timestamp"]: getCurrentTime(),
    });

    // FIXME: error here
    await updateDoc(doc(db, "userChats", data.user.user.uid), {
      [data.chatId + ".lastMessage"]: {
        content: content,
      },
      [data.chatId + ".timestamp"]: getCurrentTime(),
    });

    console.log("message reset")
    setContent("");
    setImg(null);
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="user-profile">
          <img src={data.user.user?.photoURL} className="profile-img" alt="" />
          {1 && <div className="active-indicator" />}
        </div>
        <div className="info">
          <h1 className="name">{data.user.user?.displayName}</h1>
          {1 && <p className="status">Active now</p>}
        </div>
        <div className="icons-container">
          <VideoCameraOutlined />
          <PhoneOutlined />
          <SearchOutlined />
          <DownOutlined />
        </div>
      </div>

      <div className="msgs-container">
        {messages.map((m) => (
          <Message message={m} key={m.id} />
        ))}
      </div>

      <div className="chat-bottom">
        <Input
          value={content}
          className="search-bar"
          placeholder="Write a message..."
          onChange={(e) => setContent(e.target.value)}
          prefix={<LinkOutlined style={{ color: "#709CE6", fontSize: "20px"}} />}
          suffix={<SmileOutlined style={{ color: "#709CE6", fontSize: "20px"}} />}
          onPressEnter={handleMessageSend}
        />
        <div className="send-block" onClick={handleMessageSend}>
          <SendOutlined style={{ color: "#FFFFFF", fontSize: "20px"}}/>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
