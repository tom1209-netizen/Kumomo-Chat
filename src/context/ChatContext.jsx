import {
  createContext,
  useContext,
  useReducer,
} from "react";
import { AuthContext } from "./AuthContext.jsx";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const INITIAL_STATE = {
    chatId: 'null',
    user: {},
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        // Checker
        console.log('Current user UID:', currentUser?.uid); 
        console.log('Payload UID:', action.payload?.uid);
        console.log("Payload fixed UID:", action.payload.user.uid)

        // The problem is in payload UID !
        return {
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.user.uid
              ? currentUser.uid + action.payload.user.uid
              : action.payload.user.uid + currentUser.uid,
        };

      default:
        return state;
    }
  };


  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};