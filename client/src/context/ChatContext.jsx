import { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';
import { AuthContext } from './AuthContext';
import generateChatId from '../utils/chatIDGenerator';

export const ChatContext = createContext();

export function ChatContextProvider({ children }) {
  const { auth } = useContext(AuthContext);
  const INITIAL_STATE = {
    chatId: 'null',
    user: {},
  };

  const chatReducer = (state, action) => {
    let user;
    let chatId;
    switch (action.type) {
      case 'CHANGE_USER':
        user = action.payload; // Assign values to the variables inside the case block
        chatId = generateChatId(auth.user.id, user.user._id);
        return {
          user,
          chatId,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return <ChatContext.Provider value={{ data: state, dispatch }}>{children}</ChatContext.Provider>;
}

ChatContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
